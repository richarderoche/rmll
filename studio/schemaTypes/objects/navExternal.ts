import LaunchIcon from '@sanity/icons/Launch'
import {defineField, defineType} from 'sanity'

const LINK_TYPE_OPTIONS: {title: string; value: string}[] = [
  {title: 'Manual URL', value: 'url'},
  {title: 'Donate', value: 'donate'},
  {title: 'Subscribe', value: 'subscribe'},
]

export default defineType({
  title: 'External Link',
  name: 'navExternal',
  type: 'object',
  icon: LaunchIcon,
  fields: [
    defineField({
      title: 'Title',
      name: 'title',
      type: 'string',
      description: 'Display Text',
    }),
    defineField({
      title: 'Link type',
      name: 'linkType',
      type: 'string',
      options: {
        list: LINK_TYPE_OPTIONS,
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'url',
    }),
    defineField({
      title: 'URL',
      name: 'url',
      type: 'url',
      description: 'Enter an external URL',
      hidden: ({parent}) => parent?.linkType !== 'url',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https', 'mailto', 'tel'],
        }),
    }),
    defineField({
      title: 'Donate Link',
      description:
        'This creates an external link to the URL set in the Settings "Donate Link" field (if set). Use this so that if you change the donate link, you only need to update the Settings and not all the buttons.',
      name: 'donateNote',
      type: 'note',
      hidden: ({parent}) => parent?.linkType !== 'donate',
    }),
    defineField({
      title: 'Subscribe Link',
      description:
        'This creates an external link to the URL set in the Settings "Newsletter Link" field (if set). Use this so that if you change the newsletter link, you only need to update the Settings and not all the buttons.',
      name: 'subscribeNote',
      type: 'note',
      hidden: ({parent}) => parent?.linkType !== 'subscribe',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      url: 'url',
    },
    prepare({title, url}) {
      return {
        title: title ?? url,
        subtitle: title && url,
        media: LaunchIcon,
      }
    },
  },
})
