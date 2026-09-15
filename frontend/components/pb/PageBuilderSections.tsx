'use client'

import {PbGridDouble, PbGridMulti, PbGridSingle, PbSections, PbTitleSection} from '@/sanity.types'
import {Suspense, type ReactNode} from 'react'
import {
  SanityPathSegment,
  SanityVisualEditingPath,
  useSanityDataAttribute,
} from './SanityVisualEditingContext'
import SectionGridDouble from './SectionGridDouble'
import SectionGridMulti from './SectionGridMulti'
import SectionGridSingle from './SectionGridSingle'
import SectionTitleHero from './SectionTitleHero'
// import dynamic from 'next/dynamic' — uncomment when adding dynamic sections

type Section = NonNullable<PbSections>[number]

type SectionRegistryEntry = {
  render: (section: Section, context: {sectionKey: string; isFirst: boolean}) => ReactNode
  dynamic?: boolean
}

// Future heavy section example (schema + component not built yet):
// const SectionCarousel = dynamic(() => import('./SectionCarousel'))

const sectionRegistry = {
  pbGridMulti: {
    render: (section) => <SectionGridMulti section={section as PbGridMulti} />,
  },
  pbGridSingle: {
    render: (section, {sectionKey}) => (
      <SectionGridSingle section={section as PbGridSingle} sectionKey={sectionKey} />
    ),
  },
  pbGridDouble: {
    render: (section, {sectionKey}) => (
      <SectionGridDouble section={section as PbGridDouble} sectionKey={sectionKey} />
    ),
  },
  pbTitleSection: {
    render: (section, {isFirst}) => (
      <SectionTitleHero section={section as PbTitleSection} isFirst={isFirst} />
    ),
  },
  // pbCarousel: {
  //   render: (section) => <SectionCarousel section={section} />,
  //   dynamic: true,
  // },
} satisfies Record<string, SectionRegistryEntry>

function renderSection(
  entry: SectionRegistryEntry,
  section: Section,
  context: {sectionKey: string; isFirst: boolean},
) {
  const content = entry.render(section, context)
  return entry.dynamic ? <Suspense fallback={null}>{content}</Suspense> : content
}

export default function PageBuilderSections({
  pbSections,
  firstPbSectionKey,
}: {
  pbSections: PbSections
  firstPbSectionKey: string
}) {
  const {getDataAttribute} = useSanityDataAttribute()
  if (!pbSections?.length) return null

  return (
    <div className="flex flex-col">
      {pbSections.map((section) => {
        const {_key, sectionSettings} = section
        const {enableSection = true, sectionId, marginTop, marginBottom} = sectionSettings || {}

        if (!enableSection) return null

        const entry = sectionRegistry[section._type as keyof typeof sectionRegistry]
        if (!entry) return null

        const sectionPath: SanityPathSegment[] = ['pbSections', {_key}]

        return (
          <section
            id={sectionId ? sectionId.replace(/^#/, '') : 'section-' + _key}
            key={_key}
            className="pt-gut first:pt-0"
            data-sanity={getDataAttribute(sectionPath)}
          >
            <div
              style={{
                paddingTop: marginTop ? `calc(var(--spacing-gut-50) * ${marginTop})` : undefined,
                paddingBottom: marginBottom
                  ? `calc(var(--spacing-gut-50) * ${marginBottom})`
                  : undefined,
              }}
            >
              <SanityVisualEditingPath path={[...sectionPath]}>
                {renderSection(entry, section, {
                  sectionKey: _key,
                  isFirst: _key === firstPbSectionKey,
                })}
              </SanityVisualEditingPath>
            </div>
          </section>
        )
      })}
    </div>
  )
}
