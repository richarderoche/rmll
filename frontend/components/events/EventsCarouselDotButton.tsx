import {EmblaCarouselType} from 'embla-carousel'
import {ComponentPropsWithRef, useCallback, useSyncExternalStore} from 'react'

type UseDotButtonType = {
  selectedIndex: number
  scrollSnaps: number[]
  onDotButtonClick: (index: number) => void
}

const EMPTY_SNAPS: number[] = []

export const useDotButton = (emblaApi: EmblaCarouselType | undefined): UseDotButtonType => {
  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!emblaApi) return
      emblaApi.goTo(index)
    },
    [emblaApi],
  )

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!emblaApi) return () => {}
      emblaApi.on('reinit', onStoreChange).on('select', onStoreChange)
      return () => {
        emblaApi.off('reinit', onStoreChange).off('select', onStoreChange)
      }
    },
    [emblaApi],
  )

  const selectedIndex = useSyncExternalStore(
    subscribe,
    () => emblaApi?.selectedSnap() ?? 0,
    () => 0,
  )

  const snapCount = useSyncExternalStore(
    subscribe,
    () => emblaApi?.snapList().length ?? 0,
    () => 0,
  )

  const scrollSnaps =
    snapCount === 0 ? EMPTY_SNAPS : Array.from({length: snapCount}, (_, index) => index)

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick,
  }
}

type PropType = ComponentPropsWithRef<'button'>

export const DotButton = (props: PropType) => {
  const {children, ...restProps} = props

  return (
    <button type="button" {...restProps}>
      {children}
    </button>
  )
}
