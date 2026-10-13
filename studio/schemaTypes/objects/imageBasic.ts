import {Image as ImageIcon} from 'lucide-react'
import {defineField, defineType} from 'sanity'
import {imgAltField} from '../fields'
import {crops, hotspotPreviews} from '../pbBlocks/pbBlockImage'

export default defineType({
  name: 'imageBasic',
  title: 'Image',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: {
          previews: hotspotPreviews,
        },
      },
      fields: [defineField(imgAltField)],
    }),
    defineField({
      name: 'imageCrop',
      title: 'Aspect Ratio',
      type: 'number',
      options: {
        list: crops,
      },
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      image: 'image.asset',
      alt: 'image.alt',
      imageCrop: 'imageCrop',
    },
    prepare({image, alt, imageCrop}) {
      const maxLen = 40
      const truncate = (str: string) => (str.length > maxLen ? str.slice(0, maxLen - 1) + '…' : str)
      const altText = alt ? `${truncate(alt)}` : '(no alt text)'
      const imageCropText = imageCrop
        ? `Crop: ${crops.find((crop) => crop.value === imageCrop)?.title}`
        : 'Crop: Original'
      return {
        title: 'Image: ' + altText,
        subtitle: imageCropText,
        media: image ? image : ImageIcon,
      }
    },
  },
})
