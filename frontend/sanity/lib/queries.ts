import {defineQuery} from 'next-sanity'

// PARTIALS
const seo = `
  "seoTitle": seo.seoTitle,
  "description": seo.description,
  "ogImage": seo.image,
  "noIndex": seo.hideFromSearchEngines
`

const page = `
  "type": _type,
  "slug": slug.current,
  title
`

const link = `
  ...,
  "page": page->{
    ${page},
  }
`

const portableText = `
  ...,
  markDefs[]{
    ...,
    _type == "internalLink" => {
      ...,
      "slug": reference->slug,
      "type": reference->_type
    }
  }
`
const settingsNewsletterLink = `*[_type == "settings"][0].newsletterLink`

const eventData = `
  title,
  subtitle,
  date,
  thumbnailMain,
  thumbnailBook,
  locations[]->{
    title,
    "slug": slug.current,
  },
  tags[]->{
    title,
    "slug": slug.current,
  },
  "link": link {
    linkType,
    "path": select(
      linkType == "sitePage" => sitePage->slug.current,
      linkType == "externalLink" => externalLink,
    ),
  }
`

const pbButton = `
  ...,
  sitePage {
    ${link},
  },
  externalLink {
    ${link},
  },
  fileLink {
    ...,
    "url": file.asset->url,
  },
  linkType == "subscribe" => {
    "externalLink": {
      ...,
      "title": coalesce(subscribeText, "Subscribe"),
      "url": ${settingsNewsletterLink}
    }
  },
`

const pbBlocks = `
  ...,
  _type == "pbBlockRichText" => {
    ...,
    textContent[]{
      ${portableText}
    }
  },
  _type == "pbBlockButtons" => {
    buttons[]{
      ${pbButton}
    }
  },
`

const pb = `
  pbSections[]{
    ...,
    _type == "pbGridMulti" => {
      columns[]{
        ...,
        pbBlocks[]{
          ${pbBlocks}
        }
      }
    },
    _type == "pbGridSingle" => {
      ...,
      pbBlocks[]{
        ${pbBlocks}
      }
    },
    _type == "pbGridDouble" => {
      ...,
      columnOne {
        ...,
        pbBlocks[]{
          ${pbBlocks}
        }
      },
      columnTwo {
        ...,
        pbBlocks[]{
          ${pbBlocks}
        }
      }
    },
    _type == "pbEventsFeed" => {
      ...,
      "events": select(
        listingType == "manual" => events[defined(@)]->{
          ${eventData}
        },
        listingType == "upcoming" => *[
          _type == "event" &&
          defined(date) &&
          dateTime(date) >= dateTime(now())
        ] | order(date asc){
          ${eventData}
        },
        listingType == "past" => *[
          _type == "event" &&
          defined(date) &&
          dateTime(date) < dateTime(now())
        ] | order(date desc){
          ${eventData}
        },
        []
      )
    },
    _type == "pbLatestNews" => {
      ...,
      "newsletter": *[
        _type == "newsletter" &&
        defined(slug.current)
      ] | order(publishDate desc)[0]{
        "slug": slug.current,
        title,
        edition,
        coverImage,
        teaserText,
      }
    },
  }
`

// QUERIES
export const homePageQuery = defineQuery(`
  *[_type == "home"][0]{
    ...,
    ${pb},
  }
`)

export const pagesBySlugQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug][0] {
    ...,
    "slug": slug.current,
    ${pb},
    ${seo},
  }
`)

export const newsletterBySlugQuery = defineQuery(`
  *[_type == "newsletter" && slug.current == $slug][0] {
    ...,
    "slug": slug.current,
    bodyContent[]{
      ${pbBlocks}
    },
    "editions": *[
      _type == "newsletter" &&
      defined(slug.current)
    ] | order(publishDate desc){
      "value": slug.current,
      "label": edition,
    },
    "subscribeUrl": ${settingsNewsletterLink},
    ${seo},
  }
`)
export const slugsByTypeQuery = defineQuery(`
  *[_type == $type && defined(slug.current)]{"slug": slug.current}
`)

export const sitemapByTypeQuery = defineQuery(`
  *[_type == $type]{"slug": slug.current, "updatedAt": _updatedAt}
`)

export const settingsQuery = defineQuery(`
  *[_type == "settings"][0]{
    ...,
    "headerNav": headerNav.navItems[]{
      ${link},
    },
    "footerCTAs": footerCTAs[]{
      ...,
      link {
        ${pbButton}
      },
    },
    "footerNav": footerNav.navItems[]{
      ${link},
    },
    ${seo},
  }
`)

export const scriptsQuery = defineQuery(`
  *[_type == "settings"][0]{
    "gtmId": googletagmanagerID,
    customScripts,
  }
`)
