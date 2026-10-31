import {ImagesIcon} from '@sanity/icons/Images'
import {defineField, defineType} from 'sanity'

/**
 * A piece of work for a client. Today it powers the posters behind the plate.
 * The "Case study" group is ready for future case-study pages (/work/<slug>).
 */
export const work = defineType({
  name: 'work',
  title: 'Work / client',
  type: 'document',
  icon: ImagesIcon,
  groups: [
    {name: 'poster', title: 'Poster', default: true},
    {name: 'caseStudy', title: 'Case study (future page)'},
  ],
  fields: [
    defineField({name: 'client', title: 'Client name', type: 'string', group: 'poster', validation: (r) => r.required()}),
    defineField({name: 'title', title: 'Campaign title', type: 'string', group: ['poster', 'caseStudy']}),
    defineField({
      name: 'posterImage',
      title: 'Poster image',
      type: 'image',
      group: 'poster',
      options: {hotspot: true},
      description: 'Landscape, roughly 8:5. If empty, the colour artwork below is used.',
      fields: [defineField({name: 'alt', title: 'Alternative text', type: 'string'})],
    }),
    defineField({
      name: 'posterArt',
      title: 'Poster colour artwork',
      type: 'string',
      group: 'poster',
      description: 'A CSS gradient used when there is no poster image. Ask a developer before changing.',
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'caseStudy',
      options: {source: (doc) => [doc.client, doc.title].filter(Boolean).join(' '), maxLength: 80},
    }),
    defineField({name: 'summary', title: 'Summary', type: 'text', rows: 3, group: 'caseStudy'}),
    defineField({name: 'services', title: 'Courses served', type: 'array', group: 'caseStudy', of: [{type: 'reference', to: [{type: 'course'}]}]}),
    defineField({name: 'year', title: 'Year', type: 'number', group: 'caseStudy'}),
    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'caseStudy'}),
  ],
  preview: {select: {title: 'client', subtitle: 'title', media: 'posterImage'}},
})
