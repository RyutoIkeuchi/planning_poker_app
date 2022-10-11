import { ToLocalStorageUserType } from "src/types";

const toLowerCamelCase = (str: string) => {
  const mappedToString = str.split("_");
  let lowerCamelString = "";
  mappedToString.forEach((el, index) => {
    if (index === 0) {
      lowerCamelString = el;
    } else {
      lowerCamelString += el[0].toUpperCase() + el.substring(1, el.length);
    }
  });
  return lowerCamelString;
};

export const toLowerCamelCaseObj = (obj: any) => {
  const convertObj = {};
  Object.keys(obj).forEach((el) => {
    convertObj[toLowerCamelCase(el)] = obj[el];
  });
  return convertObj as ToLocalStorageUserType;
};
