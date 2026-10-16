import {cn} from '@/lib/utils'
import type {PageHero} from '@/sanity.types'
import type {Get} from '@sanity/codegen'
import Image from './ImageSanity'

type PageHeroImage = Get<PageHero, 'image'>

export default function PageHeroPicture({image}: {image: PageHeroImage}) {
  // Midpoints between studio hotspot previews 1:2 (0.5), 1:1 (1), 2:1 (2)
  const HERO_SOURCES = [
    {media: '(max-aspect-ratio: 3/4)', width: 900, height: 1800},
    {media: '(max-aspect-ratio: 3/2)', width: 1400, height: 1400},
  ] as const
  // Wide (2:1) as fallback
  const HERO_FALLBACK = {width: 1800, height: 900} as const

  const id = image?.asset?._ref
  if (!id) return null

  const cropProps = {
    ...(image.hotspot && {hotspot: image.hotspot}),
    ...(image.crop && {crop: image.crop}),
  }
  const objectPosition =
    image.hotspot != null
      ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`
      : undefined

  return (
    <picture>
      {HERO_SOURCES.map(({media, width, height}) => (
        <Image
          key={media}
          as="source"
          media={media}
          id={id}
          width={width}
          height={height}
          mode="cover"
          sizes="100vw"
          {...cropProps}
        />
      ))}
      <Image
        id={id}
        alt={image.alt || ''}
        width={HERO_FALLBACK.width}
        height={HERO_FALLBACK.height}
        mode="cover"
        sizes="100vw"
        loading="eager"
        fetchPriority="high"
        className={cn('hero-image object-cover w-full h-screen')}
        style={objectPosition ? {objectPosition} : undefined}
        {...cropProps}
      />
    </picture>
  )
}
