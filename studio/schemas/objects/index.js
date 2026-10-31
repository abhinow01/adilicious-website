import {defineField, defineType} from 'sanity'

/**
 * Text that keeps the site's typographic accents without a rich-text editor:
 *   - a new line becomes a line break
 *   - *words in asterisks* become the italic accent
 * The website renders it with `renderDisplayText()` in src/sanity/text.jsx.
 */
export const DISPLAY_TEXT_HELP = 'New line = line break. Wrap words in *asterisks* for the italic accent.'

export const displayText = (name, title, extra = {}) =>
  defineField({
    name,
    title,
    type: 'text',
    rows: 3,
    description: DISPLAY_TEXT_HELP,
    ...extra,
  })

export const seo = defineType({
  name: 'seo',
  title: 'SEO & sharing',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  description: 'Leave empty to use the defaults from Site settings.',
  fields: [
    defineField({
      name: 'title',
      title: 'Meta title',
      type: 'string',
      description: 'Shown in Google results and browser tabs. Aim for 50–60 characters.',
      validation: (r) => r.max(70).warning('Titles over ~60 characters get cut off in search results.'),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description: 'Shown under the title in Google. Aim for 120–160 characters.',
      validation: (r) => [
        r.max(170).warning('Descriptions over ~160 characters get cut off.'),
        r.min(50).warning('Very short descriptions are often replaced by Google.'),
      ],
    }),
    defineField({
      name: 'image',
      title: 'Social sharing image',
      type: 'image',
      description: 'Used when the page is shared (WhatsApp, LinkedIn, X…). Use 1200 × 630 px.',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alternative text', type: 'string'})],
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'href',
      title: 'Link to',
      type: 'string',
      description: 'A section on the page (#reserve), a page path (/work), an email (mailto:…) or a full URL.',
      validation: (r) =>
        r.custom((value) => {
          if (!value) return true
          return /^(#|\/|mailto:|tel:|https?:\/\/)/.test(value)
            ? true
            : 'Start with #, /, mailto:, tel: or https://'
        }),
    }),
  ],
  preview: {select: {title: 'label', subtitle: 'href'}},
})

export const contact = defineType({
  name: 'contact',
  title: 'Contact',
  type: 'object',
  fields: [
    defineField({name: 'label', title: 'Label', type: 'string', description: 'e.g. Kitchen, Press'}),
    defineField({name: 'email', title: 'Email', type: 'string', validation: (r) => r.email()}),
  ],
  preview: {select: {title: 'label', subtitle: 'email'}},
})

export const footerColumn = defineType({
  name: 'footerColumn',
  title: 'Footer column',
  type: 'object',
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'links', title: 'Links', type: 'array', of: [{type: 'link'}]}),
  ],
  preview: {select: {title: 'heading'}},
})

export const heroSlide = defineType({
  name: 'heroSlide',
  title: 'Hero slide',
  type: 'object',
  fields: [
    defineField({
      name: 'video',
      title: 'Video',
      type: 'file',
      options: {accept: 'video/mp4,video/webm'},
      description:
        'MP4 (H.264), muted loop. Keep it under ~5 MB: every visitor downloads it, and it counts towards the CMS bandwidth quota.',
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL (optional)',
      type: 'url',
      description: 'Use instead of an upload for large videos hosted elsewhere.',
    }),
    defineField({
      name: 'poster',
      title: 'Poster image',
      type: 'image',
      description: 'Still frame shown while the video loads, and used by search engines.',
      options: {hotspot: true},
    }),
    defineField({name: 'tag', title: 'Small line above the title', type: 'string', description: 'e.g. — Now Serving · Spot 01 —'}),
    displayText('title', 'Title', {validation: (r) => r.required()}),
    defineField({name: 'client', title: 'Client line', type: 'string', description: 'e.g. For Solano Hot Sauce'}),
    defineField({name: 'role', title: 'Role line', type: 'string', description: 'e.g. Concept, Direction & Edit'}),
  ],
  validation: (r) =>
    r.custom((slide) => (slide?.video || slide?.videoUrl ? true : 'Add a video upload or a video URL')),
  preview: {
    select: {title: 'title', subtitle: 'client', media: 'poster'},
    prepare: ({title, subtitle, media}) => ({title: title?.replace(/\*/g, '').replace(/\n/g, ' '), subtitle, media}),
  },
})

export const objects = [seo, link, contact, footerColumn, heroSlide]
