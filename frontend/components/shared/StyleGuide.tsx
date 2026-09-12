'use client'
import chroma from 'chroma-js'
import Button from './Button'
import Divider from './Divider'
import SiteGrid from './SiteGrid'
import SiteWidth from './SiteWidth'

export default function StyleGuide() {
  return (
    <SiteWidth className="my-gut-200">
      <h1 className="ts-h1 mb-gut">Style Guide</h1>
      <Divider />
      <SiteGrid yGaps>
        <div className="col-span-12 lg:col-span-6 mt-gut-200">
          <h6 className="ts-h6 text-body-subtle mb-gut-200">Heading/Label Styles</h6>
          <div className="flex flex-col gap-gut">
            {hStyles.map((style) => (
              <div key={style.name} className="col-span-12 lg:col-span-6">
                <h1 className={style.style}>{style.name}</h1>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-6 mt-gut-200">
          <h6 className="ts-h6 text-body-subtle mb-gut-200">Paragraph Styles</h6>
          <div className="flex flex-col gap-gut pr-gut">
            {pStyles.map((style) => (
              <div key={style.name} className="col-span-12 lg:col-span-6">
                <p className={`${style.style} max-w-max-ch text-pretty`}>
                  {style.name} <span className="text-current/25">•</span> {ipsum}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 mt-gut-200">
          <h6 className="ts-h6 text-body-subtle mb-gut-200">UI Elements</h6>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-gut">
            <div>
              <Button path="/" text="Filled" />
            </div>
            <Button text="Outline" style="outline" onClick={() => alert('Alt Button clicked')} />
          </div>
        </div>
        <div className="col-span-12 lg:col-span-3 mt-gut-200">
          <h6 className="ts-h6 text-body-subtle mb-gut-200">Color Values</h6>
          <div className="flex flex-col gap-gut-50">
            {HexColors.map((color) => (
              <div key={color.name} className="flex items-center gap-gut-50 h-[2em]">
                <div
                  style={{backgroundColor: color.hex}}
                  className="aspect-square h-full border-gray-500 border"
                ></div>
                <div className="grow whitespace-nowrap">
                  <p>{color.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5 mt-gut-200">
          <h6 className="ts-h6 text-body-subtle mb-gut-200">Color Variables</h6>
          <pre className="ts-p-xs overflow-x-auto whitespace-pre rounded-sm border border-current/25 p-gut-50">
            {colorCssVariables}
          </pre>
        </div>
      </SiteGrid>
    </SiteWidth>
  )
}

const ipsum =
  'In a world filled with CGI-laden reboots and remakes, the 1990 "Teenage Mutant Ninja Turtles" film stands as a testament to the power of storytelling, practical effects, and the enduring love for these pizza-eating, crime-fighting turtles.'

const hStyles = [
  {
    name: 'H1 Heading',
    style: 'ts-h1',
  },
  {
    name: 'H2 Heading',
    style: 'ts-h2',
  },
  {
    name: 'H2 Serif',
    style: 'ts-h2-serif',
  },
  {
    name: 'H3 Heading',
    style: 'ts-h3',
  },
  {
    name: 'H4 Heading',
    style: 'ts-h4',
  },
  {
    name: 'H5 Label',
    style: 'ts-h5',
  },
  {
    name: 'H6 Label',
    style: 'ts-h6',
  },
]

const pStyles = [
  {
    name: 'P LG',
    style: 'ts-p-lg',
  },
  {
    name: 'P MD (Default)',
    style: 'ts-p-md',
  },
  {
    name: 'P SM',
    style: 'ts-p-sm',
  },
  {
    name: 'P XS',
    style: 'ts-p-xs',
  },
]

const HexColors = [
  {name: 'Green 900', hex: '#0F261F'},
  {name: 'Green 800', hex: '#00592E'},
  {name: 'Green 700 (photo tint)', hex: '#027357'},
  {name: 'Green 200', hex: '#BBDFCC'},
  {name: 'Green 100', hex: '#E4F7E6'},
  {name: 'Offwhite', hex: '#F2F8F2'},
  {name: 'Olive', hex: '#BAC700'},
]

function toColorVarName(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-')
}

function formatOklchValue(value: number, maxDecimals: number) {
  return Number(value.toFixed(maxDecimals)).toString()
}

function hexToOklchValues(hex: string) {
  const [l, c, h] = chroma(hex).oklch()
  const hue = Number.isFinite(h) ? h : 0
  return `${formatOklchValue(l, 4)} ${formatOklchValue(c, 4)} ${formatOklchValue(hue, 1)}`
}

function generateColorCssVariables(colors: typeof HexColors) {
  const rootLines = colors.map(
    ({name, hex}) => `  --${toColorVarName(name)}-oklch: ${hexToOklchValues(hex)};`,
  )
  const themeLines = colors.map(
    ({name}) => `  --color-${toColorVarName(name)}: oklch(var(--${toColorVarName(name)}-oklch));`,
  )

  return `:root {\n${rootLines.join('\n')}\n}\n\n@theme {\n${themeLines.join('\n')}\n}`
}

const colorCssVariables = generateColorCssVariables(HexColors)
