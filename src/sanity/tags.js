// Cache tags = Sanity document types. The publish webhook sends the `_type` of the changed
// document, and every cached query that depends on that type is refreshed.
export const TAGS = {
  siteSettings: 'siteSettings',
  homePage: 'homePage',
  course: 'course',
  work: 'work',
}

export const ALL_TAGS = new Set(Object.values(TAGS))
