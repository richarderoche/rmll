import {defineType} from 'sanity'

export default defineType({
  title: 'Sections',
  name: 'pbSections',
  type: 'array',
  of: [
    {type: 'pbGridMulti'},
    {type: 'pbGridSingle'},
    {type: 'pbCarousel'},
    {type: 'pbLatestNews'},
    {type: 'pbEventsFeed'},
    {type: 'pbEventsCarousel'},
  ],
})
