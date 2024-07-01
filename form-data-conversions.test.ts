import { expect, describe, test } from "vitest";
import { formDataToObject } from "./dist/formDataToObject";
import { objectToFormData } from "./dist/objectToFormData";
import { NestedObject } from "./dist/types";

describe("FormData Conversion", () => {
  test("formDataToObject", () => {
    const formData = new FormData();
    formData.append("user.name", "Alice");
    formData.append("user.age", "30");
    formData.append("user.skills[0]", "JavaScript");
    formData.append("user.skills[1]", "TypeScript");

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

  test("objectToFormData", () => {
    const input: NestedObject = {
      user: {
        name: "Alice",
        age: "30",
        skills: ["JavaScript", "TypeScript"],
      },
    };

    const expectedEntries = [
      ["user.name", "Alice"],
      ["user.age", "30"],
      ["user.skills[0]", "JavaScript"],
      ["user.skills[1]", "TypeScript"],
    ];

    const formData = objectToFormData(input);
    const formDataEntries = Array.from(formData.entries());

    expect(formDataEntries).toEqual(expectedEntries);
  });
});
