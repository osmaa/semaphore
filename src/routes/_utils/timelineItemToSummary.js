import { computeFilterContextsForStatusOrNotification } from './computeFilterContextsForStatusOrNotification.js'
import { store } from '../_store/store.js'

class TimelineSummary {
  constructor (item, instanceName) {
    this.id = item.id
    this.accountId = item.account.id
    this.replyId = (item.in_reply_to_id) || undefined
    this.reblogId = (item.reblog && item.reblog.id) || undefined
    this.type = item.type || undefined

    // This indirection level caused me a lot of grief! 
    // Only the fields in this summary are available for sorting.
    // Pinafore's original sort method is by id, explicitly relying on 
    // the id being a k-ordered unique id and thus lexically sortable, 
    // but providing no other reliable indication of relative time between 
    // two items.
    // We will add a bunch of fields to be able to use them in sorting
    if (item.reblog) {
      // use the fields from the boosted content, not its boost
      this.replies_count = item.reblog.replies_count || 0
      this.reblogs_count = item.reblog.reblogs_count || 0
      this.favourites_count = item.reblog.favourites_count || 0
      // TODO: which is better, the boost timestamp, or the post timestamp?
      this.ts = new Date(item.reblog.created_at).getTime()
    } else {
      this.replies_count = item.replies_count || 0
      this.reblogs_count = item.reblogs_count || 0
      this.favourites_count = item.favourites_count || 0
      this.ts = new Date(item.created_at).getTime()
    }

    // This is admittedly a weird place to do the filtering logic. But there are a few reasons to do it here:
    // 1. Avoid computing html-to-text (expensive) for users who don't have any filters (probably most users)
    // 2. Avoiding keeping the entire html-to-text in memory at all times for all summaries
    // 3. Filters probably change infrequently. When they do, we can just update the summaries
    const { unexpiredInstanceFilterRegexes } = store.get()
    const contextsToRegex = unexpiredInstanceFilterRegexes[instanceName]
    this.filterContexts = computeFilterContextsForStatusOrNotification(item, contextsToRegex)
  }
}

export function timelineItemToSummary (item, instanceName) {
  return new TimelineSummary(item, instanceName)
}
