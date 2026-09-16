import page from './documents/page'
import project from './documents/project'
import redirect from './documents/redirect'
import button from './objects/button'
import navExternal from './objects/navExternal'
import navLinks from './objects/navLinks'
import navPage from './objects/navPage'
import ptBasic from './objects/ptBasic'
import ptBody from './objects/ptBody'
import ptSingle from './objects/ptSingle'
import ptSlim from './objects/ptSlim'
import seo from './objects/seo'
import socialLink from './objects/socialLink'
import pbBlocks from './pbBlocks'
import pbBlockButtons from './pbBlocks/pbBlockButtons'
import pbBlockCopyToClipboard from './pbBlocks/pbBlockCopyToClipboard'
import pbBlockDivider from './pbBlocks/pbBlockDivider'
import pbBlockImage from './pbBlocks/pbBlockImage'
import pbBlockMarquee from './pbBlocks/pbBlockMarquee'
import pbBlockPress from './pbBlocks/pbBlockPress'
import pbBlockQuote from './pbBlocks/pbBlockQuote'
import pbBlockRichText from './pbBlocks/pbBlockRichText'
import pbBlockText from './pbBlocks/pbBlockText'
import pbBlockVideoEmbed from './pbBlocks/pbBlockVideoEmbed'
import pbSections from './pbSections'
import column from './pbSections/column'
import pbColSettings from './pbSections/pbColSettings'
import pbGridDouble from './pbSections/pbGridDouble'
import pbGridMulti from './pbSections/pbGridMulti'
import pbGridSingle from './pbSections/pbGridSingle'
import pbSectionSettings from './pbSections/pbSectionSettings'
import pbTitleSection from './pbSections/pbTitle'
import home from './singletons/home'
import settings from './singletons/settings'

export const singletonSchemaTypes = [home, settings]

export const schemaTypes = [
  // Singletons
  home,
  settings,
  // Documents
  page,
  project,
  redirect,
  // Objects
  button,
  column,
  navExternal,
  navLinks,
  navPage,
  pbBlockImage,
  pbBlockButtons,
  pbBlocks,
  pbBlockCopyToClipboard,
  pbBlockDivider,
  pbBlockMarquee,
  pbBlockPress,
  pbBlockQuote,
  pbBlockRichText,
  pbBlockText,
  pbBlockVideoEmbed,
  pbColSettings,
  pbGridMulti,
  pbGridSingle,
  pbGridDouble,
  pbSections,
  pbSectionSettings,
  pbTitleSection,
  ptBasic,
  ptBody,
  ptSingle,
  ptSlim,
  seo,
  socialLink,
]

export const singletons = []
