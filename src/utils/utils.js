/* eslint-disable prettier/prettier */
export function filterFn(str) {
    
  function filterRec(o) {
    if (o === null) return true;
    
    switch (typeof o) {
      case "string":
        return o.toLowerCase().indexOf(str.toLowerCase()) >= 0;
      case "object":
        if (o instanceof Array) {
          return o.some((e) => filterRec(e));
        } else {
          return Object.entries(o)
          .filter((e) => e[0] !== "id")
          .map((e) => e[1])
          .some((e) => filterRec(e));
        }
      default:
        return false;
    }
  }

    return (obj) => filterRec(obj);
};
