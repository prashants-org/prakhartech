import "@testing-library/jest-dom/vitest";

window.scrollTo = () => {};
Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
