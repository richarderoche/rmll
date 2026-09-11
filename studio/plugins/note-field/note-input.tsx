import React from 'react'
import { Box, Card, Flex, Text } from '@sanity/ui'
import startCase from 'lodash/startCase.js'

import type { noteInputProps, NoteOptions } from './types'

const NoteInput = (
  props: noteInputProps & { ref?: React.Ref<HTMLDivElement> },
): React.JSX.Element | null => {
  const { ref, ...args } = props
  const { title, description } = args.schemaType
  const options = args.schemaType.options as NoteOptions | undefined

  // get last item in args.path array
  const pathId = String(args.path[args.path.length - 1] ?? '')

  const displayTitle = startCase(pathId) === title ? null : title
  const Icon = options?.icon
  const tone = options?.tone ?? 'primary'

  // bail if nothing was set
  if (!displayTitle && !description) return null

  return (
    <Card ref={ref} data-note={pathId} padding={4} radius={2} tone={tone}>
      <Flex>
        {Icon && (
          <Box>
            <Text size={1} style={{ color: 'var(--card-icon-color)' }}>
              <Icon />
            </Text>
          </Box>
        )}
        <Box flex={1} marginLeft={Icon ? 3 : 0}>
          {displayTitle && (
            <Box marginBottom={description ? 3 : 0}>
              <Text size={1} weight="medium">
                {displayTitle}
              </Text>
            </Box>
          )}

          {description && (
            <Text size={1} muted>
              {description}
            </Text>
          )}
        </Box>
      </Flex>
    </Card>
  )
}

NoteInput.displayName = 'NoteInput'

export default NoteInput
