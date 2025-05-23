import { mockDeep, mockReset } from 'jest-mock-extended';

const prismaMock = mockDeep();

jest.mock('../../db.js', () => ({
  __esModule: true,
  default: prismaMock,
}));

beforeEach(() => {
  mockReset(prismaMock);
});

export default prismaMock;
