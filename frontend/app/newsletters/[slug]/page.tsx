import PbBlocks from '@/components/pb/PbBlocks'
import {SanityVisualEditingProvider} from '@/components/pb/SanityVisualEditingContext'
import PageWrapper from '@/components/shared/PageWrapper'
import SiteGrid from '@/components/shared/SiteGrid'
import SiteWidth from '@/components/shared/SiteWidth'
import {getTrueSizes} from '@/lib/utils'
import {NewsletterBySlugQueryResult} from '@/sanity.types'
import {studioUrl} from '@/sanity/lib/api'
import {sanityFetch} from '@/sanity/lib/live'
import {newsletterBySlugQuery, slugsByTypeQuery} from '@/sanity/lib/queries'
import {urlForOpenGraphImage} from '@/sanity/lib/utils'
import {PbBlocksQueryResult} from '@/types'
import type {Metadata, ResolvingMetadata} from 'next'
import {createDataAttribute} from 'next-sanity'
import {draftMode} from 'next/headers'
import {notFound} from 'next/navigation'
import type {Image, Image as SanityImageType} from 'sanity'
import NewsletterSidebar from './NewletterSidebar'
import NewsletterHero from './NewsletterHero'

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: slugsByTypeQuery,
    params: {type: 'newsletter'},
    stega: false,
    perspective: 'published',
  })
  return data
}

export async function generateMetadata(
  props: PageProps<'/newsletters/[slug]'>,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params
  const {data: newsletter} = (await sanityFetch({
    query: newsletterBySlugQuery,
    params,
    stega: false,
  })) as {data: NewsletterBySlugQueryResult}

  const ogImage = urlForOpenGraphImage((newsletter?.ogImage ?? newsletter?.coverImage) as Image)
  const noIndex = newsletter?.noIndex ?? false

  return {
    title: newsletter?.seoTitle ?? newsletter?.title,
    description: (newsletter?.description || newsletter?.teaserText) ?? (await parent).description,
    openGraph: {
      images: ogImage ? [ogImage] : [...((await parent).openGraph?.images ?? [])],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      nocache: noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        noimageindex: noIndex,
      },
    },
  }
}

export default async function NewsletterSlugRoute(props: PageProps<'/newsletters/[slug]'>) {
  const params = await props.params
  const {data} = (await sanityFetch({query: newsletterBySlugQuery, params, stega: false})) as {
    data: NewsletterBySlugQueryResult
  }

  if (!data?._id && !(await draftMode()).isEnabled) {
    notFound()
  }

  const dataAttribute =
    data?._id && data._type
      ? createDataAttribute({
          baseUrl: studioUrl,
          id: data._id,
          type: data._type,
        })
      : null

  // Default to an empty object to allow previews on non-existent documents
  const {slug, coverImage, title, edition, bodyContent, editions, subscribeUrl} = data ?? {}
  const trueSizes = getTrueSizes(
    {mobile: 12, tablet: 12, desktop: 12},
    {mobile: 12, tablet: 12, desktop: 6},
  )

  return (
    <PageWrapper className="pt-section">
      <SiteWidth className="">
        <SiteGrid className="relative">
          <NewsletterHero
            edition={edition ?? ''}
            coverImage={coverImage as SanityImageType}
            dataAttribute={dataAttribute?.('coverImage')}
          />
          <div className="pt-gut-200 md:pt-section col-span-12 md:col-span-8 lg:col-span-6 lg:col-start-3 max-md:order-last">
            {title && <h1 className="ts-h2-serif text-balance mb-em">{title}</h1>}
            {bodyContent && (
              <SanityVisualEditingProvider
                documentId={data?._id ?? null}
                documentType={data?._type ?? null}
                baseUrl={studioUrl}
              >
                <PbBlocks
                  columnBlocks={bodyContent as PbBlocksQueryResult}
                  blocksFieldName="bodyContent"
                  trueSizes={trueSizes}
                  spaceBetweenBlocks={'gap-gut'}
                />
              </SanityVisualEditingProvider>
            )}
          </div>
          <div className="pt-section col-span-12 md:col-span-4 lg:col-span-3 lg:col-start-10">
            <div className="md:sticky md:top-[calc(var(--spacing-header)+var(--spacing-gut))] flex flex-col gap-gut-50">
              <NewsletterSidebar
                editions={editions ?? []}
                slug={slug ?? ''}
                edition={edition ?? ''}
                subscribeUrl={subscribeUrl ?? ''}
              />
            </div>
          </div>
        </SiteGrid>
      </SiteWidth>
    </PageWrapper>
  )
}
