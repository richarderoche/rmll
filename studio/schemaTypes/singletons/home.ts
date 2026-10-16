import StackCompactIcon from '@sanity/icons/StackCompact'
import {House} from 'lucide-react'
import {defineField, defineType} from 'sanity'
import {enableHeroField} from '../fields'

export default defineType({
  name: 'home',
  title: 'Home',
  type: 'document',
  icon: House,
  fields: [
    defineField({
      name: 'title',
      description: 'This field is the title of your personal website.',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField(enableHeroField),
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'pageHero',
      hidden: ({parent}) => !parent?.enableHero,
    }),
    defineField({
      name: 'pbSections',
      title: 'Page Builder',
      type: 'pbSections',
      icon: StackCompactIcon,
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        title,
      }
    },
  },
})
