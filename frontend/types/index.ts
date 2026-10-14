// Manual types (not created by Sanity typegen)
// Only reusable types should be here
// Put one-off types in the component file

import {PagesBySlugQueryResult} from '@/sanity.types'
import type {FilterByType, Get} from '@sanity/codegen'

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

export type PbSection = Get<PagesBySlugQueryResult, 'pbSections', number>

export type PbGridMultiSection = FilterByType<PbSection, 'pbGridMulti'>
export type PbGridSingleSection = FilterByType<PbSection, 'pbGridSingle'>
export type PbTitleSectionSection = FilterByType<PbSection, 'pbTitleSection'>
export type PbLatestNewsSection = FilterByType<PbSection, 'pbLatestNews'>
export type PbEventsFeedSection = FilterByType<PbSection, 'pbEventsFeed'>
export type PbEventsCarouselSection = FilterByType<PbSection, 'pbEventsCarousel'>
export type PbCarouselSection = FilterByType<PbSection, 'pbCarousel'>

export type PbColBlocks = Get<PbGridMultiSection, 'columns', number, 'pbBlocks'>
export type PbColBlock = Get<PbGridMultiSection, 'columns', number, 'pbBlocks', number>
