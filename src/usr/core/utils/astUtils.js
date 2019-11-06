// Executes visitor on the object and its children (recursively).
export function traverse(object, visitor) {

  visitor(object);

  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      let child = object[key];
      if (typeof child === 'object' && child !== null) {
        traverse(child, visitor);
      }
    }
  }
}

export function traverseWithResult(object, visitor, result) {

  let _result = visitor(object, result);

  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      let child = object[key];
      if (typeof child === 'object' && child !== null) {
        traverseWithResult(child, visitor, _result);
      }
    }
  }
}
