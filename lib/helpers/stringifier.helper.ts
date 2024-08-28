const stringifier = (val: any): string => {
  if (typeof val === "function" || typeof val === "object") {
    return JSON.stringify(val);
  }

  return val.toString();
};

export default stringifier;
