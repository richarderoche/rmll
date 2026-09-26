import {Newspaper} from 'lucide-react'
import {defineField, defineType} from 'sanity'
import {imgAltField} from '../fields'

export default defineType({
  name: 'newsletter',
  title: 'Newsletters',
  type: 'document',
  icon: Newspaper,
  orderings: [
    {
      title: 'Publish Date, Newest First',
      name: 'publishDateDesc',
      by: [{field: 'publishDate', direction: 'desc'}],
    },
  ],
  fields: [
    defineField({
      name: 'edition',
      title: 'Edition',
      placeholder: 'e.g. Spring 2026',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'edition',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishDate',
      title: 'Publish Date (YYYY-MM-DD)',
      description: 'Does not control visibility, only ordering.',
      type: 'date',
      options: {
        dateFormat: 'YYYY-MM-DD',
      },
      validation: (rule) => rule.required(),
      initialValue: () => new Date().toISOString().split('T')[0],
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image / Thumbnail',
      type: 'image',
      options: {
        hotspot: {
          previews: [{title: '4:3', aspectRatio: 1.3333333333}],
        },
      },
      fields: [defineField(imgAltField)],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Body Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'teaserText',
      title: 'Teaser Text',
      description: '1-3 sentence intro/summary',
      type: 'text',
      rows: 3,
    }),
    defineField({
      title: 'Body Content (Below Title)',
      name: 'bodyContent',
      type: 'pbBlocks',
      initialValue: [
        {
          _type: 'pbBlockRichText',
          textContent: [
            {
              _type: 'block',
              style: 'normal',
              markDefs: [],
              children: [{_type: 'span', text: '', marks: []}],
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      description: 'Optional overrides (defaults to cover image, title, and teaser text).',
      type: 'seo',
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'edition',
      media: 'coverImage',
    },
    prepare({title, subtitle, media}) {
      return {
        title: subtitle ? subtitle : 'Newsletter',
        subtitle: title ? title : '(No Title)',
        media: media || Newspaper,
      }
    },
  },
})
