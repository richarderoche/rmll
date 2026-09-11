import LinkIcon from '@sanity/icons/Link'
import {defineField, defineType} from 'sanity'

export default defineType({
  title: 'Page',
  name: 'navPage',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      title: 'Title Override',
      name: 'title',
      type: 'string',
      description: 'Display Text',
    }),
    defineField({
      title: 'Page',
      name: 'page',
      type: 'reference',
      to: [{type: 'home'}, {type: 'page'}, {type: 'project'}],
    }),
    defineField({
      name: 'anchorLink',
      title: 'Anchor Link',
      type: 'string',
      description: 'Scroll to an anchor link (e.g. #about)',
      validation: (Rule) => [
        Rule.regex(/^#?[a-z0-9-]+$/),
        Rule.custom((value) =>
          value && !value.startsWith('#') ? 'Anchor links should start with # (e.g. #about)' : true,
        ).warning(),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      pageTitle: 'page.title',
      pageSlug: 'page.slug.current',
      anchorLink: 'anchorLink',
    },
    prepare({title, pageSlug, pageTitle, anchorLink}) {
      return {
        title: `${title || pageTitle}`,
        subtitle: `/${pageSlug ? pageSlug : ''}${anchorLink ? `${anchorLink}` : ''}`,
        media: LinkIcon,
      }
    },
  },
})
