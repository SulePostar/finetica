/**
 * Generates a where object for filtering data based on time period
 * @param {string} timeFilter - One of: 'all', 'last 7 days', 'last 30 days', 'last 60 days'
 * @param {string} dateField - The name of the date field to filter on (default: 'createdAt')
 * @returns {Object} Where object for database queries
 */

export const getTimeFilterWhereClause = (timeFilter, dateField = 'createdAt') => {
  if (timeFilter === 'all') {
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

  const dateThreshold = new Date(now);
  dateThreshold.setDate(dateThreshold.getDate() - daysAgo);

  return {
    [dateField]: {
      $gte: dateThreshold
    }
  }
}

export const TIME_FILTER_OPTIONS = [
  { label: 'All', value: 'all' },
  { label: 'Last 7 Days', value: 'last 7 days' },
  { label: 'Last 30 Days', value: 'last 30 days' },
  { label: 'Last 60 Days', value: 'last 60 days' },
];