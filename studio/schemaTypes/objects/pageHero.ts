import {IconBoxAlignTop} from '@tabler/icons-react'
import {defineField, defineType} from 'sanity'
import {imgAltField} from '../fields'

export default defineType({
  title: 'Hero Section',
  name: 'pageHero',
  type: 'object',
  icon: IconBoxAlignTop,
  fields: [
    defineField({
      title: 'Image',
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
  ],
  options: {
    collapsible: true,
    collapsed: false,
  },
})
