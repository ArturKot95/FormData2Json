import { expect, describe, test } from "vitest";
import { formDataToObject } from "./src/formDataToObject";
import { objectToFormData } from "./src/objectToFormData";
import { NestedObject } from "./dist/types";

describe("FormData Conversion", () => {
  test("formDataToObject", () => {
    const formData = new FormData();
    formData.append("user.name", "Alice");
    formData.append("user.age", "30");
    formData.append("user.emptyString", "");
    formData.append("user.skills[0]", "JavaScript");
    formData.append("user.skills[1]", "TypeScript");

    const expected: NestedObject = {
      user: {
        age: 30,
        name: "Alice",
        emptyString: "",
        skills: ["JavaScript", "TypeScript"],
      },
    };

    const result = formDataToObject(formData);

    expect(result).toEqual(expected);
  });

  test("formDataToObject with empty bracket notation", () => {
    const formData = new FormData();
    formData.append("user.name", "Alice");
    formData.append("user.age", "30");
    formData.append("user.skills[]", "JavaScript");
    formData.append("user.skills[]", "TypeScript");

    const expected: NestedObject = {
      user: {
        age: 30,
        name: "Alice",
        skills: ["JavaScript", "TypeScript"],
      },
    };

    const result = formDataToObject(formData);

    expect(result).toEqual(expected);
  });

  test("formDataToObject with mixed bracket notation", () => {
    const formData = new FormData();
    formData.append("user.name", "Alice");
    formData.append("user.skills[]", "JavaScript");
    formData.append("user.skills[]", "TypeScript");
    formData.append("user.hobbies[0]", "Reading");
    formData.append("user.hobbies[1]", "Gaming");

    const expected: NestedObject = {
      user: {
        name: "Alice",
        skills: ["JavaScript", "TypeScript"],
        hobbies: ["Reading", "Gaming"],
      },
    };

    const result = formDataToObject(formData);

    expect(result).toEqual(expected);
  });

  test("formDataToObject with nested arrays using empty brackets", () => {
    const formData = new FormData();
    formData.append("users[].name", "Alice");
    formData.append("users[].name", "Bob");

    const expected: NestedObject = {
      users: [
        {
          name: "Alice",
        },
        {
          name: "Bob",
        },
      ],
    };

    const result = formDataToObject(formData);

    expect(result).toEqual(expected);
  });

  test("formDataToObject with empty arrays and deep nesting", () => {
    const formData = new FormData();
    formData.append("data.items[].tags[]", "tag1");
    formData.append("data.items[].tags[]", "tag2");
    formData.append("data.items[].tags[]", "tag3");

    const expected: NestedObject = {
      data: {
        items: [
          {
            tags: ["tag1"],
          },
          {
            tags: ["tag2"],
          },
          {
            tags: ["tag3"],
          },
        ],
      },
    };

    const result = formDataToObject(formData);

    expect(result).toEqual(expected);
  });

  test("objectToFormData", () => {
    const input: NestedObject = {
      user: {
        name: "Alice",
        age: 30,
        emptyString: "",
        skills: ["JavaScript", "TypeScript"],
      },
    };

    const expectedEntries = [
      ["user.name", "Alice"],
      ["user.age", "30"],
      ["user.emptyString", ""],
      ["user.skills[0]", "JavaScript"],
      ["user.skills[1]", "TypeScript"],
    ];

    const formData = objectToFormData(input);
    const formDataEntries = Array.from(formData.entries());

    expect(formDataEntries).toEqual(expectedEntries);
  });
});
