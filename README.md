# FormData2Json

This library provides utility functions for transforming FormData to JSON and vice versa. 

## Features

- Convert FormData to a JSON string or a JavaScript object
- Convert a JSON string or a JavaScript object to FormData
- Convert plain objects to FormData
- Convert FormData to plain objects
- Handling nested object structures
- Support for arrays with indexed notation (`[0]`, `[1]`, etc.)
- Support for arrays with empty bracket notation (`[]`)

## Usage

```js
import { formDataToJson, jsonToFormData } from "formdata2json";

const formData = new FormData();
formData.append("user.name", "Alice");
formData.append("user.age", "30");
formData.append("user.skills[0]", "JavaScript");
formData.append("user.skills[1]", "TypeScript");

const jsonString = formDataToJson(formData);
/* Output:
{ 
  "user": {
     "name": "Alice", 
     "age": "30", 
     "skills": ["JavaScript", "TypeScript"] 
   }
 }
*/

const formDataInstance = jsonToFormData(json);
```

### Array Support

The library supports both indexed and empty bracket notation for arrays:

**Indexed notation:**
```js
formData.append("user.skills[0]", "JavaScript");
formData.append("user.skills[1]", "TypeScript");
// Results in: { user: { skills: ["JavaScript", "TypeScript"] } }
```

**Empty bracket notation:**
```js
formData.append("user.skills[]", "JavaScript");
formData.append("user.skills[]", "TypeScript");
// Results in: { user: { skills: ["JavaScript", "TypeScript"] } }
```

Both notations produce the same output, giving developers flexibility in how they structure their form data.


## API
### objectToFormData(object, options): FormData
### jsonToFormData(json, options): FormData
### formDataToObject(formData = new FormData(), options): object
### formDataToJson(formData = new FormData(), options): string
