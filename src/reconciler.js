/* global self */
/* eslint no-restricted-globals: 0 */
import Reconciler from 'react-reconciler';
import emptyObject from 'fbjs/lib/emptyObject';
import createElement from './createElement'
// import stringify from 'json-stringify-safe'
import stringify from 'safe-json-stringify'
import _ from 'underscore'

function shallowDiff(oldObj, newObj) {
  // Return a diff between the new and the old object
  const uniqueProps = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
  const changedProps = Array.from(uniqueProps).filter(
    propName => oldObj[propName] !== newObj[propName]
  );

  return changedProps;
}

// let delay = 0
function sendMessage(payload) {
  setTimeout(() => {
    self.postMessage(payload)
  }, 0)
  // delay += 1
}

export default Reconciler({
  appendInitialChild(parentInstance, child) {
    parentInstance.children.push(child)
  },

  createInstance(type, props, rootContainerInstance, hostContext, internalInstanceHandle) {
    return createElement(type, props, internalInstanceHandle.key);
  },

  createTextInstance(text, rootContainerInstance, internalInstanceHandle) {
    return text;
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

  prepareForCommit() {
    // noop
    // debugger
  },

  prepareUpdate(wordElement, type, oldProps, newProps) {
    return shallowDiff(oldProps, newProps)
  },

  resetAfterCommit() {
    // noop
    // debugger
    // delay = 0
  },

  resetTextContent(wordElement) {
    // noop
  },

  getRootHostContext(rootInstance) {
    // You can use this 'rootInstance' to pass data from the roots.
  },

  getChildHostContext() {
    return emptyObject;
  },

  shouldSetTextContent(type, props) {
    return false;
  },

  now: () => performance.now(),

  shouldDeprioritizeSubtree (type, props) {
    return false;
  },

  scheduleDeferredCallback (cb) {
    return setTimeout(() => {
      cb(null)
    }, 0)
  },

  cancelDeferredCallback (id) {
    return clearTimeout(id)
  },

  mutation: {
    appendChild(parentInstance, child) {
      // debugger
      parentInstance.children.push(child)
      sendMessage({
        method: 'appendInitialChild',
        parentKey: parentInstance.key,
        child: stringify(child)
      })
    },

    appendChildToContainer(parentInstance, child) {
      // debugger
      sendMessage({
        method: 'appendChildToContainer',
        child: stringify(child)
      })
    },

    removeChild(parentInstance, child) {
      debugger
      sendMessage({
        method: 'removeChild',
        parentKey: parentInstance.key,
        childKey: child.key
      })
    },

    removeChildFromContainer(parentInstance, child) {
      debugger
      throw new Error('not yet implemented')
      // sendMessage({
      //   method: 'removeChildFromContainer',
      //   parentInstance, child
      // })
    },

    insertBefore(parentInstance, child, beforeChild) {
      // TODO:Aziz Check if need to stringify entire child again which are already sent.
      // debugger
      sendMessage({
        method: 'insertBefore',
        parentKey: parentInstance.key,
        childKey: child.key,
        beforeKey: beforeChild.key
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

