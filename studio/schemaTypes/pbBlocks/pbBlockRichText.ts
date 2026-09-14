import {TextInitial} from 'lucide-react'
import {defineField, defineType} from 'sanity'
import {ptToText} from '../../lib/utils'

export default defineType({
  name: 'pbBlockRichText',
  title: 'Rich Text',
  type: 'object',
  icon: TextInitial,
  fields: [defineField({name: 'textContent', title: 'Content', type: 'ptBasic'})],
  preview: {
    select: {
      content: 'textContent',
    },
    prepare({content}) {
      return {
        title: 'Rich Text',
        subtitle: content ? ptToText(content) : 'Empty',
        media: TextInitial,
      }
    },
  },
})
