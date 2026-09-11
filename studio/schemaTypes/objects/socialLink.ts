import {
  IconBrandFacebook,
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandSoundcloud,
  IconBrandSpotify,
  IconBrandThreads,
  IconBrandTiktok,
  IconBrandX,
  IconBrandYoutube,
} from '@tabler/icons-react'
import {defineField, defineType} from 'sanity'

const getIcon = (icon: string) => {
  switch (icon) {
    case 'Facebook':
      return IconBrandFacebook
    case 'Instagram':
      return IconBrandInstagram
    case 'Soundcloud':
      return IconBrandSoundcloud
    case 'Spotify':
      return IconBrandSpotify
    case 'Twitter':
      return IconBrandX
    case 'Threads':
      return IconBrandThreads
    case 'YouTube':
      return IconBrandYoutube
    case 'Github':
      return IconBrandGithub
    case 'Linkedin':
      return IconBrandLinkedin
    case 'Tiktok':
      return IconBrandTiktok
    default:
      return false
  }
}

export default defineType({
  title: 'Social Link',
  name: 'socialLink',
  type: 'object',
  options: {
    columns: 2,
    collapsible: false,
  },
  fields: [
    defineField({
      title: 'Icon',
      name: 'icon',
      type: 'string',
      options: {
        list: [
          {title: 'Facebook', value: 'Facebook'},
          {title: 'Github', value: 'Github'},
          {title: 'Instagram', value: 'Instagram'},
          {title: 'Linkedin', value: 'Linkedin'},
          {title: 'Soundcloud', value: 'Soundcloud'},
          {title: 'Spotify', value: 'Spotify'},
          {title: 'Threads', value: 'Threads'},
          {title: 'Tiktok', value: 'Tiktok'},
          {title: 'X/Twitter', value: 'Twitter'},
          {title: 'YouTube', value: 'YouTube'},
        ],
      },
    }),
    defineField({
      title: 'URL',
      name: 'url',
      type: 'url',
    }),
  ],
  preview: {
    select: {
      icon: 'icon',
      url: 'url',
    },
    prepare({icon, url}) {
      return {
        title: icon,
        subtitle: url ? url : '(url not set)',
        media: getIcon(icon),
      }
    },
  },
})
