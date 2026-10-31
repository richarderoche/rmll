import {SettingsQueryResult} from '@/sanity.types'
import Link from 'next/link'
import SiteWidth from '../shared/SiteWidth'
import DesktopNav from './DesktopNav'
import MobileNav from './MobileNav'
import SkipLink from './SkipLink'

export default async function Navbar({settings}: {settings: SettingsQueryResult}) {
  const headerNav = settings?.headerNav ?? []
  const siteTitle = settings?.title || 'Missing Site Title'

  return (
    <header className="h-header fixed top-0 left-0 w-full z-100 isolate">
      <SkipLink />
      <SiteWidth className="h-full flex items-center justify-between gap-x-gut ts-p-md">
        <Link className="ts-h5" href="/">
          {siteTitle}
        </Link>

        {headerNav && (
          <>
            <DesktopNav headerNav={headerNav} />
            <nav role="navigation" className="h-full py-gut-33 lg:hidden">
              <MobileNav headerNav={headerNav} />
            </nav>
          </>
        )}
      </SiteWidth>
    </header>
  )
}
