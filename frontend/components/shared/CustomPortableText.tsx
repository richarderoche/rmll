import {getFileAsset} from '@sanity/asset-utils'
import {PortableText, type PortableTextBlock, type PortableTextComponents} from 'next-sanity'
import Link from 'next/link'

import BlockImage from '@/components/pb/BlockImage'
import {imgSizesFormat} from '@/lib/utils'
import type {PbBlockImage} from '@/sanity.types'
import {dataset, projectId} from '@/sanity/lib/api'
import {resolveHref} from '@/sanity/lib/utils'

const defaultInlineImageSizes = imgSizesFormat(100, 80, 66)

export function CustomPortableText({
  value,
  trueSizes = defaultInlineImageSizes,
}: {
  value: PortableTextBlock[]
  trueSizes?: string
}) {
  const components: PortableTextComponents = {
    block: {
      'normal': ({children}) => {
        return <p className="ts-p-md">{children}</p>
      },
      'h1': ({children}) => {
        return <h2 className="ts-h1">{children}</h2>
      },
      'h2': ({children}) => {
        return <h3 className="ts-h2">{children}</h3>
      },
      'h2-serif': ({children}) => {
        return <h3 className="ts-h2-serif">{children}</h3>
      },
      'h3': ({children}) => {
        return <h4 className="ts-h3">{children}</h4>
      },
      'h4': ({children}) => {
        return <h5 className="ts-h4">{children}</h5>
      },
      'h5': ({children}) => {
        return <h6 className="ts-h5">{children}</h6>
      },
      'h6': ({children}) => {
        return <h6 className="ts-h6">{children}</h6>
      },
      'p-lg': ({children}) => {
        return <p className="ts-p-lg">{children}</p>
      },
      'p-sm': ({children}) => {
        return <p className="ts-p-sm">{children}</p>
      },
      'p-xs': ({children}) => {
        return <p className="ts-p-xs">{children}</p>
      },
    },
    marks: {
      link: ({children, value}) => {
        return (
          <a
            className="inline-link not-prose"
            href={value?.href}
            rel="noreferrer noopener"
            target="_blank"
          >
            {children}
          </a>
        )
      },
      internalLink: ({children, value}) => {
        const {slug = {}, type = 'page'} = value
        const href = resolveHref(type, slug.current)

        return (
          <Link className="inline-link not-prose" href={href || '/'}>
            {children}
          </Link>
        )
      },
      fileLink: ({children, value}) => {
        const url = getFileAsset(value.file.asset, {
          projectId: projectId,
          dataset: dataset,
        }).url
        return (
          <a
            className="inline-link not-prose"
            href={`${url}?dl=`}
            rel="noreferrer noopener"
            target="_blank"
          >
            {children}
          </a>
        )
      },
    },
    listItem: ({children}) => {
      return <li>{children}</li>
    },
    types: {
      pbBlockImage: ({value}) => <BlockImage block={value as PbBlockImage} trueSizes={trueSizes} />,
      ptDivider: () => (
        <div className="h-2 w-full my-[1.5em] border-b-2 border-divider border-dotted" />
      ),
    },
  }

  return <PortableText components={components} value={value} />
}
