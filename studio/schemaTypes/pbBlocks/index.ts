import {defineType} from 'sanity'

export default defineType({
  title: 'Content Blocks',
  name: 'pbBlocks',
  type: 'array',
  of: [
    {title: 'Text', type: 'pbBlockText'},
    {title: 'Rich Text', type: 'pbBlockRichText'},
    {title: 'Image', type: 'pbBlockImage'},
    {title: 'Video Embed', type: 'pbBlockVideoEmbed'},
    {title: 'Buttons', type: 'pbBlockButtons'},
    {title: 'Divider/Spacer', type: 'pbBlockDivider'},
    {title: 'Scrolling Marquee', type: 'pbBlockMarquee'},
  ],
  options: {
    insertMenu: {
      groups: [
        {
          name: 'essential',
          title: 'Essential',
          of: [
            'pbBlockText',
            'pbBlockRichText',
            'pbBlockImage',
            'pbBlockVideoEmbed',
            'pbBlockButton',
            'pbBlockDivider',
          ],
        },
        {
          name: 'specialty',
          title: 'Specialty',
          of: ['pbBlockMarquee'],
        },
      ],
    },
  },
})
