import './index.css';
import delegate from 'delegate'
import actions from './actions'
import dom from './dom'

const worker = new Worker('/worker.js')
const root = document.getElementById('root')

delegate(root, '[data-onclick]', 'click', function (e) {
  const target = e.delegateTarget
  const action = target.dataset.onclick
  worker.postMessage(actions[action](e))
})

let queue = []
function processQueue (deadline) {
  while (deadline.timeRemaining() && queue.length) {
    const data = queue.shift()
    const ret = dom[data.method] && dom[data.method](deadline, data, root)
    if (ret) {
      queue.unshift(ret)
      break // TODO:Aziz remove break
    }
  }
  if (queue.length) {
    requestIdleCallback(processQueue)
  }
}

worker.onmessage = ({data}) => {
  // debugger
  if (!queue.length) {
    requestIdleCallback(processQueue)
  }
  queue = queue.concat(data)
}
