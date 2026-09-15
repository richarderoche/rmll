import {AlignVerticalSpaceAround} from 'lucide-react'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'pbBlockDivider',
  title: 'Divider/Spacer',
  type: 'object',
  icon: AlignVerticalSpaceAround,
  fields: [
    defineField({
      title: 'Show Divider Line?',
      name: 'showDividerLine',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      title: 'Spacing (Above Line)',
      name: 'size',
      type: 'number',
      initialValue: 2,
      options: {
        list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
    }),
    defineField({
      title: 'Spacing (Below Line)',
      name: 'sizeBelow',
      type: 'number',
      initialValue: 2,
      options: {
        list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      },
      hidden: ({parent}) => !parent?.showDividerLine,
    }),
    defineField({
      title: 'Mobile Visibility',
      name: 'showOnMobile',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      title: 'Tablet Visibility',
      name: 'showOnTablet',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      title: 'Desktop Visibility',
      name: 'showOnDesktop',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      showOnMobile: 'showOnMobile',
      showOnTablet: 'showOnTablet',
      showOnDesktop: 'showOnDesktop',
      showDividerLine: 'showDividerLine',
      size: 'size',
      sizeBelow: 'sizeBelow',
    },
    prepare({showOnMobile, showOnTablet, showOnDesktop, showDividerLine, size = 0, sizeBelow = 0}) {
      const shownOn = []
      if (showOnMobile) shownOn.push('Mobile')
      if (showOnTablet) shownOn.push('Tablet')
      if (showOnDesktop) shownOn.push('Desktop')
      const titleLabel = showDividerLine ? 'Divider: ' : 'Spacer: '
      return {
        title: titleLabel + '(Above: ' + size + ' / Below: ' + sizeBelow + ')',
        subtitle: 'Shown on: ' + shownOn.join(', '),
        media: AlignVerticalSpaceAround,
      }
    },
  },
})
