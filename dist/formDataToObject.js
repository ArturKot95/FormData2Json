"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formDataToObject = formDataToObject;
function formDataToObject(formData = new FormData(), options) {
    var _a, _b, _c;
    const { parentKey } = options !== null && options !== void 0 ? options : { parentKey: "" };
    const result = {};
    const entries = formData.entries();
    // Track array indices for empty bracket notation
    // Format: "path.to.array" -> nextIndex
    const arrayCounters = {};
    for (const [key, value] of entries) {
        const currentKey = parentKey ? `${parentKey}.${key}` : key;
        // Process the key to handle arrays with empty brackets
        const processedKey = processEmptyBrackets(currentKey, arrayCounters);
        // Split and navigate to set the value
        const chunks = processedKey.split(".");
        let current = result;
        const parsedValue = (() => {
            if (value === "false")
                return false;
            if (value === "true")
                return true;
            if (value !== "" && !isNaN(Number(value)))
                return Number(value);
            return value;
        })();
        const chunksLen = chunks.length;
        for (let chunkIdx = 0; chunkIdx < chunksLen; chunkIdx++) {
            const chunkName = chunks[chunkIdx];
            const isArray = chunkName.endsWith("]");
            if (isArray) {
                const indexStart = chunkName.indexOf("[");
                const indexEnd = chunkName.indexOf("]");
                const arrayIndex = parseInt(chunkName.substring(indexStart + 1, indexEnd));
                if (isNaN(arrayIndex)) {
                    throw new Error("wrong form data - cannot retrieve array index " + chunkName.substring(indexStart + 1, indexEnd));
                }
                const actualChunkName = chunkName.substring(0, indexStart);
                current[actualChunkName] = (_a = current[actualChunkName]) !== null && _a !== void 0 ? _a : [];
                if (chunkIdx === chunks.length - 1) {
                    current[actualChunkName][arrayIndex] = parsedValue;
                }
                else {
                    current[actualChunkName][arrayIndex] =
                        (_b = current[actualChunkName][arrayIndex]) !== null && _b !== void 0 ? _b : {};
                    current = current[actualChunkName][arrayIndex];
                }
            }
            else {
                if (chunkIdx === chunks.length - 1) {
                    current[chunkName] = parsedValue;
                }
                else {
                    current[chunkName] = (_c = current[chunkName]) !== null && _c !== void 0 ? _c : {};
                    current = current[chunkName];
                }
            }
        }
    }
    return result;
}
function processEmptyBrackets(key, arrayCounters) {
    const parts = key.split(".");
    const processedParts = [];
    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part.endsWith("[]")) {
            // Handle empty bracket notation
            const arrayName = part.substring(0, part.length - 2);
            // Build the path up to this array
            const pathToArray = processedParts.concat(arrayName).join(".");
            // Get or initialize the counter for this array
            if (arrayCounters[pathToArray] === undefined) {
                arrayCounters[pathToArray] = 0;
            }
            else {
                arrayCounters[pathToArray]++;
            }
            // Replace [] with [index]
            processedParts.push(arrayName + "[" + arrayCounters[pathToArray] + "]");
        }
        else {
            processedParts.push(part);
        }
    }
    return processedParts.join(".");
}
