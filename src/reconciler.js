/* global self */
/* eslint no-restricted-globals: 0 */
import Reconciler from 'react-reconciler';
import emptyObject from 'fbjs/lib/emptyObject';
import createElement from './createElement'
import _ from 'underscore'

function shallowDiff(oldObj, newObj) {
  // Return a diff between the new and the old object
  const uniqueProps = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
  const changedProps = Array.from(uniqueProps).filter(
    propName => oldObj[propName] !== newObj[propName]
  );

  return changedProps;
}

function markSent (element) {
  if (!_.isString(element) && !element.sent) {
    Object.defineProperty(element, 'sent', {
      value: true
    })
    // TODO:Aziz Reduce Call Stack
    element.children.forEach(markSent)
  }
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

  prepareForCommit() {},
  resetAfterCommit() {},
  resetTextContent(wordElement) {},

  prepareUpdate(domElement, type, oldProps, newProps) {
    return shallowDiff(oldProps, newProps)
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
      // TODO:Aziz appendChild should not be O(n)
      if (parentInstance.children.includes(child)) {
        const index = parentInstance.children.indexOf(child)
        parentInstance.children = [
          ...parentInstance.children.slice(0, index),
          ...parentInstance.children.slice(index + 1)
        ]
      }
      parentInstance.children.push(child)
      markSent(child)
      sendMessage({
        method: 'appendChild',
        parentKey: parentInstance.key,
        ...identifier
      })
    },

    appendChildToContainer(parentInstance, child) {
      // debugger
      markSent(child)
      sendMessage({
        method: 'appendChildToContainer',
        child: child
      })
    },

    removeChild(parentInstance, child) {
      // TODO:Aziz removeChild should not be O(n)
      const index = parentInstance.children.indexOf(child)
      parentInstance.children = [
        ...parentInstance.children.slice(0, index),
        ...parentInstance.children.slice(index + 1)
      ]
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
      // TODO:Aziz insertBefore should not be O(n)
      if (parentInstance.children.includes(child)) {
        const index = parentInstance.children.indexOf(child)
        parentInstance.children = [
          ...parentInstance.children.slice(0, index),
          ...parentInstance.children.slice(index + 1)
        ]
        const beforeIndex = parentInstance.children.indexOf(beforeChild)
        parentInstance.children = [
          ...parentInstance.children.slice(0, beforeIndex),
          child,
          ...parentInstance.children.slice(beforeIndex)
        ]
      }
      markSent(child)
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

