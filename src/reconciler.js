/* global self */
/* eslint no-restricted-globals: 0 */
import Reconciler from 'react-reconciler';
import emptyObject from 'fbjs/lib/emptyObject';
import * as WorkerElement from './WorkerElement'
import changedProps from './utils/changedProps'
import _ from 'underscore'

// let delay = 0
let queue = []
let timeoutId
function sendMessage(payload) {
  queue.push(payload)
  if (queue.length === 1) {
    timeoutId = setTimeout(processQueue, 0)
  } else if (queue.length === 50) { // TODO:Aziz Remove arbritrary number
    processQueue()
    clearTimeout(timeoutId)
  }
}

function processQueue () {
  self.postMessage(queue)
  queue = []
}

export default Reconciler({
  appendInitialChild(parent, child) {
    WorkerElement.appendChild(parent, child)
  },

  createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
    return WorkerElement.createElement(type);
  },

  createTextInstance(text, rootContainerInstance, internalInstanceHandle) {
    const element = WorkerElement.createElement('text');
    element.text = text;
    return element;
  },

  finalizeInitialChildren(element, type, props) {
    element.props = _.mapObject(props, (val, key) => {
      if (key !== 'children') {
        return val
      }
    })
    return false;
  },

  getPublicInstance(inst) {
    return inst;
  },

  prepareForCommit() {},
  resetAfterCommit() {},
  resetTextContent(wordElement) {},

  prepareUpdate(domElement, type, oldProps, newProps) {
    return changedProps(oldProps, newProps).filter(prop => prop !== 'children')
  },

  getRootHostContext(rootInstance) {
    return emptyObject;
  },

  getChildHostContext(parentHostContext, type) {
    return emptyObject;
  },

  shouldSetTextContent(type, props) {
    return false
  },

  now: () => {
    // noop
  },

  useSyncScheduling: true,

  // now: () => performance.now(),

  // shouldDeprioritizeSubtree (type, props) {
  //   return false;
  // },

  // scheduleDeferredCallback (cb) {
  //   return setTimeout(() => {
  //     cb(null)
  //   }, 0)
  // },

  // cancelDeferredCallback (id) {
  //   return clearTimeout(id)
  // },

  mutation: {
    appendChild(parentInstance, child) {
      const identifier = child.sent
        ? { childKey: child.key }
        : { child: child }
      WorkerElement.appendChild(parentInstance, child)
      sendMessage({
        method: child.sent ? 'appendExistingChild' : 'appendChild',
        parentKey: parentInstance.key,
        ...identifier
      })
      WorkerElement.markSent(child)
    },

    appendChildToContainer(parentInstance, child) {
      sendMessage({
        method: 'appendChildToContainer',
        child: child
      })
      WorkerElement.markSent(child)
    },

    removeChild(parent, child) {
      WorkerElement.removeChild(parent, child)
      sendMessage({
        method: 'removeChild',
        parentKey: parent.key,
        childKey: child.key
      })
    },

    removeChildFromContainer(parentInstance, child) {
      // debugger
      // throw new Error('not yet implemented')
      // sendMessage({
      //   method: 'removeChildFromContainer',
      //   parentInstance, child
      // })
    },

    insertBefore(parent, child, beforeChild) {
      const identifier = child.sent
        ? { childKey: child.key }
        : { child: child }
      WorkerElement.insertBefore(parent, child, beforeChild)
      sendMessage({
        method: child.sent ? 'insertExistingBefore' : 'insertBefore',
        parentKey: parent.key,
        beforeKey: beforeChild.key,
        ...identifier
      })
      WorkerElement.markSent(child)
    },

    commitUpdate(instance, updatePayload, type, oldProps, newProps) {
      if (updatePayload.length) {
        // throw new Error('not yet implemented')
        // sendMessage({
        //   method: 'commitUpdate',
        //   instance, updatePayload, type, oldProps, newProps
        // })
      }
    },

    commitMount(instance, updatePayload, type, oldProps, newProps) {
      if (updatePayload.length) {
        throw new Error('not yet implemented')
        // sendMessage({
        //   method: 'commitMount',
        //   instance, updatePayload, type, oldProps, newProps
        // })
      }
    },

    commitTextUpdate(textInstance, oldText, newText) {
      throw new Error('not yet implemented')
    }
  }
})

