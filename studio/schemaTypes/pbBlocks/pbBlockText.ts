import {CaseSensitive} from 'lucide-react'
import {defineField, defineType} from 'sanity'

export const textStyleOptions = [
  {title: 'H1 (Sans Caps)', value: 'ts-h1'},
  {title: 'H2 (Sans Caps)', value: 'ts-h2'},
  {title: 'H2 (Serif)', value: 'ts-h2-serif'},
  {title: 'H3 (Serif)', value: 'ts-h3'},
  {title: 'H4 (Serif)', value: 'ts-h4'},
  {title: 'Body Large (Serif)', value: 'ts-p-lg'},
  {title: 'Body Medium (Sans)', value: 'ts-p-md'},
  {title: 'Body Small (Sans)', value: 'ts-p-sm'},
  {title: 'Body XS (Sans)', value: 'ts-p-xs'},
  {title: 'Label (Mono)', value: 'ts-h5'},
  {title: 'Label Small (Sans)', value: 'ts-h6'},
]

// If adding options, add classes to frontend/safelist-classes.txt
export const textColorOptions = [
  {title: 'Default (Dusk)', value: 'text-body'},
  {title: 'Green', value: 'text-sage-800'},
]

export default defineType({
  name: 'pbBlockText',
  title: 'Text',
  type: 'object',
  icon: CaseSensitive,
  fields: [
    defineField({
      title: 'Text Style',
      name: 'textStyle',
      type: 'string',
      options: {
        list: textStyleOptions,
      },
      initialValue: 'ts-p-md',
    }),
    defineField({
      title: 'Color',
      name: 'color',
      type: 'string',
      initialValue: 'text-body',
      options: {
        list: textColorOptions,
      },
    }),
    defineField({
      title: 'Balance Lines?',
      name: 'balanceLines',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'textContent',
      title: 'Text',
      type: 'text',
      rows: 4,
    }),
  ],
  preview: {
    select: {
      textContent: 'textContent',
      textStyle: 'textStyle',
    },
    prepare({textContent, textStyle}) {
      const bodyTextSizeText =
        textStyleOptions.find((o) => o.value === textStyle)?.title ?? 'Default'
      return {
        title: 'Text: ' + bodyTextSizeText,
        subtitle: textContent ? textContent : 'No Text',
        media: CaseSensitive,
      }
    },
  },
})
