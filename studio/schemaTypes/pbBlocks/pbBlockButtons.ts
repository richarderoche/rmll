import {SquareArrowRight} from 'lucide-react'
import {defineField, defineType} from 'sanity'

export default defineType({
  title: 'Button Group',
  name: 'pbBlockButtons',
  type: 'object',
  icon: SquareArrowRight,
  fields: [
    defineField({
      title: 'Buttons',
      name: 'buttons',
      type: 'array',
      of: [{type: 'button'}],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      buttons: 'buttons',
    },
    prepare({buttons}) {
      const count = buttons?.length ?? 0
      return {
        title: 'Buttons',
        subtitle: count === 1 ? '1 button' : `${count} buttons`,
        media: SquareArrowRight,
      }
    },
  },
})
