'use client'

import IconCaret from '@/components/icons/IconCaret'
import {usePrefersReducedMotion} from '@/lib/hooks'
import {useStore} from '@/lib/store'
import {cn} from '@/lib/utils'
import type {SettingsQueryResult} from '@/sanity.types'
import {resolveHref} from '@/sanity/lib/utils'
import {Accordion} from '@base-ui/react/accordion'
import {useGSAP} from '@gsap/react'
import type {FilterByType, Get} from '@sanity/codegen'
import {FocusTrap} from 'focus-trap-react'
import gsap from 'gsap'
import Link from 'next/link'
import {useEffect, useRef} from 'react'
import IconClose from '../icons/IconClose'
import IconNav from '../icons/IconNav'

type HeaderNavItem = Get<SettingsQueryResult, 'headerNav', number>
type NavLink = FilterByType<HeaderNavItem, 'navPage' | 'navExternal'>

interface NavbarProps {
  headerNav: HeaderNavItem[]
}

export default function MobileNav(props: NavbarProps) {
  const {headerNav} = props

  const isMobileNavOpen = useStore((state) => state.isMobileNavOpen)
  const setIsMobileNavOpen = useStore((state) => state.setIsMobileNavOpen)
  const setPauseLenis = useStore((state) => state.setPauseLenis)

  const handleOpenMobileNav = () => {
    setIsMobileNavOpen(true)
    setPauseLenis(true)
  }

  const handleCloseMobileNav = () => {
    setIsMobileNavOpen(false)
    setPauseLenis(false)
  }

  const handleToggleMobileNav = () => {
    if (isMobileNavOpen) {
      handleCloseMobileNav()
    } else {
      handleOpenMobileNav()
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileNavOpen(false)
        setPauseLenis(false)
      }
    }
    if (isMobileNavOpen) {
      document.addEventListener('keydown', handleKeyDown)
    } else {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMobileNavOpen, setIsMobileNavOpen, setPauseLenis])

  const navRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion() ?? false

  useGSAP(
    () => {
      const el = navRef.current
      if (!el) return

      if (reducedMotion) {
        gsap.to(el, {
          autoAlpha: isMobileNavOpen ? 1 : 0,
          x: 0,
          duration: isMobileNavOpen ? 0.25 : 0.175,
          ease: 'circ.out',
        })
        return
      }

      gsap.to(el, {
        x: isMobileNavOpen ? 0 : '-100%',
        autoAlpha: 1,
        duration: isMobileNavOpen ? 0.3 : 0.15,
        ease: 'circ.out',
      })
    },
    {dependencies: [isMobileNavOpen, reducedMotion]},
  )

  return (
    <FocusTrap active={isMobileNavOpen}>
      <div>
        <button
          onClick={handleToggleMobileNav}
          aria-expanded={isMobileNavOpen}
          aria-controls="mobile-nav"
          aria-label="Toggle Menu"
          className={cn(
            'corner relative z-10 transition-colors duration-200 ease-gleasing size-32 p-3',
            isMobileNavOpen ? 'bg-bg' : 'bg-bg-subtle',
          )}
        >
          {isMobileNavOpen ? (
            <IconClose className="w-full h-auto" />
          ) : (
            <IconNav className="w-full h-auto" />
          )}
        </button>

        <nav
          id="mobile-nav"
          ref={navRef}
          className={cn(
            'fixed top-0 bottom-0 left-0 z-0 w-full bg-bg-subtle pt-gut-400 px-gut overflow-auto',
            reducedMotion ? 'opacity-0' : '-translate-x-full',
          )}
          data-lenis-prevent
          role="navigation"
          aria-label="Mobile Navigation"
          inert={!isMobileNavOpen}
        >
          <Accordion.Root className="flex flex-col border-t-2 border-divider border-dotted">
            {headerNav.map((item) => {
              if (item._type === 'navDropdown') {
                return (
                  <Accordion.Item
                    key={item._key}
                    className="border-b-2 border-divider border-dotted"
                  >
                    <Accordion.Header>
                      <Accordion.Trigger className="group flex w-full items-center justify-between gap-gut-50 py-gut-66 text-left">
                        <span className="ts-mobile-nav text-sage-800">{item.title}</span>
                        <IconCaret className="size-24 shrink-0 transition-transform duration-200 ease-gleasing group-data-panel-open:rotate-180 text-sage-800" />
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Panel className="h-(--accordion-panel-height) overflow-hidden transition-[height] duration-200 ease-gleasing data-starting-style:h-0 data-ending-style:h-0">
                      <ul className="flex flex-col pb-gut">
                        {item.items?.map((child) => (
                          <li key={child._key}>
                            <MobileNavLink
                              className="ts-mobile-subnav py-[.5em] px-gut flex w-fit"
                              item={child}
                              onClick={handleCloseMobileNav}
                            />
                          </li>
                        ))}
                      </ul>
                    </Accordion.Panel>
                  </Accordion.Item>
                )
              }

              return (
                <div key={item._key} className="border-b-2 border-divider border-dotted py-gut-66">
                  <MobileNavLink
                    className="ts-mobile-nav text-sage-800"
                    item={item}
                    onClick={handleCloseMobileNav}
                  />
                </div>
              )
            })}
          </Accordion.Root>
        </nav>
      </div>
    </FocusTrap>
  )
}

function MobileNavLink({
  className,
  item,
  onClick,
}: {
  className?: string
  item: NavLink
  onClick?: () => void
}) {
  const href = getHref(item)
  if (!href) return null

  const external = item._type === 'navExternal'

  return (
    <Link
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      className={className}
    >
      {getLabel(item)}
    </Link>
  )
}

function getHref(item: NavLink) {
  if (item._type === 'navExternal') return item.url
  return item.page ? resolveHref(item.page.type, item.page.slug, item.anchorLink) : undefined
}

function getLabel(item: NavLink) {
  if (item._type === 'navPage') return item.title || item.page?.title
  return item.title
}
