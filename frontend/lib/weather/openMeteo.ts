import {RANCH_LATITUDE, RANCH_LONGITUDE} from '@/lib/weather/constants'

export type WeatherCondition =
  | 'sunny'
  | 'partlyCloudy'
  | 'cloudy'
  | 'rainy'
  | 'snowy'

export type RanchWeather = {
  tempF: number
  condition: WeatherCondition
}

type OpenMeteoCurrentResponse = {
  current?: {
    temperature_2m?: number
    weather_code?: number
  }
}

export function weatherCodeToCondition(code: number): WeatherCondition {
  if (code === 0) return 'sunny'
  if (code === 1 || code === 2) return 'partlyCloudy'
  if (code === 3 || code === 45 || code === 48) return 'cloudy'
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82) || (code >= 95 && code <= 99)) {
    return 'rainy'
  }
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snowy'
  return 'cloudy'
}

export const weatherConditionLabels: Record<WeatherCondition, string> = {
  sunny: 'Sunny',
  partlyCloudy: 'Partly cloudy',
  cloudy: 'Cloudy',
  rainy: 'Rainy',
  snowy: 'Snowy',
}

export async function getRanchWeather(): Promise<RanchWeather | null> {
  const params = new URLSearchParams({
    latitude: String(RANCH_LATITUDE),
    longitude: String(RANCH_LONGITUDE),
    current: 'temperature_2m,weather_code',
    temperature_unit: 'fahrenheit',
    timezone: 'auto',
  })

  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`

  try {
    const res = await fetch(url)

    if (!res.ok) return null

    const data = (await res.json()) as OpenMeteoCurrentResponse
    const tempF = data.current?.temperature_2m
    const code = data.current?.weather_code

    if (typeof tempF !== 'number' || typeof code !== 'number') return null

    return {
      tempF,
      condition: weatherCodeToCondition(code),
    }
  } catch {
    return null
  }
}
