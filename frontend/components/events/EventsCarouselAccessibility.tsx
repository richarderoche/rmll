import {EmblaCarouselType} from 'embla-carousel'
import {useEffect} from 'react'

export const useAccessibility = (emblaApi: EmblaCarouselType | undefined): void => {
  const setupAccessibility = (emblaApi: EmblaCarouselType) => {
    const accessibility = emblaApi.plugins().accessibility
    if (!accessibility) return

    accessibility.setupLiveRegion('.embla__live-region')
    accessibility.setupDotButtons('.embla__dots')
  }

  useEffect(() => {
    if (!emblaApi) return

    emblaApi.on('reinit', setupAccessibility)
    setupAccessibility(emblaApi)
  }, [emblaApi])
}
