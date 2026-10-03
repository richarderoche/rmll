import DocumentPdfIcon from '@sanity/icons/DocumentPdf'
import DocumentSheetIcon from '@sanity/icons/DocumentSheet'
import {defineField, defineType} from 'sanity'
import {ptStyles} from './ptBlockStyles'

export {ptStyles}

export default defineType({
  name: 'ptBasic',
  title: 'RTE',
  type: 'array',
  of: [
    {
      type: 'block',
      marks: {
        decorators: [{title: 'Strong', value: 'strong'}],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'href',
                type: 'url',
                title: 'Url',
                validation: (Rule) =>
                  Rule.uri({
                    scheme: ['http', 'https', 'mailto', 'tel'],
                  }),
              }),
            ],
          },
          {
            name: 'internalLink',
            type: 'object',
            title: 'Internal link',
            icon: DocumentSheetIcon,
            fields: [
              defineField({
                name: 'reference',
                type: 'reference',
                title: 'Reference',
                to: [{type: 'page'}, {type: 'newsletter'}],
              }),
            ],
          },
          {
            name: 'fileLink',
            type: 'object',
            title: 'File link',
            icon: DocumentPdfIcon,
            fields: [
              defineField({
                title: 'File',
                name: 'file',
                type: 'file',
                options: {
                  accept: '.pdf,.doc,.docx,.ppt,.pptx',
                },
              }),
            ],
          },
        ],
      },
      styles: ptStyles,
    },
  ],
})
