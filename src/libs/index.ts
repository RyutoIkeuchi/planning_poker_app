import { ToLocalStorageUserType } from "src/types";

export const toLowerCamelCase = (str: string) => {
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

// Todo:anyを変えたい
// Todo:違う方法でobjectを生成させたい
export const toLowerCamelCaseObj = (obj: any):any => {
  const convertObj = {};
  Object.keys(obj).forEach((el) => {
    convertObj[toLowerCamelCase(el)] = obj[el];
  });
  return convertObj;
};
