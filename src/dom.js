import _ from 'underscore'

const domMap = new Map()

function payloadToDom (element) {
  if (_.isString(element)) {
    return document.createTextNode(element);
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

  children.map((child) => {
    return domElement.appendChild(payloadToDom(child))
  })

  return domElement
}

export default {
  appendChildToContainer (payload, root) {
    const child = JSON.parse(payload.child)
    console.log(child)
    const dom = payloadToDom(child)
    root.appendChild(dom)
  },
  appendChild (payload) {
    const child = JSON.parse(payload.child)
    const parent = domMap.get(payload.parentKey)
    parent.appendChild(payloadToDom(child))
  },
  removeChild (payload) {
    const child = domMap.get(payload.childKey)
    const parent = domMap.get(payload.parentKey)
    parent.removeChild(child)
  },
  insertBefore (payload) {
    let child
    if (payload.childKey) {
      child = domMap.get(payload.childKey)
    } else {
      child = payloadToDom(JSON.parse(payload.child))
    }
    const parent = domMap.get(payload.parentKey)
    const before = domMap.get(payload.beforeKey)
    parent.insertBefore(child, before)
  }
  
}