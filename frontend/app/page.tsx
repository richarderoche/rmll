import PageBuilder from '@/components/pb/PageBuilder'
import PageWrapper from '@/components/shared/PageWrapper'
import StyleGuide from '@/components/shared/StyleGuide'
import {getFirstSectionInfo} from '@/lib/utils'
import {HomePageQueryResult} from '@/sanity.types'
import {sanityFetch} from '@/sanity/lib/live'
import {homePageQuery} from '@/sanity/lib/queries'
import {notFound} from 'next/navigation'

/** ISR for page builder — 20 minutes (`PAGE_BUILDER_REVALIDATE_SECONDS`). Must be a literal for Next.js. */
export const revalidate = 1200

export default async function IndexRoute() {
  const {data} = (await sanityFetch({query: homePageQuery, stega: false})) as {
    data: HomePageQueryResult
  }

  if (!data) {
    notFound()
  }

  const {firstIsHero, firstPbSectionKey} = getFirstSectionInfo(data)
  const showStyleGuide = true

  return (
    <PageWrapper className={firstIsHero ? '' : 'pt-header'}>
      {showStyleGuide && <StyleGuide />}
      <PageBuilder data={data} firstPbSectionKey={firstPbSectionKey ?? ''} />
    </PageWrapper>
  )
}
