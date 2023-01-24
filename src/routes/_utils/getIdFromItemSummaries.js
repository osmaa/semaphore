export function getFirstIdFromItemSummaries (itemSummaries) {
  // item summaries used to be sorted with largest-value-first
  // so look for the largest value
  return itemSummaries &&
    itemSummaries.reduce( (first, item) =>
    first > item.id ? first : item.id, undefined )
  /*
    itemSummaries[0] &&
    itemSummaries[0].id
  */
}

export function getLastIdFromItemSummaries (itemSummaries) {
  // item summaries used to be sorted with largest-value-first
  // so look for the smallest value
  return itemSummaries &&
    itemSummaries.reduce( (last, item) =>
    last < item.id ? last : item.id, undefined )
/*
    itemSummaries[itemSummaries.length - 1] &&
    itemSummaries[itemSummaries.length - 1].id
  */
}
