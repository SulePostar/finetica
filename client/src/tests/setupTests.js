import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// globalni TextEncoder/TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;


global.import = {
    meta: {
        env: {
            VITE_API_BASE_URL: 'http://localhost:3400/api',
        },
    },
};