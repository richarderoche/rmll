import {defineMigration, set} from 'sanity/migrate'

/**
 * Backfill navExternal.linkType to "url" when unset or null.
 *
 * Dry run:  npm exec sanity -- migration run set-nav-external-link-type-url
 * Execute:  npm exec sanity -- migration run set-nav-external-link-type-url --no-dry-run --no-confirm
 */
export default defineMigration({
  title: 'Set missing navExternal linkType to url',
  migrate: {
    object(node) {
      if (node?._type !== 'navExternal') return
      if (node.linkType) return
      return set({...node, linkType: 'url'})
    },
  },
})
