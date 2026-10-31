import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {defineLocations, presentationTool} from 'sanity/presentation'
import {CogIcon} from '@sanity/icons/Cog'
import {HomeIcon} from '@sanity/icons/Home'
import {schemaTypes, SINGLETONS} from './schemas'

const previewOrigin = process.env.SANITY_STUDIO_PREVIEW_ORIGIN || 'http://localhost:3000'

const homeLocation = {locations: [{title: 'Home page', href: '/'}]}

export default defineConfig({
  name: 'default',
  title: 'Adilicious',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem().title('Home page').icon(HomeIcon).child(S.document().schemaType('homePage').documentId('homePage')),
            S.listItem().title('Site settings').icon(CogIcon).child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.documentTypeListItem('course').title('Menu courses'),
            S.documentTypeListItem('work').title('Work / clients'),
          ]),
    }),
    // Side-by-side preview of drafts on the real website (uses /api/draft-mode/enable).
    presentationTool({
      previewUrl: {
        initial: previewOrigin,
        previewMode: {enable: '/api/draft-mode/enable', disable: '/api/draft-mode/disable'},
      },
      allowOrigins: [previewOrigin],
      resolve: {
        mainDocuments: [{route: '/', type: 'homePage'}],
        locations: {
          homePage: defineLocations(homeLocation),
          siteSettings: defineLocations(homeLocation),
          course: defineLocations(homeLocation),
          work: defineLocations(homeLocation),
        },
      },
    }),
  ],

  schema: {
    types: schemaTypes,
    // Singletons can't be created from the "+ New" menu.
    templates: (templates) => templates.filter(({schemaType}) => !SINGLETONS.includes(schemaType)),
  },

  document: {
    // Singletons can't be duplicated, deleted or unpublished by accident.
    actions: (actions, {schemaType}) =>
      SINGLETONS.includes(schemaType)
        ? actions.filter(({action}) => ['publish', 'discardChanges', 'restore'].includes(action))
        : actions,
    newDocumentOptions: (prev, {creationContext}) =>
      creationContext.type === 'global' ? prev.filter((t) => !SINGLETONS.includes(t.templateId)) : prev,
  },
})
