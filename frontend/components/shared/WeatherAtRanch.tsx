import {getRanchWeather, weatherConditionLabels} from '@/lib/weather/openMeteo'
import IconWeather from '../icons/IconWeather'

export default async function WeatherAtRanch() {
  const weather = await getRanchWeather()

  if (!weather) return null

  const conditionLabel = weatherConditionLabels[weather.condition]

  return (
    <div className="flex flex-col gap-y-3">
      <p className="flex flex-wrap items-center gap-x-[.45em] ts-h5">
        <span>At the Ranch</span>
        <span aria-hidden="true">
          <IconWeather className="size-em relative top-[-.0625em]" />
        </span>
        <span>{Math.round(weather.tempF)}°</span>
      </p>
      <a
        href="https://open-meteo.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-8 uppercase tracking-3 text-sage-700"
      >
        Via open-meteo.com
      </a>
    </div>
  )
}
