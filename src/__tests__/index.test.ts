import { FIBONACCI_NUMBERS } from "src/utils/constants";
import { toLowerCamelCase, toLowerCamelCaseObj } from "src/libs/index";

describe("Test Libs folder Logic", () => {
  test("Convert Snake case to Lower CamelCase", () => {
    expect(toLowerCamelCase("nextjs_test_library")).toBe("nextjsTestLibrary");
    expect(toLowerCamelCase("nextjs_test_library")).not.toBe("nextjstestlibrary");
    expect(toLowerCamelCase("nextjs_test_library")).not.toBe("NextjsTestLibrary");
  });

  test("Convert Snake Case Object to Lower CamelCase Object", () => {
    const testData = {
      reactjs_test_library: "1",
      vuejs_test_library: "3",
      angularjs_test_library: "4",
    };

    const resultData = {
      reactjsTestLibrary: "1",
      vuejsTestLibrary: "3",
      angularjsTestLibrary: "4",
    };
    expect(toLowerCamelCaseObj(testData)).toStrictEqual(resultData);
  });
});

describe("Test Utils folder Value", () => {
  const resultValue = ["/", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89"];
  test("Generate Fibonacci Number", () => {
    expect(FIBONACCI_NUMBERS).toEqual(resultValue);
  });
});
