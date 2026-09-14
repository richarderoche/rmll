import CogIcon from '@sanity/icons/Cog'
import {LinkIcon} from 'lucide-react'
import {defineField, defineType} from 'sanity'
import {capitalize, ptToText} from '../../lib/utils'
import {imgAltField} from '../fields'
import {BUTTON_TYPE_OPTIONS} from '../objects/button'

export default defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {
      name: 'header',
      title: 'Header',
    },
    {
      name: 'footer',
      title: 'Footer',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
    {
      name: 'scripts',
      title: 'Scripts',
    },
  ],
  fields: [
    defineField({
      name: 'headerNav',
      title: 'Header Navigation',
      type: 'navLinks',
      group: 'header',
    }),
    defineField({
      name: 'footerCTAs',
      title: 'Footer CTAs',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'heading',
              title: 'Heading',
              type: 'string',
            },
            {
              name: 'link',
              title: 'Link',
              type: 'button',
              initialValue: {
                style: 'underline',
              },
            },
          ],
          preview: {
            select: {
              heading: 'heading',
              linkType: 'link.linkType',
              linkStyle: 'link.style',
            },
            prepare({heading = 'No Heading', linkType, linkStyle}) {
              let subtitle = 'No Link'
              if (linkType && linkType.length > 0) {
                subtitle = BUTTON_TYPE_OPTIONS.find((o) => o.value === linkType)?.title || 'No Link'
              }
              if (linkStyle && linkStyle.length > 0) {
                subtitle += ` / ${capitalize(linkStyle)}`
              }
              return {
                title: heading,
                subtitle: subtitle,
                media: LinkIcon,
              }
            },
          },
        },
      ],
      group: 'footer',
    }),
    defineField({
      name: 'footerPopup',
      title: 'Footer Popup',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
        },
        {
          name: 'content',
          title: 'Content',
          type: 'ptSlim',
        },
        {
          name: 'image',
          title: 'Image',
          type: 'image',
          options: {
            hotspot: {
              previews: [{title: '4:1', aspectRatio: 4 / 1}],
            },
          },
          fields: [defineField(imgAltField)],
        },
      ],
      group: 'footer',
      preview: {
        select: {
          title: 'title',
          image: 'image.asset',
          content: 'content',
        },
        prepare({title, image, content}) {
          return {
            title: title,
            subtitle: content ? ptToText(content) : 'No Content',
            media: image,
          }
        },
      },
    }),
    defineField({
      name: 'socialIcons',
      title: 'Social Icons',
      type: 'array',
      group: 'footer',
      of: [
        {
          type: 'socialLink',
        },
      ],
    }),
    defineField({
      title: 'Footer Nav (Terms, Privacy, etc.)',
      name: 'footerNav',
      type: 'navLinks',
      group: 'footer',
    }),
    defineField({
      name: 'title',
      description: 'Used as the base in the <title> tag for SEO',
      title: 'Site Title',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'seo',
      title: 'Global SEO',
      description: 'Fallback SEO content for any page left blank',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'googletagmanagerID',
      title: 'Google Tag Manager ID',
      type: 'string',
      description:
        'If you need a cookie consent banner, use the custom scripts field below instead of this.',
      group: 'scripts',
    }),
    defineField({
      name: 'customScripts',
      title: 'Custom Scripts',
      type: 'array',
      of: [
        {
          name: 'customScript',
          title: 'Custom Script',
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Name (for your reference)',
              type: 'string',
            },
            {
              name: 'script',
              title: 'Script',
              type: 'text',
            },
            {
              name: 'category',
              title: 'Category',
              type: 'string',
              description:
                'Necessary: scripts that are required for the site to function. (e.g. Support chat, etc.) Analytics: scripts that are used to track site usage. (Triggers cookie consent banner) Marketing: scripts that are used to track marketing efforts. (Triggers cookie consent banner)',
              options: {
                list: ['necessary', 'analytics', 'marketing'],
              },
              initialValue: 'necessary',
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: {
              name: 'name',
              category: 'category',
            },
            prepare({name = 'Custom Script', category}) {
              return {
                title: name,
                subtitle: category,
              }
            },
          },
        },
      ],
      group: 'scripts',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Settings',
      }
    },
  },
})
