'use client'

import type { PbBlockRichText } from '@/sanity.types'
import { PortableTextBlock } from 'next-sanity'
import { CustomPortableText } from '../shared/CustomPortableText'
import RichTextWrap from '../shared/RichTextWrap'

export default function BlockRichText({
  block,
  'data-sanity': dataSanity,
}: {
  block: PbBlockRichText
  'data-sanity'?: string
}) {
  return (
    <RichTextWrap data-sanity={dataSanity}>
      <CustomPortableText
        value={block.textContent as PortableTextBlock[]}
      />
    </RichTextWrap>
  )
}
