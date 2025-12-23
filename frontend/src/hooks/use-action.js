import { useNavigate } from "react-router-dom";

export function useAction(docType) {
    const navigate = useNavigate();

    return (key, item) => {
        if (key === 'view') {
            const path = `/${docType}/${item.id}`;
            navigate(path);;
        }
    }
}