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
}

const SocialIcon = ({name}: SocialIconProps) => {
  switch (name) {
    case 'Facebook':
      return <FaFacebookF className="block" />
    case 'Instagram':
      return <FaInstagram className="block" />
    case 'Soundcloud':
      return <FaSoundcloud className="block" />
    case 'Spotify':
      return <FaSpotify className="block" />
    case 'Tiktok':
      return <FaTiktok className="block" />
    case 'Twitter':
      return <FaXTwitter className="block" />
    case 'Threads':
      return <FaThreads className="block" />
    case 'YouTube':
      return <FaYoutube className="block" />
    case 'Github':
      return <FaGithub className="block" />
    case 'Linkedin':
      return <FaLinkedinIn className="block" />
    default:
      return null
  }
}

export default SocialIcon
