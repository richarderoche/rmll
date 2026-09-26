import {Text} from '@sanity/ui'
import type {CSSProperties, ReactNode} from 'react'
import type {BlockStyleDefinition, BlockStyleProps} from 'sanity'

const SERIF: CSSProperties['fontFamily'] = 'Georgia, "Times New Roman", serif'
/** Serif-ish mono / typewriter fallbacks (GT Canon Mono on the site). */
const SERIF_MONO: CSSProperties['fontFamily'] =
  '"American Typewriter", "Courier New", Courier, monospace'
const SANS: CSSProperties['fontFamily'] = 'system-ui, -apple-system, sans-serif'

function createStylePreview(style: CSSProperties) {
  return function StylePreview(props: BlockStyleProps) {
    return (
      <Text as="div" style={style}>
        {props.children}
      </Text>
    )
  }
}

const stylePreviewComponents: Record<string, (props: BlockStyleProps) => ReactNode> = {
  h1: createStylePreview({
    fontFamily: SANS,
    fontSize: '1.75rem',
    fontWeight: 700,
    lineHeight: 1.1,
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
  }),
  h2: createStylePreview({
    fontFamily: SANS,
    fontSize: '1.375rem',
    fontWeight: 700,
    lineHeight: 1.15,
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
  }),
  'h2-serif': createStylePreview({
    fontFamily: SERIF,
    fontSize: '1.375rem',
    fontWeight: 700,
    lineHeight: 1.2,
  }),
  h3: createStylePreview({
    fontFamily: SERIF,
    fontSize: '1.25rem',
    fontWeight: 700,
    lineHeight: 1.2,
  }),
  h4: createStylePreview({
    fontFamily: SERIF,
    fontSize: '1.125rem',
    fontWeight: 700,
    lineHeight: 1.2,
  }),
  'p-lg': createStylePreview({
    fontFamily: SERIF,
    fontSize: '1.125rem',
    lineHeight: 1.45,
  }),
  'p-sm': createStylePreview({
    fontFamily: SANS,
    fontSize: '0.8125rem',
    lineHeight: 1.45,
  }),
  'p-xs': createStylePreview({
    fontFamily: SANS,
    fontSize: '0.75rem',
    lineHeight: 1.45,
  }),
  h5: createStylePreview({
    fontFamily: SERIF_MONO,
    fontSize: '0.8125rem',
    lineHeight: 1.2,
  }),
  h6: createStylePreview({
    fontFamily: SANS,
    fontSize: '0.6875rem',
    lineHeight: 1.2,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  }),
}

const ptStyleDefinitions = [
  {title: 'Default (Sans Body)', value: 'normal'},
  {title: 'H1 (Sans Caps)', value: 'h1'},
  {title: 'H2 (Sans Caps)', value: 'h2'},
  {title: 'H2 (Serif)', value: 'h2-serif'},
  {title: 'H3 (Serif)', value: 'h3'},
  {title: 'H4 (Serif)', value: 'h4'},
  {title: 'P LG (Serif Body)', value: 'p-lg'},
  {title: 'P SM (Sans Body)', value: 'p-sm'},
  {title: 'P XS (Sans Body)', value: 'p-xs'},
  {title: 'Label (Mono)', value: 'h5'},
  {title: 'Label Small (Sans Caps)', value: 'h6'},
] as const

export const ptStyles: BlockStyleDefinition[] = ptStyleDefinitions.map((style) => {
  if (style.value === 'normal') {
    return style
  }

  return {
    ...style,
    component: stylePreviewComponents[style.value],
  }
})
