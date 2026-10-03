import type {PbEventsFeedSection} from '@/types'
import SiteWidth from '../shared/SiteWidth'

export default function SectionEventsFeed({section}: {section: PbEventsFeedSection}) {
  const {title, listingType, events, showMoreQty} = section
  const hasEvents = events && events.length > 0

  if (!hasEvents) return null

  return <SiteWidth className="py-gut-50">Events Feed</SiteWidth>
}
