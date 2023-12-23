export const allPropertiesTruthy = (obj) => Object.values(obj).every(value => value);

export function isEveryPropertyTruthy(value) {
  if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value)) {
      // Iterate through each object in the array
      for (const item of value) {
        if (!isEveryPropertyTruthy(item)) {
          return false;
        }
      }
    } else {
      // Recursively check nested objects
      for (const key in value) {
        if (!isEveryPropertyTruthy(value[key])) {
          return false;
        }
      }
    }
  } else if (!value) {
    // Non-truthy value found
    return false;
  }
  return true;
}

export const buttonClasses = (disabled) => {
  return "hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none" + (disabled ? " opacity-50 cursor-not-allowed" : "");
};
