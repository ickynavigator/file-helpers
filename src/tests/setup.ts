import getMockedFile from './mocks/file';

global.File = getMockedFile();
global.URL.createObjectURL = vi.fn(() => 'VALID URL');
