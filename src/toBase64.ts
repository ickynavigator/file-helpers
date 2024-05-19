export const BlobToBase64Error = new Error(
  'Failed to convert blob to base64 string',
);

export const convertBlobToBase64String = async (blob: Blob) => {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result;

      /* `reader.readAsDataURL` will only give us a string so we do not need to account for `null` and `ArrayBuffer` */
      /* istanbul ignore else -- @preserve */
      if (typeof result === 'string') {
        resolve(result.split(',')[1]);
        return;
      }
    };

    reader.onerror = () => reject(BlobToBase64Error);

    reader.readAsDataURL(blob);
  });
};

export const convertFileToBlob = async (file: File) => {
  const data = await file.arrayBuffer();
  return new Blob([data]);
};

export const handleFileUploader = (
  uploadAction: (val: string) => void,
  errorCB?: () => void,
) => {
  return async (file: File | null) => {
    try {
      if (file == null) return;

      const blob = await convertFileToBlob(file);
      const base64String = await convertBlobToBase64String(blob);

      uploadAction(base64String);
    } catch {
      errorCB?.();
    }
  };
};
