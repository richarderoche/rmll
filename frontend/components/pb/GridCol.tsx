import { cn, getAlignClasses, getGridClasses, getTrueSizes } from '@/lib/utils'
import { PbColSettings, PbGridMulti } from '@/sanity.types'

import { PbBlocksQueryResult } from '@/types'
import { AccordionSection } from '../shared/AccordionSection'
import Card from '../shared/Card'
import Revealer from '../shared/Revealer'
import PbBlocks from './PbBlocks'
import { useSanityDataAttribute } from './SanityVisualEditingContext'

export interface GridColProps {
  col: NonNullable<PbGridMulti['columns']>[number]
  outerSettings: PbColSettings
  cardMode?: boolean
  sticky?: boolean
  blockWidths?: {
    mobile?: string
    tablet?: string
    desktop?: string
  }
}

export default function GridCol({
  col,
  outerSettings,
  cardMode = false,
  blockWidths,
}: GridColProps) {
  const {
    _key,
    columnSettings,
    pbBlocks,
    yAlignment,
    revealEffect,
    spaceBetweenBlocks,
  } = col
  const { getDataAttribute } = useSanityDataAttribute()

  if (!pbBlocks || pbBlocks.length === 0) {
    return null
  }

  const { accordionMode = false, accordionTitle = 'More' } =
    columnSettings || {}
  const colClasses = cn(
    columnSettings ? getGridClasses(columnSettings) : '',
    yAlignment ? getAlignClasses(yAlignment, 'y') : '',
    'corner-container'
  )
  const trueSizes = columnSettings?.size
    ? getTrueSizes(outerSettings.size!, columnSettings.size)
    : getTrueSizes(outerSettings.size!)
  const innerId = `col-${_key}`
  const hasAnimation = revealEffect && revealEffect !== 'none'

  const colBlocks = (
    <PbBlocks
      columnBlocks={pbBlocks as PbBlocksQueryResult}
      trueSizes={trueSizes}
      spaceBetweenBlocks={spaceBetweenBlocks || 'gap-gut'}
      blockWidths={blockWidths}
    />
  )

  const colInner = cardMode ? <Card>{colBlocks}</Card> : colBlocks
  const content =
    accordionMode && pbBlocks.length > 0 ? (
      <AccordionSection accordionTitle={accordionTitle} innerId={innerId}>
        {colInner}
      </AccordionSection>
    ) : (
      colInner
    )

  if (!hasAnimation) {
    return (
      <div className={colClasses} data-sanity={getDataAttribute()}>
        {content}
      </div>
    )
  }

  return (
    <Revealer
      className={colClasses}
      data-sanity={getDataAttribute()}
      direction={revealEffect}
    >
      {content}
    </Revealer>
  )
}
