/**
 * Generates a where object for filtering data based on time period
 * @param {string} timeFilter - One of: 'all', 'last 7 days', 'last 30 days', 'last 60 days'
 * @param {string} dateField - The name of the date field to filter on (default: 'createdAt')
 * @returns {Object} Where object for database queries
 */

export const getTimeFilterWhereClause = (timeFilter, dateField = 'createdAt') => {
  // Support 'all' and empty filter
  if (timeFilter === 'all' || !timeFilter) {
    return {};
  }

  // Support custom object: { from: Date, to: Date }
  if (typeof timeFilter === 'object' && timeFilter !== null) {
    const { from, to } = timeFilter;

    if (from && to) {
      return {
        [dateField]: {
          $gte: new Date(from),
          $lte: new Date(to)
        }
      };
    }

    return {};
  }

  const now = new Date();
  let daysAgo;

  switch (timeFilter) {
    case 'last 7 days':
      daysAgo = 7;
      break;
    case 'last 30 days':
      daysAgo = 30;
      break;
    case 'last 60 days':
      daysAgo = 60;
      break;
    default:
      return {};
  }

  const fromDate = new Date(now);
  fromDate.setDate(fromDate.getDate() - daysAgo);

  const toDate = now;

  return {
    [dateField]: {
      $gte: fromDate,
      $lte: toDate
    }
  };
}

export const TIME_FILTER_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Last 7 Days', value: 'last 7 days' },
  { label: 'Last 30 Days', value: 'last 30 days' },
  { label: 'Last 60 Days', value: 'last 60 days' },
];