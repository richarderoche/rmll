import {defineField, defineType} from 'sanity'
import {revealEffectField, spaceBetweenBlocksField} from '../fields'

export const columnFields = [
  defineField({
    title: 'Card Mode',
    name: 'cardMode',
    type: 'boolean',
    initialValue: false,
  }),
  defineField(revealEffectField),
  defineField({
    title: 'Blocks',
    name: 'pbBlocks',
    type: 'pbBlocks',
  }),
  defineField(spaceBetweenBlocksField),
]

export default defineType({
  title: 'Column',
  name: 'column',
  type: 'object',
  fields: columnFields,
})
