// replacement sorting method for timeline items
// instead of the reverse-by-timestamp default method,
// the sort will prefer, by considering along with age:
//  posts with replies (x10 weight)
//  posts with boosts (reblogs) (x2 weight)
//  posts with favourites
// the boost value of engagement counts does not increase
// linearly as the counts grow, so a logarithmic factor is
// applied

import { compareTimelineItemSummaries as compareSummariesById } from './statusIdSorting.js'

export function calculateScoreForSorting(summaryItem) {
  // boosts don't get extra, only original posts do
  const score = summaryItem.reblogId ? 0 :
    Math.log2( 1 + // logaritmic boost factor reduction
      summaryItem.replies_count * 10 +
      summaryItem.reblogs_count * 2 +
      summaryItem.favourites_count
    )
  // add one minute for each score point
  return score * 60000
}

export function compareTimelineItemSummaries (left, right) {
  // compatibility fallback
  if (!left.ts || !right.ts)
    return compareSummariesById(left, right)

  const leftAdjusted = left.ts + calculateScoreForSorting(left)
  const rightAdjusted = right.ts + calculateScoreForSorting(right)

  return leftAdjusted < rightAdjusted ? -1 : leftAdjusted === rightAdjusted ? 0 : 1
}
