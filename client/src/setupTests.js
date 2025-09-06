// Mock import.meta.env da testovi koji koriste Vite varijable rade
Object.defineProperty(import.meta, 'env', {
    value: {
        VITE_API_BASE_URL: 'http://localhost:4000/api',
        // dodaj ovdje ostale VITE_ varijable koje koristiš
    },
});
