const domMap = new Map()

function appendToDom (element, parent, before) {
  if (domMap.get(element.key)) {
    return domMap.get(element.key)
  }
  const {type, props, children} = element
  let domElement
  if (type === 'text') {
    domElement = document.createTextNode(element.text)
  } else {
    domElement = document.createElement(type)
  }
  domMap.set(element.key, domElement)
  Object.defineProperty(domElement, '__reactElement', {
    value: element
  })
  // Set the prop to the domElement
  props && Object.keys(props).forEach(propName => {
    const propValue = props[propName];

    if (propName === 'style') {
      // TODO:
      // setStyles(domElement, propValue);
    } else if (propName === 'children') {
      // Set the textContent only for literal string or number children, whereas
      // nodes will be appended in `appendChild`
      if (typeof propValue === 'string' || typeof propValue === 'number') {
        domElement.textContent = propValue;
      } else {
        
      }
    } else if (propName === 'className') {
      domElement.setAttribute('class', propValue);
    } else {
      domElement.setAttribute(propName, propValue);
    }
  });

  // TODO:Aziz follow order from firstKey to lastKey
  if (children.size > 10) {
    requestIdleCallback(() => {
      children.forEach((child) => {
        return appendToDom(child, domElement)
      })
    })
  } else {
    children.forEach((child) => {
      return appendToDom(child, domElement)
    })
  }

  if (before) {
    parent.insertBefore(domElement, before)
  } else {
    parent.appendChild(domElement)
  }

  return domElement
}

export default {
  appendChildToContainer (payload, root) {
    const child = payload.child
    console.log(child)
    appendToDom(child, root)
    // root.appendChild(dom)
  },
  appendChild (payload) {
    const parent = domMap.get(payload.parentKey)
    if (payload.childKey) {
      const child = domMap.get(payload.childKey)
      parent.appendChild(child)
    } else {
      appendToDom(payload.child, parent)
    }
    // parent.appendChild(payloadToDom(child))
  },
  removeChild (payload) {
    const child = domMap.get(payload.childKey)
    const parent = domMap.get(payload.parentKey)
    parent.removeChild(child)
  },
  insertBefore (payload) {
    const parent = domMap.get(payload.parentKey)
    const before = domMap.get(payload.beforeKey)
    if (!parent) {
      throw new Error('Parent not found')
    }
    if (payload.childKey) {
      const child = domMap.get(payload.childKey)
      parent.insertBefore(child, before)
    } else {
      appendToDom(payload.child, parent, before)
    }
  }
}