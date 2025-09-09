import { TextEncoder, TextDecoder } from "util";
import "@testing-library/jest-dom";

// Polyfill TextEncoder/TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Vite env variables
global.import = global.import || {};
global.import.meta = global.import.meta || {};
global.import.meta.env = {
    VITE_API_BASE_URL: "http://localhost:4000/api"
};

