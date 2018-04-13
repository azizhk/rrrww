import uuidv4 from 'uuid/v4'

export default class WorkerElement {
  children = new Map()
  firstKey = null
  lastKey = null
  prevKey = null
  nextKey = null
  constructor (type) {
    this.type = type
    this.key = uuidv4()
  }
  markSent () {
    Object.defineProperty(this, 'sent', {
      value: true
    })
    // TODO:Aziz Reduce Call Stack
    this.children.forEach((child) => {
      child.markSent()
    })
  }
  appendChild (child) {
    if (this.children.get(child.key)) {
      this.removeChild(child)
    }
    this.children.set(child.key, child)
    if (!this.firstKey) {
      this.firstKey = this.lastKey = child.key
    } else {
      child.prevKey = this.lastKey
      const oldLastChild = this.children.get(this.lastKey)
      oldLastChild.nextKey = this.lastKey = child.key
    }
  }
  appendBeforeChild (child, nextSibling) {
    if (this.children.get(child.key)) {
      this.removeChild(child)
    }
    this.children.set(child.key, child)
    const prevSibling = this.children.get(nextSibling.prevKey)
    child.nextKey = nextSibling.key
    nextSibling.prevKey = child.key
    child.prevKey = nextSibling.prevKey
    if (prevSibling) {
      prevSibling.nextKey = child.key
    } else {
      this.firstKey = child.key
    }
  }
  removeChild (child) {
    const prevSibling = this.children.get(child.prevKey)
    const nextSibling = this.children.get(child.nextKey)
    if (prevSibling && nextSibling) {
      // middle element
      prevSibling.nextKey = nextSibling.key
      nextSibling.prevKey = prevSibling.key
    } else if (prevSibling) {
      // last element
      prevSibling.nextKey = null
      this.lastKey = prevSibling.key
    } else if (nextSibling) {
      // first element
      this.firstKey = nextSibling.key
      nextSibling.prevKey = null
    } else {
      // only element
      this.firstKey = this.lastKey = null
    }
    this.children.delete(child.key)
  }
}
