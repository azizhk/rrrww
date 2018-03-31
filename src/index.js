import './index.css';
import delegate from 'delegate'
import actions from './actions'
import dom from './dom'

const worker = new Worker('/worker.js')
const root = document.getElementById('root')

delegate(root, '[data-onclick]', 'click', function (e) {
  const target = e.delegateTarget
  const action = target.dataset.onclick
  debugger
  worker.postMessage(actions[action](e))
})

let disped = false
worker.onmessage = ({data}) => {
  // debugger
  console.log(data)
  requestIdleCallback(() => {
    dom[data.method] && dom[data.method](data, root)
  })

  if (!disped) {
    disped = true
    setTimeout(() => {
      worker.postMessage({
        type: 'HEADER_BTN_CLICK',
        payload: {
          task: 'shuffle',
          target: 'both'
        }
      })
    }, 5000)
  }
}