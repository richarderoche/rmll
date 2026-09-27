import {Newspaper} from 'lucide-react'
import {defineField, defineType} from 'sanity'

export default defineType({
  title: 'Latest Newsletter Section',
  name: 'pbLatestNews',
  type: 'object',
  icon: Newspaper,
  fields: [
    defineField({
      title: 'Section Settings',
      name: 'sectionSettings',
      type: 'pbSectionSettings',
    }),
    defineField({
      name: 'priority',
      title: 'High Priority Loading',
      type: 'boolean',
      description: 'Enable for images above the fold to improve loading performance',
      initialValue: true,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Latest Newsletter',
        media: Newspaper,
      }
    },
  },
})
