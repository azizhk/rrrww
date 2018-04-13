export default function (oldObj, newObj) {
  // Return a diff between the new and the old object
  const uniqueProps = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
  const changedProps = Array.from(uniqueProps).filter(
    propName => oldObj[propName] !== newObj[propName]
  );

  return changedProps;
}
