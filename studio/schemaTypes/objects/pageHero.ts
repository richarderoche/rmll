import {IconBoxAlignTop, IconTextGrammar} from '@tabler/icons-react'
import {defineField, defineType} from 'sanity'
import {imgAltField} from '../fields'

// If adding options, add classes to frontend/safelist-classes.txt
export const headingColorOptions = [
  {title: 'White', value: 'text-offwhite'},
  {title: 'Olive', value: 'text-olive'},
  {title: 'Green', value: 'text-sage-800'},
  {title: 'Dusk', value: 'text-body'},
]

export default defineType({
  title: 'Hero Section',
  name: 'pageHero',
  type: 'object',
  icon: IconBoxAlignTop,
  fields: [
    defineField({
      title: 'Background Image',
      description: 'Pick a center point that looks good at all preview ratios',
      name: 'image',
      type: 'image',
      options: {
        hotspot: {
          previews: [
            {title: '1:2', aspectRatio: 0.5},
            {title: '1:1', aspectRatio: 1},
            {title: '2:1', aspectRatio: 2},
          ],
        },
      },
      fields: [defineField(imgAltField)],
    }),
    defineField({
      title: 'Heading Color',
      name: 'headingColor',
      type: 'string',
      options: {
        list: headingColorOptions,
      },
      initialValue: 'text-offwhite',
    }),
    defineField({
      title: 'Heading Text Segments',
      name: 'headingSegments',
      type: 'array',
      of: [
        {
          name: 'segment',
          type: 'object',
          icon: IconTextGrammar,
          fields: [
            defineField({
              title: 'Text',
              name: 'text',
              type: 'string',
            }),
            defineField({
              title: 'Alignment',
              name: 'alignment',
              type: 'string',
              options: {
                list: [
                  {title: 'Left', value: 'left'},
                  {title: 'Right', value: 'right'},
                ],
              },
              initialValue: 'left',
            }),
            defineField({
              title: 'Indent?',
              name: 'indent',
              type: 'boolean',
              description: 'Indents from aligment edge specified above',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              text: 'text',
              alignment: 'alignment',
              indent: 'indent',
            },
            prepare({text, alignment, indent}) {
              return {
                title: text,
                subtitle: `Align: ${alignment}, Indent: ${indent ? 'Yes' : 'No'}`,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(4).error('Maximum 4 segments'),
    }),
    defineField({
      title: 'Intro Text',
      name: 'introText',
      description: 'Small Paragraph style usually works best here',
      type: 'ptBasic',
    }),
    defineField({
      title: 'Film Strip?',
      name: 'filmStrip',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  options: {
    collapsible: true,
    collapsed: false,
  },
})
