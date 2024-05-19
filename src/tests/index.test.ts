import {
  handleFileUploader,
  convertFileToBlob,
  convertBlobToBase64String,
  BlobToBase64Error,
} from '../toBase64';
import {
  convertBase64StringToBlob,
  getBlobAsSrc,
  getBase64DataAsURL,
} from '../toBlob';

describe('To Base64', () => {
  const fileContent = 'This is the content of the file.';
  const encodedFileContent = Buffer.from(fileContent).toString('base64');

  const validFile = new File([fileContent], 'file.txt', { type: 'text/plain' });
  const invalidFile = 'INVALID FILE' as unknown as File;

  it('should convert a blob with text to a base64 string', async () => {
    const blobWithText = new Blob([fileContent]);
    const base64StringFromText = await convertBlobToBase64String(blobWithText);

    expect(base64StringFromText).toEqual(encodedFileContent);
  });
  it('should throw if reader rejects while converting to a base64 string', async () => {
    class MockErrorFileReader extends FileReader {
      readAsDataURL() {
        const event = new ProgressEvent('onabort') as ProgressEvent<FileReader>;
        this.onerror?.(event);
      }
    }

    vi.stubGlobal('FileReader', MockErrorFileReader);

    const blobWithArrayBuffer = new Blob([new ArrayBuffer(0)]);

    await expect(
      convertBlobToBase64String(blobWithArrayBuffer),
    ).rejects.toThrow(BlobToBase64Error.message);

    vi.unstubAllGlobals();
  });
  it('should convert a file to a blob', async () => {
    const blob = await convertFileToBlob(validFile);

    expect(blob).toBeInstanceOf(Blob);
  });
  it('should call the upload action', async () => {
    const uploadAction = vi.fn();

    const fileUploader = handleFileUploader(uploadAction);
    await fileUploader(validFile);

    expect(uploadAction).toHaveBeenCalledTimes(1);
  });
  it('should call the error callback of the file uploader', async () => {
    const uploadAction = vi.fn();
    const errorCB = vi.fn();

    const fileUploader = handleFileUploader(uploadAction, errorCB);

    await fileUploader(invalidFile);

    expect(errorCB).toHaveBeenCalledTimes(1);
  });
  it('should not call the uploadAction or the error callback at all if the file is null', async () => {
    const uploadAction = vi.fn();
    const errorCB = vi.fn();

    const fileUploader = handleFileUploader(uploadAction, errorCB);

    await fileUploader(null);

    expect(uploadAction).not.toHaveBeenCalled();
    expect(errorCB).not.toHaveBeenCalled();
  });
});

describe('To Blob', () => {
  const decodedString = 'blob this text';
  const encodedString = Buffer.from(decodedString).toString('base64');
  const invalidEncodedString = 'A';

  it('should convert a base64 string to a blob', async () => {
    const blob = convertBase64StringToBlob(encodedString);
    expect(blob).toBeInstanceOf(Blob);

    const result = new Promise(resolve => {
      const reader = new FileReader();
      reader.readAsText(blob);
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
    expect(await result).toBe(decodedString);
  });
  it('should create an object url for a blob file', () => {
    const blob = new Blob(['This is the content of the file.'], {
      type: 'text/plain',
    });

    const url = getBlobAsSrc(blob);

    expect(url).toBe('VALID URL');
  });
  it('should return an empty string and throw the error callback if null is passed', () => {
    const base64Data = null;
    const errorCB = vi.fn();

    const url = getBase64DataAsURL(base64Data, errorCB);

    expect(errorCB).toHaveBeenCalled();
    expect(url).toBe('');
  });
  it('should return an empty string and throw the error callback if an invalid base64 string is passed', () => {
    const errorCB = vi.fn(err => {
      expect(err).toBeInstanceOf(Error);
      expect(err.name).toBe('InvalidCharacterError');
    });

    const url = getBase64DataAsURL(invalidEncodedString, errorCB);

    expect(errorCB).toHaveBeenCalled();
    expect(url).toBe('');
  });
  it('should return a valid url if a valid base64 string is passed', () => {
    const errorCB = vi.fn();

    const url = getBase64DataAsURL(encodedString, errorCB);

    expect(errorCB).not.toHaveBeenCalled();
    expect(url).toBe('VALID URL');
  });
});
