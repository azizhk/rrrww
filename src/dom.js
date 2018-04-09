import _ from 'underscore'

const domMap = new Map()

function appendToDom (element, parent, before) {
  if (_.isString(element)) {
    parent.textContent = element
    return
    // return document.createTextNode(element);
  }
  if (domMap.get(element.key)) {
    return domMap.get(element.key)
  }
  const {type, props, children} = element
  const domElement = document.createElement(type)
  domMap.set(element.key, domElement)
  // Set the prop to the domElement
  Object.keys(props).forEach(propName => {
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

  if (children.length > 10) {
    requestIdleCallback(() => {
      children.map((child) => {
        return appendToDom(child, domElement)
        // return domElement.appendChild(payloadToDom(child))
      })
    })
  } else {
    children.map((child) => {
      return appendToDom(child, domElement)
      // return domElement.appendChild(payloadToDom(child))
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