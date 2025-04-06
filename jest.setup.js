// Import fetch polyfill
import 'whatwg-fetch';

// Add any custom jest matchers
import '@testing-library/jest-dom';

// Mock Firebase modules
jest.mock('firebase/app', () => {
  return {
    initializeApp: jest.fn(),
    getApps: jest.fn(() => []),
    getApp: jest.fn(),
  };
});

jest.mock('firebase/functions', () => {
  return {
    getFunctions: jest.fn(() => ({})),
    httpsCallable: jest.fn(),
  };
});

// Add mock for firebase/storage
jest.mock('firebase/storage', () => {
  return {
    getStorage: jest.fn(() => ({})),
    ref: jest.fn(() => ({})),
    uploadBytesResumable: jest.fn(),
    getDownloadURL: jest.fn(),
  };
});

global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
  }),
  usePathname: () => '/',
}));

// Mock for IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {
    return null;
  }
  observe() {
    return null;
  }
  takeRecords() {
    return null;
  }
  unobserve() {
    return null;
  }
}; 