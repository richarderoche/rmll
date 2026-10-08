'use client'

import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {Suspense, useCallback, useEffect, useMemo, useRef, useState} from 'react'

import type {PbEventsFeedSection} from '@/types'

import Button from '../shared/Button'
import type {SelectOption} from '../shared/Select'
import SelectComponent from '../shared/Select'
import SiteWidth from '../shared/SiteWidth'

gsap.registerPlugin(useGSAP)

type PbEvent = NonNullable<NonNullable<PbEventsFeedSection['events']>[number]>

/** Query keys for shareable event feed filters (`?eventLocation=…&eventType=…`). */
const EVENT_LOCATION_PARAM = 'eventLocation'
const EVENT_TYPE_PARAM = 'eventType'

export default function SectionEventsFeed({section}: {section: PbEventsFeedSection}) {
  return (
    <Suspense fallback={null}>
      <SectionEventsFeedInner section={section} />
    </Suspense>
  )
}

function SectionEventsFeedInner({section}: {section: PbEventsFeedSection}) {
  const {title, events, showMoreQty} = section
  const pageSize = showMoreQty ?? 5
  const hasEvents = events && events.length > 0
  const allLocations = hasEvents ? getSelectOptions(events, 'locations') : []
  const allTags = hasEvents ? getSelectOptions(events, 'tags') : []

  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const locationSlug = useMemo(
    () => filterSlugFromParam(searchParams.get(EVENT_LOCATION_PARAM), allLocations),
    [searchParams, allLocations],
  )
  const tagSlug = useMemo(
    () => filterSlugFromParam(searchParams.get(EVENT_TYPE_PARAM), allTags),
    [searchParams, allTags],
  )

  const [visibleCount, setVisibleCount] = useState(pageSize)

  const replaceFilterParams = useCallback(
    (updates: {location?: string | null; type?: string | null}) => {
      const params = new URLSearchParams(searchParams.toString())

      if (updates.location !== undefined) {
        if (updates.location) params.set(EVENT_LOCATION_PARAM, updates.location)
        else params.delete(EVENT_LOCATION_PARAM)
      }
      if (updates.type !== undefined) {
        if (updates.type) params.set(EVENT_TYPE_PARAM, updates.type)
        else params.delete(EVENT_TYPE_PARAM)
      }

      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, {scroll: false})
    },
    [pathname, router, searchParams],
  )

  const filteredEvents = useMemo(
    () =>
      hasEvents ? events.filter((event) => eventMatchesFilters(event, locationSlug, tagSlug)) : [],
    [events, hasEvents, locationSlug, tagSlug],
  )

  const targetEvents = useMemo(
    () => filteredEvents.slice(0, visibleCount),
    [filteredEvents, visibleCount],
  )

  const hiddenCount = Math.max(0, filteredEvents.length - targetEvents.length)

  const [displayEvents, setDisplayEvents] = useState<PbEvent[]>(targetEvents)
  const feedRef = useRef<HTMLDivElement>(null)
  const syncTokenRef = useRef(0)
  const prevDisplayIdsRef = useRef<string[]>([])

  useEffect(() => {
    setVisibleCount(pageSize)
  }, [locationSlug, tagSlug, pageSize])

  const handleLocationChange = (slug: string | null) => {
    replaceFilterParams({location: slug})
    setVisibleCount(pageSize)
  }

  const handleTagChange = (slug: string | null) => {
    replaceFilterParams({type: slug})
    setVisibleCount(pageSize)
  }

  useGSAP(
    () => {
      const targetKey = targetEvents.map((event) => event._id).join('|')
      const displayKey = displayEvents.map((event) => event._id).join('|')

      if (targetKey === displayKey) return

      const targetIdSet = new Set(targetEvents.map((event) => event._id))
      const leavingEvents = displayEvents.filter((event) => !targetIdSet.has(event._id))

      const leavingEls = leavingEvents
        .map((event) =>
          feedRef.current?.querySelector<HTMLElement>(`[data-event-id="${event._id}"]`),
        )
        .filter((el): el is HTMLElement => el != null)

      const token = ++syncTokenRef.current

      const commitTarget = () => {
        if (token !== syncTokenRef.current) return
        setDisplayEvents(targetEvents)
      }

      if (leavingEls.length > 0) {
        gsap.killTweensOf(leavingEls)
        gsap.to(leavingEls, {
          autoAlpha: 0,
          y: -12,
          duration: 0.28,
          stagger: 0.04,
          ease: 'power2.in',
          onComplete: commitTarget,
        })
      } else {
        commitTarget()
      }
    },
    {dependencies: [targetEvents, displayEvents], scope: feedRef},
  )

  useGSAP(
    () => {
      const container = feedRef.current
      if (!container) return

      const prevIds = new Set(prevDisplayIdsRef.current)
      const enteringEls = displayEvents
        .filter((event) => !prevIds.has(event._id))
        .map((event) => container.querySelector<HTMLElement>(`[data-event-id="${event._id}"]`))
        .filter((el): el is HTMLElement => el != null)

      if (enteringEls.length > 0) {
        gsap.killTweensOf(enteringEls)
        gsap.fromTo(
          enteringEls,
          {autoAlpha: 0, y: 18},
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.06,
            ease: 'power2.out',
          },
        )
      }

      prevDisplayIdsRef.current = displayEvents.map((event) => event._id)
    },
    {dependencies: [displayEvents], scope: feedRef},
  )

  if (!hasEvents) return null

  return (
    <SiteWidth className="py-gut-50">
      <div>
        <div className="ts-h2">{title}</div>
        <div>
          <SelectComponent
            colorClasses="bg-sage-900 text-bg"
            label="Location"
            value={optionForSlug(locationSlug, allLocations)}
            onValueChange={handleLocationChange}
            options={allLocations}
            includeAllOption
          />
          <SelectComponent
            colorClasses="bg-sage-800 text-bg"
            label="Event Type"
            value={optionForSlug(tagSlug, allTags)}
            onValueChange={handleTagChange}
            options={allTags}
            includeAllOption
          />
        </div>
      </div>
      <div ref={feedRef} className="flex flex-col gap-gut-50">
        {displayEvents.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
      {hiddenCount > 0 && (
        <div className="flex flex-col items-center gap-gut-50 pt-gut-50">
          <p className="ts-h5">
            {hiddenCount} {hiddenCount === 1 ? 'event' : 'events'} not shown
          </p>
          <Button
            text="Show More"
            onClick={() => setVisibleCount((count) => count + pageSize)}
            width="fit"
          />
        </div>
      )}
    </SiteWidth>
  )
}

function EventCard({event}: {event: PbEvent}) {
  const {title, date, _id} = event
  return (
    <div data-event-id={_id} className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-gray-500">{formatDate(date)}</p>
    </div>
  )
}

function eventMatchesFilters(
  event: PbEvent,
  locationSlug: string | null,
  tagSlug: string | null,
): boolean {
  if (locationSlug && !event.locations?.some((location) => location?.slug === locationSlug)) {
    return false
  }
  if (tagSlug && !event.tags?.some((tag) => tag?.slug === tagSlug)) {
    return false
  }
  return true
}

function optionForSlug(slug: string | null, options: SelectOption[]): SelectOption | null {
  if (!slug) return null
  return options.find((option) => option.value === slug) ?? null
}

function filterSlugFromParam(param: string | null, options: SelectOption[]): string | null {
  if (!param) return null
  return options.some((option) => option.value === param) ? param : null
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function getSelectOptions(events: PbEvent[], key: 'locations' | 'tags'): SelectOption[] {
  const seen = new Set<string>()
  const options: SelectOption[] = []

  for (const event of events) {
    for (const item of event[key] ?? []) {
      if (!item?.slug || item.title == null || seen.has(item.slug)) continue
      seen.add(item.slug)
      options.push({value: item.slug, label: item.title})
    }
  }

  return options
}
