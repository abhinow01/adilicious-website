import {CogIcon} from '@sanity/icons/Cog'
import {defineField, defineType} from 'sanity'

/** Singleton: site-wide defaults used on every page (SEO, organisation, contacts, footer). */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'general', title: 'General', default: true},
    {name: 'seo', title: 'SEO defaults'},
    {name: 'organization', title: 'Organisation'},
    {name: 'footer', title: 'Footer'},
  ],
  fields: [
    defineField({name: 'siteName', title: 'Site name', type: 'string', group: 'general', validation: (r) => r.required()}),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      group: 'general',
      description: 'One line describing the agency. Used as the main page heading for search engines.',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'contacts',
      title: 'Contact emails',
      type: 'array',
      group: 'general',
      of: [{type: 'contact'}],
      description: 'Shown in the reservation section and the footer.',
    }),

    defineField({
      name: 'seo',
      title: 'Default SEO',
      type: 'seo',
      group: 'seo',
      options: {collapsible: false},
      description: 'Used by every page unless the page sets its own.',
      validation: (r) =>
        r.custom((seo) => (seo?.title && seo?.description ? true : 'A default title and description are required')),
    }),

    defineField({
      name: 'organization',
      title: 'Organisation details',
      type: 'object',
      group: 'organization',
      description: 'Used for structured data so search engines understand who you are. Only fill in real details.',
      fields: [
        defineField({name: 'legalName', title: 'Legal name', type: 'string'}),
        defineField({
          name: 'logo',
          title: 'Logo',
          type: 'image',
          description: 'Square logo on a solid background, at least 112 × 112 px.',
          fields: [defineField({name: 'alt', title: 'Alternative text', type: 'string'})],
        }),
        defineField({name: 'email', title: 'Main email', type: 'string', validation: (r) => r.email()}),
        defineField({name: 'telephone', title: 'Phone', type: 'string'}),
        defineField({name: 'locality', title: 'City', type: 'string'}),
        defineField({name: 'postalCode', title: 'Postal code', type: 'string'}),
        defineField({name: 'country', title: 'Country code', type: 'string', description: 'Two letters, e.g. IN'}),
        defineField({
          name: 'sameAs',
          title: 'Social profiles',
          type: 'array',
          of: [{type: 'url'}],
          description: 'Full URLs of your Instagram, LinkedIn, Vimeo… profiles.',
        }),
      ],
    }),

    defineField({
      name: 'footer',
      title: 'Footer',
      type: 'object',
      group: 'footer',
      fields: [
        defineField({name: 'tagline', title: 'Tagline', type: 'text', rows: 2}),
        defineField({name: 'columns', title: 'Link columns', type: 'array', of: [{type: 'footerColumn'}]}),
        defineField({name: 'copyright', title: 'Copyright line', type: 'string'}),
        defineField({name: 'signoff', title: 'Sign-off', type: 'string'}),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})
