import { useLocation } from 'react-router-dom';

/**
 * Hook to get the appropriate bucket name based on the current route
 * @returns {string} The bucket name for the current page
 */
export const useBucketName = () => {
  const location = useLocation();

  // Map routes to bucket names
  const routeToBucketMap = {
    '/kif': 'kif',
    '/kuf': 'kuf',
    '/transactions': 'transactions', // VAT page
    '/vat': 'transactions', // Alternative VAT page route
  };

  // Return the bucket name based on current route
  return routeToBucketMap[location.pathname];
};

/**
 * Get bucket name directly from pathname (useful for non-hook contexts)
 * @param {string} pathname - The current pathname
 * @returns {string} The bucket name for the given path
 */
export const getBucketNameFromPath = (pathname) => {
  const routeToBucketMap = {
    '/kif': 'kif',
    '/kuf': 'kuf',
    '/transactions': 'transactions',
    '/vat': 'transactions',
  };

  return routeToBucketMap[pathname];
};
