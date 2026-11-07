import {SettingsQueryResult} from '@/sanity.types'
import SiteWidth from '../shared/SiteWidth'
import DesktopNav from './DesktopNav'
import MobileNav from './MobileNav'
import SkipLink from './SkipLink'
import Wordmark from './Wordmark'

export default async function Navbar({settings}: {settings: SettingsQueryResult}) {
  const headerNav = settings?.headerNav ?? []
  const siteTitle = settings?.title || 'Missing Site Title'
  return (
    <header className="fixed top-0 left-0 w-full z-100 isolate pt-gut pointer-events-none overflow-visible">
      <SkipLink />
      <SiteWidth className="h-full flex justify-between gap-x-gut ts-p-md overflow-visible">
        <Wordmark siteTitle={siteTitle} />

        {headerNav && (
          <div className="pointer-events-auto">
            <DesktopNav headerNav={headerNav} />
            <nav role="navigation" className="lg:hidden">
              <MobileNav headerNav={headerNav} />
            </nav>
          </div>
        )}
      </SiteWidth>
    </header>
  )
}
