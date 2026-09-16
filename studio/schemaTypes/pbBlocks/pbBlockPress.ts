import {NewspaperIcon} from 'lucide-react'
import {defineField, defineType} from 'sanity'

const hotspotPreviews = [{title: '5:2', aspectRatio: 2.5}]

export default defineType({
  name: 'pbBlockPress',
  title: 'Press Link',
  type: 'object',
  icon: NewspaperIcon,
  fields: [
    defineField({
      name: 'format',
      title: 'Format',
      type: 'string',
      options: {
        list: [
          {title: 'Thumbnail', value: 'thumbnail'},
          {title: 'Text Only', value: 'textOnly'},
        ],
      },
      initialValue: 'textOnly',
    }),
    defineField({
      name: 'title',
      title: 'Article Title',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'source',
      title: 'Source (e.g. The New York Times)',
      type: 'string',
    }),
    defineField({
      name: 'logo',
      title: 'Source Logo (Optional)',
      type: 'image',
      hidden: ({parent}) => parent?.format === 'textOnly',
    }),
    defineField({
      title: 'Link URL',
      name: 'url',
      type: 'url',
      description: 'Enter an external URL',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'image',
      title: 'Thumbnail Image',
      type: 'image',
      options: {
        hotspot: {
          previews: hotspotPreviews,
        },
      },
      hidden: ({parent}) => parent?.format === 'textOnly',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      source: 'source',
      image: 'image.asset',
      format: 'format',
    },
    prepare({title, source, image, format}) {
      const formatText = format === 'thumbnail' ? 'Thumbnail' : 'Text Only'
      const sourceText = source ? source : '(No Source)'
      const titleText = title ? title : '(No Title)'
      return {
        title: 'Press Link (' + formatText + ')',
        subtitle: sourceText + ' / ' + titleText,
        media: image ? image : NewspaperIcon,
      }
    },
  },
})
