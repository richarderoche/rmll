import {Tag} from 'lucide-react'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'eventTag',
  title: 'Event Tags',
  type: 'document',
  icon: Tag,
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
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
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {title: title ? title : 'Tag', media: Tag}
    },
  },
})
