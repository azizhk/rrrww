import uuidv4 from 'uuid/v4'

export function createElement(type) {
  return {
    type: type,
    key: uuidv4(),
    props: null,
    children: new Map(),
    firstKey: null,
    lastKey: null,
    prevKey: null,
    nextKey: null
  }
}

export function markSent (element) {
  if (!element.sent) {
    Object.defineProperty(element, 'sent', {
      value: true
    })
    // TODO:Aziz Reduce Call Stack
    element.children.forEach((child) => {
      markSent(child)
    })
  }
}

export function appendChild (parent, child) {
  if (parent.children.get(child.key)) {
    removeChild(parent, child)
  }
  parent.children.set(child.key, child)
  if (!parent.firstKey) {
    // first child
    parent.firstKey = parent.lastKey = child.key
  } else {
    // children already existed
    child.prevKey = parent.lastKey
    const oldLastChild = parent.children.get(parent.lastKey)
    oldLastChild.nextKey = parent.lastKey = child.key
  }
}

export function insertBefore (parent, child, nextSibling) {
  if (parent.children.get(child.key)) {
    removeChild(parent, child)
  }
  parent.children.set(child.key, child)
  const prevSibling = parent.children.get(nextSibling.prevKey)
  child.nextKey = nextSibling.key
  nextSibling.prevKey = child.key
  child.prevKey = nextSibling.prevKey
  if (prevSibling) {
    // added as first child, prepended
    prevSibling.nextKey = child.key
  } else {
    // added in between
    parent.firstKey = child.key
  }
}

export function removeChild (parent, child) {
  const prevSibling = parent.children.get(child.prevKey)
  const nextSibling = parent.children.get(child.nextKey)
  if (prevSibling && nextSibling) {
    // middle element
    prevSibling.nextKey = nextSibling.key
    nextSibling.prevKey = prevSibling.key
  } else if (prevSibling) {
    // last element
    prevSibling.nextKey = null
    parent.lastKey = prevSibling.key
  } else if (nextSibling) {
    // first element
    parent.firstKey = nextSibling.key
    nextSibling.prevKey = null
  } else {
    // only element
    parent.firstKey = parent.lastKey = null
  }
  parent.children.delete(child.key)
}
