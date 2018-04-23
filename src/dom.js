import * as ClientElement from './ClientElement'

export default {
  appendChildToContainer (deadline, payload, root) {
    return ClientElement.appendChildToContainer(deadline, root, payload.child)
  },
  appendChild (deadline, payload) {
    return ClientElement.appendChild(deadline, payload.parentKey, payload.child)
  },
  appendExistingChild (deadline, payload) {
    // Can be done ASAP because O(1)
    ClientElement.appendExistingChild(payload.parentKey, payload.childKey)
    return null
  },
  removeChild (deadline, payload) {
    // Can be done ASAP because O(1)
    ClientElement.removeChild(payload.parentKey, payload.childKey)
    return null
  },
  insertBefore (deadline, payload) {
    return ClientElement.insertExistingBefore(payload.parentKey, payload.child, payload.beforeKey)
  },
  insertExistingBefore (deadline, payload) {
    // Can be done ASAP because O(1)
    ClientElement.insertExistingBefore(payload.parentKey, payload.childKey, payload.beforeKey)
    return null
  },
  traverseAndAppendChild (deadline, payload) {
    return ClientElement.traverseAndAppendChild(deadline, payload.parentDOM, payload.child)
  }
}
