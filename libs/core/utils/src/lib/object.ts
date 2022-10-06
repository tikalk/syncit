export function objectsToArray(object:any) {
  let result:any = [];

  Object.values(object).forEach((value) => {
    if (typeof value === "string") {
      result = [...result, value];
    } else if (typeof value === "object" && !Array.isArray(value) && value !== null) {
      result = [...result, ...objectsToArray(value)];
    }

    return undefined;
  });

  return result;
}
export function objectsToString(object:any) {
  return objectsToArray(object).join(" ");
}
