'use client'

import type { PbBlockRichText } from '@/sanity.types'
import { CustomPortableText } from '../shared/CustomPortableText'
import RichTextWrap from '../shared/RichTextWrap'

export default function BlockRichText({
  block,
  trueSizes,
  'data-sanity': dataSanity,
}: {
  block: PbBlockRichText
  trueSizes?: string
  'data-sanity'?: string
}) {
  if (!block.textContent) return null

  return (
    <RichTextWrap data-sanity={dataSanity}>
      <CustomPortableText value={block.textContent} trueSizes={trueSizes} />
    </RichTextWrap>
  )
}
