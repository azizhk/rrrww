import './index.css';
import delegate from 'delegate'
import actions from './actions'

const worker = new Worker('/worker.js')
const root = document.getElementById('root')

delegate(root, '[data-onclick]', 'click', function (e) {
  const target = e.delegateTarget
  const action = target.dataset.onclick
  worker.postMessage(actions[action](e))
})
