'use client'

import IconCaret from '@/components/icons/IconCaret'
import {cn} from '@/lib/utils'
import type {SettingsQueryResult} from '@/sanity.types'
import {resolveHref} from '@/sanity/lib/utils'
import {NavigationMenu} from '@base-ui/react/navigation-menu'
import type {FilterByType, Get} from '@sanity/codegen'
import Link from 'next/link'

type HeaderNavItem = Get<SettingsQueryResult, 'headerNav', number>
type NavLink = FilterByType<HeaderNavItem, 'navPage' | 'navExternal'>

const itemClass =
  'px-12 py-8 corner inline-flex leading-none whitespace-nowrap ts-h5 transition-all duration-300 ease-gleasing'

export default function DesktopNav({headerNav}: {headerNav: HeaderNavItem[]}) {
  const lastIndex = headerNav.length - 1

  return (
    <NavigationMenu.Root className="max-lg:hidden" closeDelay={100}>
      <NavigationMenu.List className="flex gap-gut-25 relative z-1">
        {headerNav.map((item, index) => {
          if (item._type === 'navDropdown') {
            return (
              <NavigationMenu.Item key={item._key}>
                <NavigationMenu.Trigger
                  className={cn(
                    itemClass,
                    'flex items-center gap-3 bg-bg',
                    'hover:bg-bg-subtle data-pressed:bg-bg-subtle',
                  )}
                >
                  <span className="leading-none whitespace-nowrap">{item.title}</span>
                  <NavigationMenu.Icon className="transition-transform duration-300 ease-gleasing data-popup-open:rotate-180 relative -right-2">
                    <IconCaret className="size-[.8em] " />
                  </NavigationMenu.Icon>
                </NavigationMenu.Trigger>
                <NavigationMenu.Content
                  className={cn(
                    'transition-opacity duration-200 ease-gleasing',
                    'data-starting-style:opacity-0 data-ending-style:opacity-0',
                    'data-ending-style:data-activation-direction:transition-none',
                  )}
                >
                  <ul className="flex w-full flex-col bg-bg-subtle corner mt-4 py-12">
                    {item.items?.map((child) => (
                      <li className="relative z-1 group" key={child._key}>
                        <div className="absolute top-0 bottom-0 left-4 right-4 bg-sage-700/30 opacity-0 scale-x-80 scale-y-60 group-hover:opacity-100 group-hover:scale-100 transition-all ease-gleasing duration-200 corner -z-1 pointer-events-none motion-reduce:duration-0"></div>
                        <NavMenuLink item={child} className="ts-p-xs px-12 py-4" />
                      </li>
                    ))}
                  </ul>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            )
          }

          return (
            <NavigationMenu.Item key={item._key}>
              <NavMenuLink
                item={item}
                className={cn(
                  itemClass,
                  'hover:bg-sage-800 hover:text-offwhite',
                  index === lastIndex ? 'bg-olive' : 'bg-bg-subtle',
                )}
              />
            </NavigationMenu.Item>
          )
        })}
      </NavigationMenu.List>

      <NavigationMenu.Portal>
        <NavigationMenu.Positioner
          align="start"
          collisionAvoidance={{align: 'flip'}}
          positionMethod="fixed"
          className="h-(--positioner-height) w-(--positioner-width) min-w-(--anchor-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-200 ease-gleasing data-instant:transition-none"
        >
          <NavigationMenu.Popup
            className={cn(
              'h-(--popup-height) w-(--popup-width) min-w-(--anchor-width) origin-top',
              'transition-transform duration-200 ease-gleasing',
              'data-starting-style:translate-y-gut-25 data-ending-style:translate-y-gut-25',
            )}
          >
            <NavigationMenu.Viewport className="relative h-full w-full overflow-hidden" />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  )
}

function NavMenuLink({item, className}: {item: NavLink; className?: string}) {
  const href = getHref(item)
  if (!href) return null

  const external = item._type === 'navExternal'

  return (
    <NavigationMenu.Link
      className={className}
      href={href}
      closeOnClick
      render={
        <Link
          href={href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
          className="w-full block"
        />
      }
    >
      {getLabel(item)}
    </NavigationMenu.Link>
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
