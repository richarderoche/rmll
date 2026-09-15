import {QuoteIcon} from 'lucide-react'
import {defineField, defineType} from 'sanity'

const textStyleOptions = [
  {title: 'Auto (Based on column width)', value: 'ts-quote'},
  {title: 'H2', value: 'ts-h2-serif'},
  {title: 'H3', value: 'ts-h3'},
  {title: 'H4', value: 'ts-h4'},
]

export default defineType({
  name: 'pbBlockQuote',
  title: 'Quote',
  type: 'object',
  icon: QuoteIcon,
  fields: [
    defineField({
      name: 'quoteText',
      title: 'Quote Text',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'quoteCredit',
      title: 'Quote Credit',
      type: 'object',
      fields: [
        defineField({
          name: 'name',
          title: 'Name',
          type: 'string',
        }),
        defineField({
          name: 'subtitle',
          title: 'Subtitle',
          type: 'string',
        }),
      ],
    }),
    defineField({
      title: 'Quote Text Size',
      name: 'textStyle',
      type: 'string',
      options: {
        list: textStyleOptions,
      },
      initialValue: 'ts-quote',
    }),
    defineField({
      name: 'showQuoteMarks',
      title: 'Show Quote Marks?',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      quoteText: 'quoteText',
      name: 'quoteCredit.name',
    },
    prepare({quoteText, name}) {
      return {
        title: name ? 'Quote: ' + name : 'Quote',
        subtitle: quoteText ? quoteText : 'No Quote',
        media: QuoteIcon,
      }
    },
  },
})
