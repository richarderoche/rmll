import {cn} from '@/lib/utils'

export function screenVisibilityClassName(
  showOnMobile = true,
  showOnTablet = true,
  showOnDesktop = true,
) {
  return cn(
    'hidden',
    showOnMobile ? 'max-md:block' : '',
    showOnTablet ? 'md:max-lg:block' : '',
    showOnDesktop ? 'lg:block' : '',
  )
}
