'use client'

import {screenVisibilityClassName} from '@/lib/screenVisibility'
import {cn} from '@/lib/utils'
import type {PbBlockDivider, PbBlockImage} from '@/sanity.types'
import {PbColBlock, PbColBlocks} from '@/types'
import dynamic from 'next/dynamic'
import {Fragment, Suspense, type ComponentType} from 'react'
// import static components for common or lightweight components
import BlockButtons from './BlockButtons'
import BlockCopyToClipboard from './BlockCopyToClipboard'
import BlockDivider from './BlockDivider'
import BlockImage from './BlockImage'
import BlockPress from './BlockPress'
import BlockQuote from './BlockQuote'
import BlockText from './BlockText'
import {useSanityDataAttribute} from './SanityVisualEditingContext'
// import dynamic for rare or heavy components
const BlockRichText = dynamic(() => import('./BlockRichText'))
const BlockVideoEmbed = dynamic(() => import('./BlockVideoEmbed'))
const BlockMarquee = dynamic(() => import('./BlockMarquee'))

type BlockRegistryEntry = {
  Component: ComponentType<{
    block: PbColBlock
    trueSizes?: string
  }>
  dynamic?: boolean
  wrap?: false
  wrapClassName?: string
}

const asType = (component: ComponentType<Record<string, unknown>>) =>
  component as BlockRegistryEntry['Component']

const blockRegistry: Record<string, BlockRegistryEntry> = {
  pbBlockRichText: {
    Component: asType(BlockRichText),
    dynamic: true,
    wrap: false,
  },
  pbBlockText: {Component: asType(BlockText)},
  pbBlockImage: {
    Component: asType(BlockImage),
  },
  pbBlockVideoEmbed: {
    Component: asType(BlockVideoEmbed),
    dynamic: true,
  },
  pbBlockButtons: {Component: asType(BlockButtons)},
  pbBlockCopyToClipboard: {Component: asType(BlockCopyToClipboard)},
  pbBlockDivider: {Component: asType(BlockDivider)},
  pbBlockMarquee: {Component: asType(BlockMarquee), dynamic: true},
  pbBlockPress: {Component: asType(BlockPress)},
  pbBlockQuote: {Component: asType(BlockQuote)},
}

type BlockRenderProps = {
  blockKey: string
  dataSanity: string | undefined
  block: PbColBlock
  trueSizes: string
}

function blockWrapClassName(block: PbColBlock, wrapClassName?: string) {
  let visibility: string | undefined

  if (block._type === 'pbBlockDivider') {
    const {stretchToFill, showOnMobile, showOnTablet, showOnDesktop} = block as PbBlockDivider
    visibility = screenVisibilityClassName(
      showOnMobile ?? true,
      showOnTablet ?? true,
      showOnDesktop ?? true,
    )
    if (stretchToFill) {
      return cn(visibility, 'grow shrink-0', wrapClassName)
    }
  } else if (block._type === 'pbBlockImage') {
    const {screenVisibility} = block as PbBlockImage
    const {showOnMobile, showOnTablet, showOnDesktop} = screenVisibility || {}
    visibility = screenVisibilityClassName(
      showOnMobile ?? true,
      showOnTablet ?? true,
      showOnDesktop ?? true,
    )
  }

  return cn(visibility, wrapClassName)
}

function renderBlock(entry: BlockRegistryEntry, props: BlockRenderProps) {
  const {Component, dynamic: isDynamic, wrap, wrapClassName} = entry
  const {blockKey, dataSanity, block, trueSizes} = props

  const component = (
    <Component
      {...(wrap === false ? {'data-sanity': dataSanity} : {})}
      block={block}
      trueSizes={trueSizes}
    />
  )

  const wrapped =
    wrap === false ? (
      component
    ) : (
      <div data-sanity={dataSanity} className={blockWrapClassName(block, wrapClassName)}>
        {component}
      </div>
    )

  return (
    <Fragment key={blockKey}>
      {isDynamic ? <Suspense fallback={null}>{wrapped}</Suspense> : wrapped}
    </Fragment>
  )
}

export interface PbBlocksProps {
  columnBlocks: PbColBlocks
  trueSizes: string
  spaceBetweenBlocks: string
  /** Sanity field name for this block array (default: column `pbBlocks`). */
  blocksFieldName?: string
}

export default function PbBlocks({
  columnBlocks,
  trueSizes,
  spaceBetweenBlocks,
  blocksFieldName = 'pbBlocks',
}: PbBlocksProps) {
  const {getDataAttribute} = useSanityDataAttribute()
  return (
    <div className={cn('column-blocks flex flex-col h-full', spaceBetweenBlocks)}>
      {columnBlocks?.map((block) => {
        const {_key, _type} = block
        const entry = blockRegistry[_type as keyof typeof blockRegistry]
        if (!entry) return null

        return renderBlock(entry, {
          blockKey: _key,
          dataSanity: getDataAttribute([blocksFieldName, {_key}]),
          block,
          trueSizes,
        })
      })}
    </div>
  )
}
