'use client'

import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import {usePathname, useRouter, useSearchParams} from 'next/navigation'
import {Suspense, useCallback, useEffect, useMemo, useRef, useState} from 'react'

import EventCard, {type EventCardEvent} from '@/components/events/EventCard'
import type {PbEventsFeedSection} from '@/types'

import type {SelectOption} from '../shared/Select'
import SelectComponent from '../shared/Select'
import SiteGrid from '../shared/SiteGrid'
import SiteWidth from '../shared/SiteWidth'

gsap.registerPlugin(useGSAP)

type PbEvent = EventCardEvent

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
      <SiteGrid className="items-center gap-y-gut-66 md:px-gut-33">
        <div className="col-span-12 md:col-span-5 lg:col-span-6">
          <span className="ts-h1 md:hidden">{title}</span>
          <span className="ts-h2 max-md:hidden">{title}</span>
        </div>
        <div className="col-span-12 md:col-span-7 lg:col-span-6 grid grid-cols-2 gap-gut">
          <div>
            <SelectComponent
              colorClasses="bg-sage-900 text-bg"
              label="Location"
              value={optionForSlug(locationSlug, allLocations)}
              onValueChange={handleLocationChange}
              options={allLocations}
              includeAllOption
            />
          </div>
          <div>
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
      </SiteGrid>
      <div ref={feedRef} className="flex flex-col mt-gut md:mt-gut-75 max-md:gap-gut-50">
        {displayEvents.map((event) => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>
      {hiddenCount > 0 && (
        <div className="flex items-baseline gap-gut mt-gut justify-between md:grid md:grid-cols-12 md:px-gut-33">
          <div className="md:col-span-2 lg:col-span-3">
            <p className="ts-h6">
              + {hiddenCount} More {hiddenCount === 1 ? 'event' : 'events'}
            </p>
          </div>
          <div className="md:col-span-9">
            <button
              type="button"
              className="ts-h4 nice-underline text-sage-700 hover:nice-underline-dotted hover:text-sage-900"
              onClick={() => setVisibleCount((count) => count + pageSize)}
            >
              Show More
            </button>
          </div>
        </div>
      )}
    </SiteWidth>
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

function getSelectOptions(events: PbEvent[], key: 'locations' | 'tags'): SelectOption[] {
  const counts = new Map<string, number>()
  const labels = new Map<string, string>()

  for (const event of events) {
    const slugsOnEvent = new Set<string>()

    for (const item of event[key] ?? []) {
      if (!item?.slug || item.title == null) continue
      labels.set(item.slug, item.title)
      slugsOnEvent.add(item.slug)
    }

    for (const slug of slugsOnEvent) {
      counts.set(slug, (counts.get(slug) ?? 0) + 1)
    }
  }

  return [...counts.keys()]
    .map((value) => ({value, label: labels.get(value)!}))
    .sort((a, b) => {
      const byCount = (counts.get(b.value) ?? 0) - (counts.get(a.value) ?? 0)
      if (byCount !== 0) return byCount
      return a.label.localeCompare(b.label)
    })
}
