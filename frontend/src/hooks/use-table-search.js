import { useState, useCallback } from 'react';
import useDebounce from './use-debounce';
/**
 * A custom hook to manage table search state with debouncing.  
 * Resets the page to 1 whenever the search value changes.
 * @param {number} [options.delay=400] - Delay in milliseconds for the debounce timer
 * @param {Function} [options.setPage] - State setter function for pagination to reset current page
 * @param {string} [options.initialValue=''] - The initial search string
 * @returns {Object} { search, debouncedSearch, setSearch, clearSearch }
 * 
 * Example
 * -------
 * ```jsx
 * import useTableSearch from '@/hooks/use-table-search';
 *
 * function MyTable() {
 * const [page, setPage] = useState(1);
 * const { search, debouncedSearch, setSearch, clearSearch } = useTableSearch({
 * delay: 500,
 * setPage,
 * initialValue: ''
 * });
 *
 * // Use debouncedSearch for API calls, search for the input value
 * return (
 * <input value={search} onChange={(e) => setSearch(e.target.value)} />
 * );
 * }
 * ```
 */
export default function useTableSearch({
    delay = 400,
    setPage,
    initialValue = '' } = {}) {
    const [search, setSearchState] = useState(initialValue);
    const debouncedSearch = useDebounce(search, delay);

    const setSearch = useCallback((value) => {
        setSearchState(value);
        if (setPage) {
            setPage(1);
        }
    }, [setPage]);

    const clearSearch = useCallback(() => {
        setSearchState('');
        if (setPage) {
            setPage(1);
        }
    }, [setPage]);

    return {
        search,
        debouncedSearch,
        setSearch,
        clearSearch,
    };
}