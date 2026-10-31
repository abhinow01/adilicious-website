import {objects} from './objects'
import {siteSettings} from './documents/siteSettings'
import {homePage} from './documents/homePage'
import {course} from './documents/course'
import {work} from './documents/work'

/** Documents that exist exactly once. */
export const SINGLETONS = ['siteSettings', 'homePage']

export const schemaTypes = [...objects, siteSettings, homePage, course, work]
