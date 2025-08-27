import { useLocation } from 'react-router-dom';

/**
 * Global mapping of routes to bucket names
 */
const ROUTE_TO_BUCKET_MAP = {
  '/kif': 'kif',
  '/kuf': 'kuf',
  '/contracts': 'contracts',
  '/transactions': 'transactions', // bank-transactions page
  '/bank-transactions': 'transactions', // Alternative bank-transactions page route
};

/**
 * Hook to get the appropriate bucket name based on the current route
 * @returns {string} The bucket name for the current page
 */
export const useBucketName = () => {
  const location = useLocation();
  return ROUTE_TO_BUCKET_MAP[location.pathname];
};

/**
 * Get bucket name directly from pathname (useful for non-hook contexts)
 * @param {string} pathname - The current pathname
 * @returns {string} The bucket name for the given path
 */
export const getBucketNameFromPath = (pathname) => {
  return ROUTE_TO_BUCKET_MAP[pathname];
};
