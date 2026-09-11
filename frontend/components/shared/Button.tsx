import Link from 'next/link'

import {cn} from '@/lib/utils'
import {resolveHref} from '@/sanity/lib/utils'
import {NavItem} from '@/types'

interface ButtonProps {
  text?: string
  path?: string
  navItem?: NavItem
  style?: 'fill' | 'outline'
  className?: string
  download?: boolean
  onClick?: () => void
  disabled?: boolean
}

export default function Button(props: ButtonProps) {
  const {text, path, navItem, style = 'fill', className, download, onClick, disabled} = props
  let href: string | undefined = ''
  let buttonText: string | undefined = ''

  if (navItem) {
    const {page, title, url, anchorLink} = navItem
    href = page ? resolveHref(page.type, page.slug, anchorLink) : url
    buttonText = title || page?.title || ''
  } else {
    href = path || ''
    buttonText = text || ''
  }

  const isExternal = href?.startsWith('http')

  const buttonClasses = cn(
    'border flex w-fit items-center transition-all hover:scale-105',
    style === 'fill' && 'bg-body border-body text-bg',
    style === 'outline' && 'bg-bg',
    className,
  )

  if (href) {
    return (
      <Link
        href={href || ''}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className={buttonClasses}
        download={download}
      >
        <ButtonInner text={buttonText} />
      </Link>
    )
  }

  return (
    <button type="button" className={buttonClasses} onClick={onClick} disabled={disabled}>
      <ButtonInner text={buttonText} />
    </button>
  )
}

export function ButtonInner({text}: {text: string}) {
  return (
    <span className="leading-none whitespace-nowrap ts-h5 py-[.4em] px-[.8em] center-caps">
      {text}
    </span>
  )
}
