/* global self */
import devToolsEnhancer from 'remote-redux-devtools';
import render from './render'

import App, {mapStateToProps} from './App';
import { createStore } from 'redux'
import reducer from './reducer'

const store = createStore(
  reducer,
  devToolsEnhancer({
    port: 8000
  })
)

function _render () {
  const props = mapStateToProps(store.getState())
  return render(
    App({...props})
  )
}

_render()

self.onmessage = (message) => { // eslint-disable-line
  console.log(message)
  store.dispatch(message.data)
  _render()
}