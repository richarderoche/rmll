// Manual types (not created by Sanity typegen)
// Only reusable types should be here
// Put one-off types in the component file

import {HomePageQueryResult, PagesBySlugQueryResult} from '@/sanity.types'

export interface NavPage {
  type: string
  slug?: string | null
  title?: string | null
}

export interface NavItem {
  _key: string
  _type: string
  url?: string
  title?: string
  page?: NavPage | null
  anchorLink?: string | null
}

// extract pbGridMulti from the pbGridSection union for the pbBlocks query result below
type PbGridSection = Extract<
  NonNullable<NonNullable<PagesBySlugQueryResult>['pbSections']>[number],
  {_type: 'pbGridMulti'}
>
export type PbBlocksQueryResult = NonNullable<
  NonNullable<PbGridSection['columns']>[number]['pbBlocks']
>

type PageBuilderSection = NonNullable<NonNullable<PagesBySlugQueryResult>['pbSections']>[number]

/** `pbLatestNews` section from page builder GROQ (includes resolved `newsletter`). */
export type PbLatestNewsSection = Extract<PageBuilderSection, {_type: 'pbLatestNews'}>

export type PbEventsFeedSection = Extract<PageBuilderSection, {_type: 'pbEventsFeed'}>

export type PageBuilderData = PagesBySlugQueryResult | HomePageQueryResult | undefined
