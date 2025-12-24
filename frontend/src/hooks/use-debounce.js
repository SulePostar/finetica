
import { useEffect, useState } from 'react';
/**
 * Debounces a changing value and returns the most recent debounced value
 * after the provided delay.
 *
 * Typical use case: debounce search input so queries don't fire on every keystroke.
 *
 * @param {any} value - Value to debounce (string, number, object, etc.)
 * @param {number} [delay=300] - Delay in milliseconds before `value` is applied
 * @returns {any} - The debounced value
 *
 * Example
 * -------
 * ```jsx
 * import useDebounce from '@/hooks/use-debounce';
 *
 * function SearchComponent() {
 *   const [query, setQuery] = useState('');
 *   const debouncedQuery = useDebounce(query, 400);
 *
 *   useEffect(() => {
 *   }, [debouncedQuery]);
 * }
 * ```
 */
export default function useDebounce(value, delay = 300) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
}
