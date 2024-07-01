import { FormDataToObjectOptions, NestedObject } from "./types";

export function formDataToObject(
  formData = new FormData(),
  options?: FormDataToObjectOptions
): NestedObject {
  const { parentKey } = options ?? { parentKey: "" };
  const result: any = {};
  const entries = formData.entries();

  for (const [key, value] of entries) {
    const currentKey = parentKey ? `${parentKey}.${key}` : key;
    const chunks = currentKey.split(".");
    let current = result;

    const parsedValue = (() => {
      if (value === "false") return false;
      if (value === "true") return true;
      if (value !== "" && !isNaN(Number(value))) return Number(value);
      return value;
    })();

    const chunksLen = chunks.length;
    for (let chunkIdx = 0; chunkIdx < chunksLen; chunkIdx++) {
      const chunkName = chunks[chunkIdx];
      const isArray = chunkName.endsWith("]");

      if (isArray) {
        const indexStart = chunkName.indexOf("[");
        const indexEnd = chunkName.indexOf("]");

        const arrayIndex = parseInt(
          chunkName.substring(indexStart + 1, indexEnd)
        );

        if (isNaN(arrayIndex)) {
          throw new Error(
            "wrong form data - cannot retrieve array index " + arrayIndex
          );
        }

        const actualChunkName = chunkName.substring(0, indexStart);
        current[actualChunkName] = current[actualChunkName] ?? [];

        if (chunkIdx === chunks.length - 1) {
          current[actualChunkName][arrayIndex] = parsedValue;
        } else {
          current[actualChunkName][arrayIndex] =
            current[actualChunkName][arrayIndex] ?? {};
          current = current[actualChunkName][arrayIndex];
        }
      } else {
        if (chunkIdx === chunks.length - 1) {
          current[chunkName] = parsedValue;
        } else {
          current[chunkName] = current[chunkName] ?? {};
          current = current[chunkName];
        }
      }
    }
  }

  return result;
}
