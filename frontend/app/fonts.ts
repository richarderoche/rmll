import localFont from 'next/font/local'

const displayFont = localFont({
  src: [
    {
      path: '../public/fonts/american-grotesk-condensed-heavy.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  preload: true,
  variable: '--american-grotesk',
})

const sansFont = localFont({
  src: [
    {
      path: '../public/fonts/GT-Standard-S-Standard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/GT-Standard-S-Standard-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  preload: true,
  variable: '--gt-standard',
})

const serifFont = localFont({
  src: [
    {
      path: '../public/fonts/GT-Canon-M-Standard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  preload: true,
  variable: '--gt-canon',
})

const monoFont = localFont({
  src: [
    {
      path: '../public/fonts/GT-Canon-Mono-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  preload: false,
  variable: '--gt-canon-mono',
})

const fonts = [displayFont, serifFont, monoFont, sansFont]

export const allFontVars = fonts.map((font) => font.variable).join(' ')
