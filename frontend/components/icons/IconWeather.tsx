import {WeatherCondition} from '@/lib/weather/openMeteo'

export default function IconWeather({
  condition,
  ...props
}: {condition: WeatherCondition} & React.SVGProps<SVGSVGElement>) {
  const iconPath = getIconPath(condition)

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      {...props}
    >
      {iconPath}
    </svg>
  )
}

function getIconPath(condition: WeatherCondition) {
  switch (condition) {
    case 'sunny':
      return (
        <path d="M9 2.81V1.13M9 12.94a3.94 3.94 0 1 0 0-7.88 3.94 3.94 0 0 0 0 7.88ZM4.5 4.5 3.38 3.38M4.5 13.5l-1.12 1.13M13.5 4.5l1.13-1.12M13.5 13.5l1.13 1.13M2.81 9H1.13M9 15.19v1.69M15.19 9h1.69" />
      )
    case 'partlyCloudy':
      return (
        <>
          <path d="m6.16 3.99-.29-1.66M3.99 5.37 2.6 4.41M3.43 7.9l-1.66.3M8.68 4.55l.97-1.39M6.9 9.17a3.1 3.1 0 1 0-1 6.02h5.63a4.78 4.78 0 1 0-4.78-5.06v.3" />
          <path d="M4.2 9.51a3.38 3.38 0 1 1 5.63-3.58" />
        </>
      )
    case 'cloudy':
      return <path d="M5.77 7.14a3.61 3.61 0 1 0-1.16 7.03h6.56a5.58 5.58 0 1 0-5.58-5.9v.35" />
    case 'rainy':
      return (
        <>
          <path d="M6.19 6.19a4.79 4.79 0 1 1 4.78 5.06H5.34a3.1 3.1 0 1 1 1-6.02" />
          <path d="m8 11-2 3.46M10 13l-2 3.46" />
        </>
      )
    case 'snowy':
      return (
        <path d="M9 4.5v9M7.31 2.81 9 4.5l1.69-1.69M7.31 15.19 9 13.5l1.69 1.69M5.1 6.75l7.8 4.5M2.81 7.31l2.3-.56L4.5 4.5M13.5 13.5l-.6-2.25 2.29-.56M5.1 11.25l7.8-4.5M4.5 13.5l.6-2.25-2.29-.56M15.19 7.31l-2.3-.56.61-2.25" />
      )
  }
}
