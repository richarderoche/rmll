import {GalleryThumbnails} from 'lucide-react'
import {defineField, defineType} from 'sanity'

export default defineType({
  title: 'Events Carousel',
  name: 'pbEventsCarousel',
  type: 'object',
  icon: GalleryThumbnails,
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
      initialValue: 'Upcoming Events',
    }),
    defineField({
      name: 'listingType',
      title: 'Listing Type',
      type: 'string',
      options: {
        list: [
          {title: 'Upcoming', value: 'upcoming'},
          {title: 'Manual', value: 'manual'},
        ],
      },
      initialValue: 'upcoming',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'events',
      title: 'Events (Maximum 5)',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'event'}]}],
      hidden: ({parent}) => parent?.listingType !== 'manual',
      validation: (rule) => rule.max(5),
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Events Carousel',
        media: GalleryThumbnails,
      }
    },
  },
})
