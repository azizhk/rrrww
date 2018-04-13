/* global self */
/* eslint no-restricted-globals: 0 */
import Reconciler from 'react-reconciler';
import emptyObject from 'fbjs/lib/emptyObject';
import WorkerElement from './WorkerElement'
import changedProps from './utils/changedProps'
import _ from 'underscore'

// let delay = 0
function sendMessage(payload) {
  setTimeout(() => {
    self.postMessage(payload)
  }, 0)
  // delay += 1
}

export default Reconciler({
  appendInitialChild(parentInstance, child) {
    parentInstance.appendChild(child)
  },

  createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
    return new WorkerElement(type);
  },

  createTextInstance(text, rootContainerInstance, internalInstanceHandle) {
    return new WorkerElement('text');
    // return text;
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
    return changedProps(oldProps, newProps)
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
      parentInstance.appendChild(child)
      child.markSent()
      sendMessage({
        method: 'appendChild',
        parentKey: parentInstance.key,
        ...identifier
      })
    },

    appendChildToContainer(parentInstance, child) {
      // debugger
      child.markSent()
      sendMessage({
        method: 'appendChildToContainer',
        child: child
      })
    },

    removeChild(parentInstance, child) {
      // TODO:Aziz removeChild should not be O(n)
      parentInstance.removeChild(child)
      sendMessage({
        method: 'removeChild',
        parentKey: parentInstance.key,
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

    insertBefore(parentInstance, child, beforeChild) {
      const identifier = child.key
        ? { childKey: child.key }
        : { child: child }
      parentInstance.appendBeforeChild(child, beforeChild)
      child.markSent()
      sendMessage({
        method: 'insertBefore',
        parentKey: parentInstance.key,
        beforeKey: beforeChild.key,
        ...identifier
      })
    },

    commitUpdate(instance, updatePayload, type, oldProps, newProps) {
      updatePayload = updatePayload.filter(prop => prop !== 'children')
      if (updatePayload.length) {
        debugger
        throw new Error('not yet implemented')
        // sendMessage({
        //   method: 'commitUpdate',
        //   instance, updatePayload, type, oldProps, newProps
        // })
      }
    },

    commitMount(instance, updatePayload, type, oldProps, newProps) {
      if (updatePayload.length) {
        debugger
        throw new Error('not yet implemented')
        // sendMessage({
        //   method: 'commitMount',
        //   instance, updatePayload, type, oldProps, newProps
        // })
      }
    },

    commitTextUpdate(textInstance, oldText, newText) {
      debugger
    }
  }
})

