import {
  convertBase64StringToBlob,
  getBlobAsSrc,
  getBase64DataAsURL,
} from './toBlob';

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
