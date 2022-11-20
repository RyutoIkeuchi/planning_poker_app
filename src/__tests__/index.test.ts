import { FIBONACCI_NUMBERS } from "src/utils/constants";
import { toLowerCamelCase, toLowerCamelCaseObj } from "src/libs/index";

describe("Test Libs Folder Logic", () => {
  test("スネークケースをローワーキャメルケースに変換してくれること", () => {
    expect(toLowerCamelCase("nextjs_test_library")).toBe("nextjsTestLibrary");
    expect(toLowerCamelCase("nextjs_test_library")).not.toBe("nextjstestlibrary");
    expect(toLowerCamelCase("nextjs_test_library")).not.toBe("NextjsTestLibrary");
  });

  test("keyがスネークケースのObjをローワーキャメルケースに変換してくれること", () => {
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

describe("Test Utils Folder Logic", () => {
  const resultValue = ["/", "1", "2", "3", "5", "8", "13", "21", "34", "55", "89"];
  test("フィボナッチ数列を生成してくれること", () => {
    expect(FIBONACCI_NUMBERS).toEqual(resultValue);
  });
});
