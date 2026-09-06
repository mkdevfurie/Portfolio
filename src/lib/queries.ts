import groq from 'groq'

/** Fragment image reutilisable : URL + metadata (ratio, couleur dominante). */
const imageFields = groq`
  "src": asset->url,
  "alt": coalesce(alt, ^.title, ""),
  "aspect": asset->metadata.dimensions.aspectRatio,
  "dominant": asset->metadata.palette.dominant.background
`

export const contentQuery = groq`{
  "settings": *[_type == "siteSettings"][0]{
    firstName, lastName, initials, title, tagline, bio1, bio2,
    email, whatsapp, web3formsKey, year,
    "cvUrl": cv.asset->url,
    socials,
    stats,
    theme,
    seo
  },

  "projects": *[_type == "project"] | order(order asc, _createdAt desc){
    _id, title, "slug": slug.current, shortName, subtitle, description, body,
    status, year, role, client, tags,
    "cover": cover{ ${imageFields} },
    "gallery": gallery[]{ ${imageFields} },
    liveUrl, repoUrl, featured, order,
    bgColor, nameColor
  },

  "skills": *[_type == "skill"] | order(order asc, name asc){
    _id, name, detail, category, order,
    "icon": icon{ ${imageFields} }
  },

  "experience": *[_type == "experience"] | order(order asc, _createdAt desc){
    _id, title, organization, period, description, type, order
  },

  "services": *[_type == "service"] | order(order asc){
    _id, title, subtitle, emoji, accent, order
  }
}`
