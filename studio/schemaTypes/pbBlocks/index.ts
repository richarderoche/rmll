import {defineType} from 'sanity'

export default defineType({
  title: 'Content Blocks',
  name: 'pbBlocks',
  type: 'array',
  of: [
    {title: 'Text', type: 'pbBlockText'},
    {title: 'Image', type: 'pbBlockImage'},
    {title: 'Video Embed', type: 'pbBlockVideoEmbed'},
    {title: 'Buttons', type: 'pbBlockButtons'},
    {title: 'Divider/Spacer', type: 'pbBlockDivider'},
    {title: 'Quote', type: 'pbBlockQuote'},
    {title: 'Press Link', type: 'pbBlockPress'},
    {title: 'Scrolling Marquee', type: 'pbBlockMarquee'},
    {title: 'Rich Text', type: 'pbBlockRichText'},
    {title: 'Copy to Clipboard', type: 'pbBlockCopyToClipboard'},
  ],
  options: {
    insertMenu: {
      groups: [
        {
          name: 'essential',
          title: 'Essential',
          of: [
            'pbBlockText',
            'pbBlockImage',
            'pbBlockButton',
            'pbBlockDivider',
            'pbBlockQuote',
            'pbBlockVideoEmbed',
            'pbBlockRichText',
          ],
        },
        {
          name: 'specialty',
          title: 'Specialty',
          of: ['pbBlockPress', 'pbBlockMarquee', 'pbBlockCopyToClipboard'],
        },
      ],
    },
  },
})
