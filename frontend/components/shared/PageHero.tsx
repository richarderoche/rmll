import type {PageHero as PageHeroType} from '@/sanity.types'
import PageHeroPicture from './PageHeroPicture'

export default function PageHero({enableHero, hero}: {enableHero: boolean; hero: PageHeroType}) {
  if (!enableHero || !hero?.image) return null

  return (
    <div>
      <PageHeroPicture image={hero.image} />
    </div>
  )
}
