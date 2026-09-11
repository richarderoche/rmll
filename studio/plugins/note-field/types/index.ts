import React from 'react'
import type { StringInputProps, StringSchemaType } from 'sanity'

export type ThemeColorToneKey =
  | 'default'
  | 'transparent'
  | 'primary'
  | 'positive'
  | 'caution'
  | 'critical'

export type NoteOptions = {
  icon?: React.ElementType
  tone?: ThemeColorToneKey
}

export type noteSchemaType = StringSchemaType

export type noteInputProps = StringInputProps<StringSchemaType>
