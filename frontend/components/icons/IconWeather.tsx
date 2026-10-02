export default function IconWeather({...props}: React.SVGProps<SVGSVGElement>) {
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
      <path d="M9 2.81V1.13M9 12.94a3.94 3.94 0 1 0 0-7.88 3.94 3.94 0 0 0 0 7.88ZM4.5 4.5 3.38 3.38M4.5 13.5l-1.12 1.13M13.5 4.5l1.13-1.12M13.5 13.5l1.13 1.13M2.81 9H1.13M9 15.19v1.69M15.19 9h1.69" />
    </svg>
  )
}
