import { toLowerCamelCase, toLowerCamelCaseObj } from "../libs/index";

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
