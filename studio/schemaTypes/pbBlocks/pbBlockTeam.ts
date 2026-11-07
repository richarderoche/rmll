import {CircleUser, UserGroup} from 'lucide-react'
import {defineField, defineType} from 'sanity'

export default defineType({
  title: 'Team',
  name: 'pbBlockTeam',
  type: 'object',
  icon: UserGroup,
  fieldsets: [
    {
      title: 'People Per Row',
      description: 'Mobile always 1',
      name: 'columns',
      options: {columns: 3, collapsible: false},
    },
  ],
  fields: [
    {
      type: 'note',
      name: 'columnsNote',
      description:
        'The format of the team member blocks (full vs thumbnails) will automaically be determined based on the available width of the block. Per row settings are subdivisions of the current grid column. E.g. if this block in a 6/12 column on desktop, if you choose 2 per row below, each person will take up 3/12 of the total grid width.',
    },
    defineField({
      title: 'Tablet',
      name: 'columnsTablet',
      type: 'number',
      fieldset: 'columns',
      options: {
        list: [1, 2],
      },
      initialValue: 2,
      validation: (rule) => rule.required().min(1).max(2),
    }),
    defineField({
      title: 'Desktop',
      name: 'columnsDesktop',
      type: 'number',
      fieldset: 'columns',
      options: {
        list: [1, 2, 3],
      },
      initialValue: 2,
      validation: (rule) => rule.required().min(1).max(3),
    }),
    defineField({
      title: 'Desktop XL (> 1800)',
      name: 'columnsDesktopXL',
      type: 'number',
      fieldset: 'columns',
      options: {
        list: [1, 2, 3, 4],
      },
      initialValue: 2,
      validation: (rule) => rule.required().min(1).max(4),
    }),
    defineField({
      title: 'Team',
      name: 'teamMembers',
      type: 'array',
      of: [
        {
          title: 'Team Member',
          name: 'teamMember',
          type: 'object',
          icon: CircleUser,
          fields: [
            defineField({
              title: 'Image',
              name: 'image',
              type: 'image',
              options: {
                hotspot: {
                  previews: [{title: '1:1', aspectRatio: 1}],
                },
              },
            }),
            defineField({
              title: 'Name',
              name: 'name',
              type: 'string',
            }),
            defineField({
              title: 'Role',
              name: 'role',
              type: 'string',
            }),
            defineField({
              title: 'Bio',
              name: 'bio',
              type: 'ptSlim',
            }),
          ],
          preview: {
            select: {
              name: 'name',
              role: 'role',
              image: 'image',
            },
            prepare({name, role, image}) {
              return {
                title: name ?? 'Team Member',
                subtitle: role ?? '(No Role)',
                media: image ?? CircleUser,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      columnsTablet: 'columnsTablet',
      columnsDesktop: 'columnsDesktop',
      teamCount: 'teamMembers.length',
    },
    prepare({columnsTablet, columnsDesktop, teamCount}) {
      return {
        title: teamCount ? `Team / Members: ${teamCount}` : 'Team',
        subtitle: `Tablet Columns: ${columnsTablet} / Desktop Columns: ${columnsDesktop}`,
        media: UserGroup,
      }
    },
  },
})
