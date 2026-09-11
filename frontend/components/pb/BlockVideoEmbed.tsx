'use client'

import type { PbBlockVideoEmbed } from '@/sanity.types'
import VideoEmbed from '../shared/VideoEmbed'

export default function BlockVideoEmbed({ block }: { block: PbBlockVideoEmbed }) {
  return (
    <div className="relative" style={getRatioPadding(block)}>
      <VideoEmbed url={block.videoEmbedUrl} />
    </div>
  )
}

function getRatioPadding(block: PbBlockVideoEmbed) {
  const ar = block.videoAspectRatio
  const paddingRatio =
    ar && ar.width && ar.height ? ar.height / ar.width : 9 / 16
  return { paddingTop: paddingRatio * 100 + '%' }
}
