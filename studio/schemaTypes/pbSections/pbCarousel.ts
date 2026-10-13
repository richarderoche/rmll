import {AlignHorizontalJustifyEnd} from 'lucide-react'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {getTypeTitles} from '../../lib/utils'
import {sectionNameField} from '../fields'

const vList = [
  {title: 'Top', value: 'self-start'},
  {title: 'Middle', value: 'self-center'},
  {title: 'Bottom', value: 'self-end'},
]

export default defineType({
  title: 'Carousel',
  name: 'pbCarousel',
  type: 'object',
  icon: AlignHorizontalJustifyEnd,
  fields: [
    defineField({
      title: 'Section Settings',
      name: 'sectionSettings',
      type: 'pbSectionSettings',
    }),
    defineField(sectionNameField),
    defineField({
      title: 'Slides',
      name: 'slides',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              title: 'Slide Width (Desktop)',
              name: 'slideWidthDesktop',
              type: 'number',
              description: 'Relative to the window in steps of 1/12th',
              initialValue: 5,
              validation: (Rule) => Rule.required(),
              options: {
                list: [
                  {title: '2/12', value: 2},
                  {title: '3/12', value: 3},
                  {title: '4/12', value: 4},
                  {title: '5/12', value: 5},
                  {title: '6/12', value: 6},
                  {title: '7/12', value: 7},
                  {title: '8/12', value: 8},
                  {title: '9/12', value: 9},
                  {title: '10/12', value: 10},
                ],
              },
            },
            {
              title: 'Vertical Alignment',
              name: 'yAlignment',
              type: 'string',
              initialValue: 'self-start',
              validation: (Rule) => Rule.required(),
              options: {
                list: vList,
              },
            },
            defineField({
              title: 'Blocks',
              name: 'slideBlocks',
              type: 'array',
              of: [
                defineArrayMember({
                  title: 'Text',
                  type: 'pbBlockText',
                  initialValue: {
                    textStyle: 'ts-p-sm',
                    balanceLines: false,
                  },
                }),
                {title: 'Image', type: 'imageBasic'},
                {title: 'Quote', type: 'pbBlockQuote'},
              ],
            }),
          ],
          preview: {
            select: {
              slideWidthDesktop: 'slideWidthDesktop',
              yAlignment: 'yAlignment',
              slideBlocks: 'slideBlocks',
            },
            prepare({slideWidthDesktop, yAlignment, slideBlocks}) {
              const types = slideBlocks ? slideBlocks.map((block: any) => block._type) : []
              const blockList = getTypeTitles(types)
              const alignTitle = vList.find((o) => o.value === yAlignment)?.title
              return {
                title: `Slide (Width: ${slideWidthDesktop}/12, Align: ${alignTitle})`,
                subtitle: `Blocks: ${blockList || 'None'}`,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      sectionName: 'sectionName',
    },
    prepare({sectionName}) {
      return {
        title: sectionName ? `Carousel: ${sectionName}` : 'Carousel',
        media: AlignHorizontalJustifyEnd,
      }
    },
  },
})
