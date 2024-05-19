import { JSDOM } from 'jsdom';

function getMockedFile() {
  const MockedFile = class extends new JSDOM().window.File {
    chunks: BlobPart[];
    filename: string;
    type: string;

    constructor(
      chunks: BlobPart[],
      filename: string,
      options: FilePropertyBag = {},
    ) {
      super(chunks, filename, options);
      this.chunks = chunks;
      this.filename = filename;
      this.type = options.type || '';
    }

    async arrayBuffer() {
      const text = this.chunks.join('');
      const buffer = new ArrayBuffer(text.length);
      const view = new Uint8Array(buffer);
      for (let i = 0; i < text.length; i++) {
        view[i] = text.charCodeAt(i);
      }
      return buffer;
    }
  };

  return MockedFile;
}

global.File = getMockedFile();
global.URL.createObjectURL = vi.fn(() => 'VALID URL');
