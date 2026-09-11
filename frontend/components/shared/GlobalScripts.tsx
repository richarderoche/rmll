import ConsoleLog from '@/components/scripts/ConsoleLog'
import {sanityFetch} from '@/sanity/lib/live'
import {settingsQuery} from '@/sanity/lib/queries'
import {GoogleAnalytics, GoogleTagManager} from '@next/third-parties/google'
import CustomScriptsLoader from '../scripts/CustomScriptsLoader'

export default async function GlobalScripts() {
  const {data: settings} = await sanityFetch({
    query: settingsQuery,
    stega: false,
  })
  const {googletagmanagerID, customScripts} = settings || {}
  const googleTrackingId = googletagmanagerID?.trim()
  const enableProdScripts = process.env.NEXT_PUBLIC_PRODUCTION_SCRIPTS === 'true'

  return (
    <>
      {googleTrackingId?.startsWith('G-') && <GoogleAnalytics gaId={googleTrackingId} />}
      {googleTrackingId?.startsWith('GTM-') && <GoogleTagManager gtmId={googleTrackingId} />}
      {customScripts?.length ? (
        <CustomScriptsLoader customScripts={customScripts} enableProdScripts={enableProdScripts} />
      ) : null}
      {enableProdScripts && <ConsoleLog />}
    </>
  )
}
