import {CalendarPlus} from 'lucide-react'
import {defineField, defineType} from 'sanity'
import {imgAltField} from '../fields'

export default defineType({
  name: 'event',
  title: 'Events',
  type: 'document',
  icon: CalendarPlus,
  orderings: [
    {
      title: 'Date, Newest First',
      name: 'dateDesc',
      by: [{field: 'date', direction: 'desc'}],
    },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      description: '1 sentence description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'date',
      title: 'Date & Time',
      description:
        'While time is not displayed, it is used to determine when the event moves from upcoming to past.',
      type: 'datetime',
      options: {
        dateFormat: 'YYYY-MM-DD',
        timeFormat: 'HH:mm',
        timeStep: 15,
        allowTimeZoneSwitch: true,
        displayTimeZone: 'America/Denver',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'thumbnailMain',
      title: 'Main Thumbnail',
      type: 'image',
      options: {
        hotspot: {
          previews: [
            {title: '1:1', aspectRatio: 1},
            {title: '16:9', aspectRatio: 1.7777777778},
          ],
        },
      },
      fields: [defineField(imgAltField)],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'thumbnailBook',
      title: 'Book Thumbnail (Optional)',
      description: 'Use only for book cover art, and only portrait orientation images',
      type: 'image',
      fields: [defineField(imgAltField)],
    }),
    defineField({
      name: 'locations',
      title: 'Locations',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'eventLocation'}]}],
    }),
    defineField({
      name: 'tags',
      title: 'Tags (Type of event)',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'eventTag'}]}],
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'object',
      fields: [
        defineField({
          name: 'linkType',
          title: 'Link Type',
          type: 'string',
          options: {
            list: [
              {title: 'Internal', value: 'sitePage'},
              {title: 'External', value: 'externalLink'},
            ],
            layout: 'radio',
            direction: 'horizontal',
          },
          initialValue: 'externalLink',
        }),
        defineField({
          name: 'sitePage',
          title: 'Link',
          type: 'reference',
          to: [{type: 'page'}],
          hidden: ({parent}) => parent?.linkType !== 'sitePage',
        }),
        defineField({
          name: 'externalLink',
          title: 'External Link',
          type: 'url',
          validation: (rule) =>
            rule.uri({
              scheme: ['http', 'https', 'mailto', 'tel'],
            }),
          hidden: ({parent}) => parent?.linkType !== 'externalLink',
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      location0: 'locations.0.title',
      location1: 'locations.1.title',
      tag0: 'tags.0.title',
      tag1: 'tags.1.title',
      media: 'thumbnailMain',
    },
    prepare({title, date, location0, location1, tag0, tag1, media}) {
      const dateString = date
        ? new Date(date).toLocaleDateString('en-US', {
            month: 'numeric',
            day: 'numeric',
          })
        : ''
      const allTags = [location0, location1, tag0, tag1].filter(Boolean)
      return {
        title: title ? title : 'Event',
        subtitle: `${dateString}: ${allTags.join(', ')}`,
        media: media || CalendarPlus,
      }
    },
  },
})
