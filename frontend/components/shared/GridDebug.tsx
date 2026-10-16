import SiteGrid from './SiteGrid'
import SiteWidth from './SiteWidth'

export default function GridDebug() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <SiteWidth className="h-full">
        <SiteGrid className="h-full">
          {Array.from({length: 12}, (_, index) => index + 1).map((col) => (
            <div key={col} className="bg-red-500/7 h-full w-full min-h-1"></div>
          ))}
        </SiteGrid>
      </SiteWidth>
    </div>
  )
}
