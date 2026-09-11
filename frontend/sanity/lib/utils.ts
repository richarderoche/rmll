import {dataset, projectId} from '@/sanity/lib/api'
import {createImageUrlBuilder} from '@sanity/image-url'
import type {Image} from 'sanity'

//
// Image Helpers

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || '',
  dataset: dataset || '',
})

export function urlForOpenGraphImage(image: Image | null | undefined) {
  if (!image?.asset?._ref) {
    return undefined
  }
  return imageBuilder?.image(image)?.width(1200).height(627).fit('crop').auto('format').url()
}

//
// Route Resolver

export function resolveHref(
  documentType?: string,
  slug?: string | null,
  anchor?: string | null,
): string | undefined {
  const hash = anchor ? anchor : ''
  switch (documentType) {
    case 'home':
      return `/${hash}`
    case 'page':
      return slug ? `/${slug}${hash}` : undefined
    case 'project':
      return slug ? `/projects/${slug}${hash}` : undefined
    default:
      console.warn('Invalid document type:', documentType)
      return undefined
  }
}
