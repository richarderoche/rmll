import {CalendarDays} from 'lucide-react'
import {defineField, defineType} from 'sanity'

export default defineType({
  title: 'Events Feed',
  name: 'pbEventsFeed',
  type: 'object',
  icon: CalendarDays,
  fields: [
    defineField({
      title: 'Section Settings',
      name: 'sectionSettings',
      type: 'pbSectionSettings',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'listingType',
      title: 'Listing Type',
      type: 'string',
      options: {
        list: [
          {title: 'Upcoming', value: 'upcoming'},
          {title: 'Past', value: 'past'},
          {title: 'Manual', value: 'manual'},
        ],
      },
      initialValue: 'upcoming',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'events',
      title: 'Events',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'event'}]}],
      hidden: ({parent}) => parent?.listingType !== 'manual',
    }),
    defineField({
      name: 'showMoreQty',
      title: 'Quantity Shown',
      description: 'Number of events shown intially, and loaded per "Show More" click',
      type: 'number',
      initialValue: 5,
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Events Feed',
        media: CalendarDays,
      }
    },
  },
})
