import {HomePageQueryResult, PagesBySlugQueryResult, PbSections} from '@/sanity.types'
import {studioUrl} from '@/sanity/lib/api'
import PageBuilderSections from './PageBuilderSections'
import {SanityVisualEditingProvider} from './SanityVisualEditingContext'

export type PbPageData = PagesBySlugQueryResult | HomePageQueryResult | undefined

export default function PageBuilder({
  data,
  firstPbSectionKey,
}: {
  data: PbPageData
  firstPbSectionKey: string
}) {
  const {pbSections} = data ?? {}
  const documentId = data?._id ?? null
  const documentType = data?._type ?? null
  if (!pbSections || pbSections.length === 0) return null
  return (
    <SanityVisualEditingProvider
      documentId={documentId}
      documentType={documentType}
      baseUrl={studioUrl}
    >
      <PageBuilderSections
        pbSections={pbSections as PbSections}
        firstPbSectionKey={firstPbSectionKey}
      />
    </SanityVisualEditingProvider>
  )
}
