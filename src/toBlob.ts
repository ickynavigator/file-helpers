export const convertBase64StringToBlob = (data: string) => {
  const sliceSize = 1024;
  const byteCharacters = window.atob(data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Uint8Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays);
};

export const getBlobAsSrc = (data: Blob) => {
  return window.URL.createObjectURL(data);
};

export const getBase64DataAsURL = (
  base64Data: string | null,
  errorCB?: (err: unknown) => void,
) => {
  try {
    if (base64Data === null) throw new Error('Empty base64 string');

    const blob = convertBase64StringToBlob(base64Data);
    return getBlobAsSrc(blob);
  } catch (err: unknown) {
    errorCB?.(err);
    return '';
  }
};
