[![codecov](https://codecov.io/gh/ickynavigator/file-helpers/graph/badge.svg?token=T3C3PSOFE2)](https://codecov.io/gh/ickynavigator/file-helpers)

# file-helpers

This is a simple project that demonstrates how to handle files in the browser. It has helpers for converting the file from base 64 to a blob and vice versa.

- [To Blob](./src/ToBlob.ts) - Converts a base64 string to a blob. (also has a helper function to convert a base64 string to a blob URL so you can display the image in the browser);
- [To Base64](./src/ToBase64.ts) - Converts a blob to a base64 string.

To install dependencies:

```bash
bun install
```

To test:

```bash
bun run test
```

This project was created using `bun init` in bun v1.1.8. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Coverage

- [Istanbul](https://ickynavigator.github.io/file-helpers/index.html)
