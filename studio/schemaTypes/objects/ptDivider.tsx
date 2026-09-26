import {Box, Flex} from '@sanity/ui'
import {SquareSplitVertical} from 'lucide-react'
import {defineField, defineType, type BlockProps, type PreviewProps} from 'sanity'

function PtDividerPreview(props: PreviewProps) {
  const {actions, layout = 'block', renderDefault, title} = props

  return (
    <Flex align="center" gap={2}>
      <Box flex={1}>{renderDefault({...props, title: title ?? 'Divider'})}</Box>
    </Flex>
  )
}

/** Insert always calls onMemberOpen; keep the object editor closed for this marker block. */
function PtDividerBlock(props: BlockProps) {
  return props.renderDefault({
    ...props,
    open: false,
    onOpen: () => {},
  })
}

export default defineType({
  name: 'ptDivider',
  title: 'Divider',
  type: 'object',
  icon: SquareSplitVertical,
  fields: [
    defineField({
      name: 'variant',
      type: 'string',
      initialValue: 'default',
      readOnly: true,
      hidden: true,
    }),
  ],
  components: {
    block: PtDividerBlock,
    preview: PtDividerPreview,
  },
  preview: {
    prepare: () => ({
      title: 'Divider',
      media: SquareSplitVertical,
    }),
  },
})
