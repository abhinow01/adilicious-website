// One-time migration: uploads the original site content and media into Sanity.
//
//   cd studio && npm run seed            # creates only documents that don't exist yet
//   cd studio && npm run seed -- --replace   # overwrites them with the original content
//
// Needs SANITY_STUDIO_PROJECT_ID, SANITY_STUDIO_DATASET and SANITY_WRITE_TOKEN in studio/.env.
// The write token is only used on your machine for this script; never add it to the website.

import {createReadStream} from 'node:fs'
import {basename, dirname, extname, join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {createClient} from '@sanity/client'
import {allDocuments} from './content.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const replace = process.argv.includes('--replace')

const {SANITY_STUDIO_PROJECT_ID: projectId, SANITY_STUDIO_DATASET: dataset = 'production', SANITY_WRITE_TOKEN: token} =
  process.env
if (!projectId || !token) {
  console.error('Set SANITY_STUDIO_PROJECT_ID and SANITY_WRITE_TOKEN in studio/.env first.')
  process.exit(1)
}

const client = createClient({projectId, dataset, token, apiVersion: '2026-10-01', useCdn: false})

const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif'])
const uploaded = new Map()

async function upload(file) {
  if (uploaded.has(file)) return uploaded.get(file)
  const isImage = IMAGE_EXT.has(extname(file).toLowerCase())
  process.stdout.write(`  uploading ${file}… `)
  const doc = await client.assets.upload(isImage ? 'image' : 'file', createReadStream(join(here, 'assets', file)), {
    filename: basename(file),
  })
  console.log('done')
  const value = {kind: isImage ? 'image' : 'file', id: doc._id}
  uploaded.set(file, value)
  return value
}

// Replace every asset('…') marker with a real Sanity image/file reference.
async function resolveAssets(value) {
  if (Array.isArray(value)) return Promise.all(value.map(resolveAssets))
  if (!value || typeof value !== 'object') return value
  if (value.__asset) {
    const {__asset, ...extra} = value
    const {kind, id} = await upload(__asset)
    return {_type: kind, asset: {_type: 'reference', _ref: id}, ...extra}
  }
  const out = {}
  for (const [k, v] of Object.entries(value)) out[k] = await resolveAssets(v)
  return out
}

console.log(`Seeding ${projectId}/${dataset} (${replace ? 'replace' : 'create missing only'})`)
const docs = await resolveAssets(allDocuments)
const tx = client.transaction()
for (const doc of docs) (replace ? tx.createOrReplace(doc) : tx.createIfNotExists(doc))
const result = await tx.commit({visibility: 'sync'})
console.log(`Done: ${result.results.length} documents written.`)
