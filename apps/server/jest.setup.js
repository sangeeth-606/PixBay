// Setup file for Jest
// This can be used to add global configs, mocks, etc.

// If you need to handle ESM modules in Jest
import { TextDecoder, TextEncoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
