import { useEffect, useRef, useState } from 'react';
import api from '../../services/api';

const TYPE_TO_PATH = {
    1: "transactions",
    2: "kif",
    3: "kuf",
    4: "contracts",
};

export const useInvalidPdfDocument = (id, type) => {
    const [doc, setDoc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const reqSeqRef = useRef(0);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);

    useEffect(() => {
        if (!id || !type) return;

        const load = async () => {
            const mySeq = ++reqSeqRef.current;
            setLoading(true);
            try {
                const base = TYPE_TO_PATH[type];
                if (!base) throw new Error(`Unknown document type: ${type}`);

                const { data } = await api.get(`/${base}/logs/${encodeURIComponent(id)}`);

                if (mountedRef.current && mySeq === reqSeqRef.current) {
                    setDoc(data);
                    setError(null);
                }
            } catch (err) {
                if (mountedRef.current && mySeq === reqSeqRef.current) {
                    console.error(err);
                    setDoc(null);
                    setError(err);
                }
            } finally {
                if (mountedRef.current && mySeq === reqSeqRef.current) {
                    setLoading(false);
                }
            }
        };

        load();
    }, [id, type]);

    return { doc, loading, error, setDoc };
};