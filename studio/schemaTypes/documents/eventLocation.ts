import {MapPin} from 'lucide-react'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'eventLocation',
  title: 'Event Locations',
  type: 'document',
  icon: MapPin,
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
      return {title: title ? title : 'Location', media: MapPin}
    },
  },
})
