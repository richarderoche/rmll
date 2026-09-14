import '@/app/globals.css'
import {DraftModeBootstrap} from '@/components/DraftModeBootstrap'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import GlobalScripts from '@/components/shared/GlobalScripts'
import {GSAP} from '@/components/shared/GSAP'
import {Lenis} from '@/components/shared/Lenis'
import {SettingsQueryResult} from '@/sanity.types'
import {sanityFetch, SanityLive} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'
import {urlForOpenGraphImage} from '@/sanity/lib/utils'
import {Metadata, Viewport} from 'next'
import {draftMode} from 'next/headers'
import type {Image} from 'sanity'
import {Toaster} from 'sonner'
import {handleError} from './client-utils'
import {allFontVars} from './fonts'

export async function generateMetadata(): Promise<Metadata> {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
    stega: false,
  })

  const ogImage = urlForOpenGraphImage(settings?.ogImage as Image)
  const noIndex = settings?.noIndex ?? false
  return {
    title: settings?.title
      ? {
          template: `%s | ${settings.title}`,
          default: settings.title || 'Personal website',
        }
      : undefined,
    description: settings?.description ? settings.description : undefined,
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
    formatDetection: {
      telephone: false,
      address: false,
      email: false,
    },
    twitter: {
      card: 'summary_large_image',
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      nocache: noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        noimageindex: noIndex,
      },
    },
    authors: [
      {
        name: 'Infinite Productivity',
        url: 'https://infinite-productivity.com',
      },
    ],
  }
}

export const viewport: Viewport = {
  themeColor: '#000',
}

export default async function RootLayout({children}: LayoutProps<'/'>) {
  const {isEnabled: isDraftMode} = await draftMode()
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
    stega: false,
  })

  return (
    <html lang="en" className={`${allFontVars} light-theme`} data-scroll-behavior="smooth">
      <body>
        <Lenis />
        <GSAP />
        <div className="flex min-h-screen flex-col justify-start ts-p-md">
          <Navbar />
          <main className="grow" id="main-content">
            {children}
          </main>
          <Footer settings={settings as SettingsQueryResult} />
        </div>

        <Toaster />
        <SanityLive onError={handleError} />
        {isDraftMode && <DraftModeBootstrap />}
        <GlobalScripts />
      </body>
    </html>
  )
}
