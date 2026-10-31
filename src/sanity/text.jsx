import {Fragment} from 'react'

/**
 * Renders the "display text" format used by CMS titles:
 *   - a new line becomes <br/>
 *   - *words in asterisks* become <em> (the italic accent in the design)
 * Produces exactly the markup the components used before the CMS existed.
 */
export function renderDisplayText(value) {
  if (!value) return null
  const lines = String(value).split(/\r?\n/)
  return lines.map((line, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {line.split(/(\*[^*]+\*)/g).map((part, j) =>
        part.startsWith('*') && part.endsWith('*') && part.length > 2 ? (
          <em key={j}>{part.slice(1, -1)}</em>
        ) : (
          part && <Fragment key={j}>{part}</Fragment>
        ),
      )}
    </Fragment>
  ))
}

/** Plain-text version (for alt text, aria-labels and metadata). */
export const plainDisplayText = (value) =>
  value ? String(value).replace(/\*/g, '').replace(/\s*\r?\n\s*/g, ' ').trim() : ''
