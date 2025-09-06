import '@testing-library/jest-dom';
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

globalThis.import = {
    meta: {
        env: {
            VITE_API_BASE_URL: 'http://localhost:4000/api',
        },
    },
};


