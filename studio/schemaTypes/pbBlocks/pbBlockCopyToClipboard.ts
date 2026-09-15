import {ClipboardCopy} from 'lucide-react'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'pbBlockCopyToClipboard',
  title: 'Copy to Clipboard',
  type: 'object',
  icon: ClipboardCopy,
  fields: [
    defineField({
      name: 'textToCopy',
      title: 'Text to Copy',
      type: 'text',
      rows: 1,
    }),
  ],
  preview: {
    select: {
      textToCopy: 'textToCopy',
    },
    prepare({textToCopy}) {
      return {
        title: 'Copy to Clipboard',
        subtitle: textToCopy ? textToCopy : 'No Text',
        media: ClipboardCopy,
      }
    },
  },
})
