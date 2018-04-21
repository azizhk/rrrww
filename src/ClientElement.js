import * as WorkerElement from './WorkerElement'
import setStyles from './utils/styles'

const ROOT_KEY = 'root'

// Even though one liners, have extracted out to function
// as might be easier to switch to WeakMap to avoid detached node memory leak
// But on low priority as detached node memory leaks are the easiest to fix
const domMap = new Map()
function getDOMFromKey (key) {  
  return domMap.get(key)
}
function setDOMFromKey (key, domElement) {
  domMap.set(key, domElement)
}
function deleteDOMFromKey (key) {
  domMap.delete(key)
}

function createDOMElement (element) {
  const {type, props} = element
  let domElement
  if (type === 'text') {
    domElement = document.createTextNode(element.text)
  } else {
    domElement = document.createElement(type)
  }
  setDOMFromKey(element.key, domElement)
  Object.defineProperty(domElement, '__reactElement', {
    value: element
  })
  props && Object.keys(props).forEach(propName => {
    const propValue = props[propName];

    if (propName === 'style') {
      setStyles(domElement, propValue);
    } else if (propName === 'children') {
      // Set the textContent only for literal string or number children, whereas
      // nodes will be appended in `appendChild`
      if (typeof propValue === 'string' || typeof propValue === 'number') {
        domElement.textContent = propValue;
      }
    } else if (propName === 'className') {
      domElement.setAttribute('class', propValue);
    } else {
      domElement.setAttribute(propName, propValue);
    }
  });

  return domElement
}

export function traverseAndAppendChild (deadline, parentKey, child) {
  let firstTime = true
  while(firstTime || deadline.timeRemaining()) {
    firstTime = false
    const childDOM = createDOMElement(child)
    const parentDOM = getDOMFromKey(parentKey)
    let parent = parentDOM.__reactElement
    
    parentDOM.appendChild(childDOM)
    child.parentKey = parentKey

    if (child.firstKey) {
      parentKey = child.key
      child = child.children.get(child.firstKey)
      continue
    }

    if (child.nextKey) {
      const nextChild = parent.children.get(child.nextKey)
      child = nextChild
      continue
    }

    while (parent.parentKey !== ROOT_KEY) {
      const grandParentDOM = getDOMFromKey(parent.parentKey)
      const grandParent = grandParentDOM.__reactElement
      if (!parent.nextKey) {
        parent = grandParent
        continue
      }

      const nextChild = grandParent.children.get(parent.nextKey)
      if (!nextChild.parentKey) {
        child = nextChild
        parentKey = grandParent.key
        break;
      } else {
        parent = grandParent
      }
    }

    if (parent.parentKey === ROOT_KEY) {
       break
    }
  }

  if (!child.parentKey) {
    return {
      method: 'traverseAndAppendChild',
      parentKey,
      child
    }
  }

  return null
}

export function appendChildToContainer (timeRemaining, root, app) {
  app.parentKey = ROOT_KEY

  const appDOM = createDOMElement(app)
  root.appendChild(appDOM)

  if (app.firstKey) {
    return traverseAndAppendChild(timeRemaining, app.key, app.children.get(app.firstKey))
  }
  return null
}

export function appendChild (timeRemaining, parentKey, child) {
  const parentDOM = getDOMFromKey(parentKey)
  const parent = parentDOM.__reactElement
  WorkerElement.appendChild(parent, child)
  child.parentKey = parent.key

  const childDOM = createDOMElement(child)
  parentDOM.appendChild(childDOM)

  if (child.firstKey) {
    return traverseAndAppendChild(timeRemaining, child.key, child.children.get(child.firstKey))
  }
  return null
}

export function appendExistingChild (parentKey, childKey) {
  const parentDOM = getDOMFromKey(parentKey)
  const parent = parentDOM.__reactElement

  const childDOM = getDOMFromKey(childKey)
  const child = childDOM.__reactElement

  WorkerElement.appendChild(parent, child)
  child.parentKey = parentKey
  parentDOM.appendChild(childDOM)
  return null
}

export function removeChild (parentKey, childKey) {
  const parentDOM = getDOMFromKey(parentKey)
  const parent = parentDOM.__reactElement

  const childDOM = getDOMFromKey(childKey)
  const child = childDOM.__reactElement

  WorkerElement.removeChild(parent, child)
  child.parentKey = null
  deleteDOMFromKey(child.key)
  parentDOM.removeChild(childDOM)
  return null
}

export function insertBefore (timeRemaining, parentKey, child, beforeKey) {
  const parentDOM = getDOMFromKey(parentKey)
  const parent = parentDOM.__reactElement

  const beforeDOM = getDOMFromKey(beforeKey)
  const before = beforeDOM.__reactElement

  WorkerElement.insertBefore(parent, child, before)
  child.parentKey = parent.key

  const childDOM = createDOMElement(child)
  parentDOM.insertBefore(childDOM, beforeDOM)

  if (child.firstKey) {
    return traverseAndAppendChild(timeRemaining, child.key, child.children.get(child.firstKey))
  }
  return null
}

export function insertExistingBefore (parentKey, childKey, beforeKey) {
  const parentDOM = getDOMFromKey(parentKey)
  const parent = parentDOM.__reactElement

  const childDOM = getDOMFromKey(childKey)
  const child = childDOM.__reactElement

  const beforeDOM = getDOMFromKey(beforeKey)
  const before = beforeDOM.__reactElement

  WorkerElement.insertBefore(parent, child, before)
  parentDOM.insertBefore(childDOM, beforeDOM)
  child.parentKey = parentKey
  return null
}
