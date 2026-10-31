import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {defineField, defineType} from 'sanity'

/**
 * A "course" on the menu = one service the agency offers.
 * The number shown on the plate comes from its position in Home page → Menu → Courses.
 * The slug and SEO fields are ready for future service pages (/menu/<slug>).
 */
export const course = defineType({
  name: 'course',
  title: 'Menu course (service)',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({name: 'name', title: 'Course name', type: 'string', description: 'e.g. Appetizers', validation: (r) => r.required()}),
    defineField({name: 'label', title: 'Service', type: 'string', description: 'e.g. Brand Discovery', validation: (r) => r.required()}),
    defineField({name: 'description', title: 'Short description', type: 'string', description: 'e.g. Strategy / Research / Positioning'}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Only needed once service pages exist.',
      options: {source: 'label', maxLength: 64},
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {select: {title: 'name', subtitle: 'label'}},
})
