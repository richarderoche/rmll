import {cn} from '@/lib/utils'
import {
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaSoundcloud,
  FaSpotify,
  FaThreads,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from 'react-icons/fa6'

export type SocialIconName =
  | 'Facebook'
  | 'Instagram'
  | 'Soundcloud'
  | 'Spotify'
  | 'Tiktok'
  | 'Twitter'
  | 'Threads'
  | 'YouTube'
  | 'Github'
  | 'Linkedin'

export type SocialIconProps = {
  name?: SocialIconName
  className?: string
}

const SocialIcon = ({name, className}: SocialIconProps) => {
  const classes = cn('block', className)
  switch (name) {
    case 'Facebook':
      return <FaFacebookF className={classes} />
    case 'Instagram':
      return <FaInstagram className={classes} />
    case 'Soundcloud':
      return <FaSoundcloud className={classes} />
    case 'Spotify':
      return <FaSpotify className={classes} />
    case 'Tiktok':
      return <FaTiktok className={classes} />
    case 'Twitter':
      return <FaXTwitter className={classes} />
    case 'Threads':
      return <FaThreads className={classes} />
    case 'YouTube':
      return <FaYoutube className={classes} />
    case 'Github':
      return <FaGithub className={classes} />
    case 'Linkedin':
      return <FaLinkedinIn className={classes} />
    default:
      return null
  }
}

export default SocialIcon
