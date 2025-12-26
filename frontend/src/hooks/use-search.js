import { useEffect, useState } from "react";

/**
 * Keeps local input state for instant typing and
 * syncs changes back to the parent state.
 * 
 * Useful for search / filter inputs where updating
 * parent state on every keystroke would cause lag.
 * 
 * @param {string} value - Controlled value from parent state
 * @param {(value: string) => void} onChange - Callback when value changes
 *
 * Example
 * -------
 * ```jsx
 * const [search, setSearch] = useState("");
 *
 * const searchInput = useSearch(search, (value) => {
 *   setSearch(value);
 *   setPage(1); // optional side-effect
 * });
 *
 * <Input
 *   value={searchInput.value}
 *   onChange={(e) => searchInput.onChange(e.target.value)}
 * />
 * ```
 */
export default function useSearch(value, onChange) {
    const [localValue, setLocalValue] = useState(value);

    // Sync external value → local (e.g. Clear filters)
    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleChange = (nextValue) => {
        setLocalValue(nextValue);
        onChange(nextValue);
    };

    return {
        value: localValue,
        onChange: handleChange,
    };
}
