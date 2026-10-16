import PageBuilder from '@/components/pb/PageBuilder'
import PageHero from '@/components/shared/PageHero'
import PageWrapper from '@/components/shared/PageWrapper'
import {getFirstSectionInfo} from '@/lib/utils'
import {HomePageQueryResult, PageHero as PageHeroType} from '@/sanity.types'
import {sanityFetch} from '@/sanity/lib/live'
import {homePageQuery} from '@/sanity/lib/queries'
import {notFound} from 'next/navigation'

export default async function IndexRoute() {
  const {data} = (await sanityFetch({query: homePageQuery, stega: false})) as {
    data: HomePageQueryResult
  }

  if (!data) {
    notFound()
  }

  const {firstPbSectionKey} = getFirstSectionInfo(data)

  return (
    <PageWrapper>
      <PageHero enableHero={data?.enableHero ?? false} hero={data?.hero as PageHeroType} />
      <PageBuilder data={data} firstPbSectionKey={firstPbSectionKey ?? ''} />
    </PageWrapper>
  )
}
