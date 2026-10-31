import {HomeIcon} from '@sanity/icons/Home'
import {defineArrayMember, defineField, defineType} from 'sanity'
import {displayText} from '../objects'

/**
 * Singleton: the home page.
 * Sections are fixed objects in the same order as the page. This is deliberate: the page is a
 * choreographed scroll sequence (pinning, slide-overs, timings), so editors change the content of
 * each section, not the order of sections.
 */
export const homePage = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'hero', title: 'Hero', default: true},
    {name: 'manifesto', title: 'House rules'},
    {name: 'menu', title: 'Menu (plate)'},
    {name: 'reservation', title: 'Book a table'},
    {name: 'hello', title: 'Say hello'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'Hero',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({
          name: 'slides',
          title: 'Slides',
          type: 'array',
          of: [defineArrayMember({type: 'heroSlide'})],
          validation: (r) => r.min(1).required(),
        }),
        defineField({name: 'reelLabel', title: 'Reel label', type: 'string', description: 'e.g. Reel · 2024–26'}),
      ],
    }),

    defineField({
      name: 'ticker',
      title: 'Ticker words',
      type: 'array',
      group: 'manifesto',
      of: [{type: 'string'}],
      description: 'The scrolling strip of words under the hero.',
    }),
    defineField({
      name: 'manifesto',
      title: 'House rules',
      type: 'object',
      group: 'manifesto',
      fields: [
        defineField({name: 'eyebrow', title: 'Small heading', type: 'string'}),
        defineField({
          name: 'text',
          title: 'Text',
          type: 'text',
          rows: 4,
          description: 'Plain text. Each word lights up as visitors scroll.',
          validation: (r) => r.required(),
        }),
        defineField({name: 'signature', title: 'Signature', type: 'string'}),
      ],
    }),

    defineField({
      name: 'menu',
      title: 'Menu (plate)',
      type: 'object',
      group: 'menu',
      fields: [
        defineField({name: 'eyebrow', title: 'Small heading', type: 'string'}),
        displayText('title', 'Title'),
        defineField({name: 'markerLabel', title: 'Pointer label', type: 'string', description: 'Text above the arrow at the top of the plate.'}),
        defineField({
          name: 'courses',
          title: 'Courses',
          type: 'array',
          description: 'Order = number on the plate (01, 02…). Up to 12 fit around the rim.',
          of: [defineArrayMember({type: 'reference', to: [{type: 'course'}]})],
          validation: (r) => r.min(2).max(12).unique(),
        }),
        defineField({
          name: 'posters',
          title: 'Posters behind the plate',
          type: 'array',
          of: [defineArrayMember({type: 'reference', to: [{type: 'work'}]})],
          validation: (r) => r.unique(),
        }),
      ],
    }),

    defineField({
      name: 'reservation',
      title: 'Book a table',
      type: 'object',
      group: 'reservation',
      fields: [
        defineField({name: 'eyebrow', title: 'Small heading', type: 'string'}),
        displayText('title', 'Title'),
        defineField({name: 'body', title: 'Text', type: 'text', rows: 4}),
        defineField({
          name: 'form',
          title: 'Form text',
          type: 'object',
          options: {collapsible: true, collapsed: true},
          fields: [
            defineField({name: 'nameLabel', title: 'Name label', type: 'string'}),
            defineField({name: 'namePlaceholder', title: 'Name placeholder', type: 'string'}),
            defineField({name: 'emailLabel', title: 'Email label', type: 'string'}),
            defineField({name: 'emailPlaceholder', title: 'Email placeholder', type: 'string'}),
            defineField({name: 'chooseLabel', title: '"Choose" option', type: 'string'}),
            defineField({name: 'budgetLabel', title: 'Budget label', type: 'string'}),
            defineField({name: 'budgetOptions', title: 'Budget options', type: 'array', of: [{type: 'string'}]}),
            defineField({name: 'courseLabel', title: 'Course label', type: 'string'}),
            defineField({name: 'courseOptions', title: 'Course options', type: 'array', of: [{type: 'string'}]}),
            defineField({name: 'briefLabel', title: 'Brief label', type: 'string'}),
            defineField({name: 'briefPlaceholder', title: 'Brief placeholder', type: 'string'}),
            defineField({name: 'submitLabel', title: 'Button', type: 'string'}),
            defineField({name: 'successLabel', title: 'Button after sending', type: 'string'}),
          ],
        }),
      ],
    }),

    defineField({
      name: 'hello',
      title: 'Say hello',
      type: 'object',
      group: 'hello',
      fields: [
        defineField({name: 'smallWords', title: 'Small words', type: 'string', description: 'e.g. come say'}),
        defineField({name: 'bigWord', title: 'Big word', type: 'string', description: 'e.g. hello. Keep it short: each letter animates.'}),
        defineField({name: 'subline', title: 'Line under the big word', type: 'string'}),
        defineField({
          name: 'postcard',
          title: 'Postcard text',
          type: 'object',
          options: {collapsible: true, collapsed: true},
          fields: [
            defineField({name: 'greeting', title: 'Greeting', type: 'string'}),
            defineField({name: 'messagePlaceholder', title: 'Message placeholder', type: 'string'}),
            defineField({name: 'signOff', title: 'Sign-off', type: 'string'}),
            defineField({name: 'namePlaceholder', title: 'Name placeholder', type: 'string'}),
            defineField({name: 'postmarkTop', title: 'Postmark top line', type: 'string'}),
            defineField({name: 'postmarkBottom', title: 'Postmark bottom line', type: 'string'}),
            defineField({name: 'stampText', title: 'Stamp text', type: 'string'}),
            defineField({name: 'toLabel', title: '"To" label', type: 'string'}),
            defineField({name: 'toName', title: 'Addressee', type: 'string'}),
            defineField({name: 'addressLine', title: 'Address line', type: 'string'}),
            defineField({name: 'replyToLabel', title: '"Reply to" label', type: 'string'}),
            defineField({name: 'emailPlaceholder', title: 'Email placeholder', type: 'string'}),
            defineField({name: 'topicLabel', title: '"About" label', type: 'string'}),
            defineField({name: 'topics', title: 'Topics', type: 'array', of: [{type: 'string'}]}),
            defineField({name: 'sendLabel', title: 'Button', type: 'string'}),
            defineField({name: 'sendingLabel', title: 'Button while sending', type: 'string'}),
            defineField({name: 'errorLabel', title: 'Button after an error', type: 'string'}),
          ],
        }),
        defineField({
          name: 'thanks',
          title: 'Thank-you side',
          type: 'object',
          options: {collapsible: true, collapsed: true},
          fields: [
            defineField({name: 'eyebrow', title: 'Small heading', type: 'string'}),
            defineField({name: 'title', title: 'Title', type: 'string', description: 'The sender’s first name is added after it.'}),
            defineField({name: 'text', title: 'Text', type: 'string'}),
            defineField({name: 'againLabel', title: '"Write another" link', type: 'string'}),
          ],
        }),
      ],
    }),

    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Home page'})},
})
