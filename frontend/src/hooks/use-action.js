// hooks/use-action.js
import { useNavigate } from "react-router-dom";

export function useAction(docType) { // Add docType parameter
    const navigate = useNavigate();

    return (key, item) => {
        if (key === 'view') {
            const path = `/${docType}/${item.id}`;
            navigate(path);;
        }
    }
}