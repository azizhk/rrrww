import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from './actions'

function List ({data}) {
  return (
    <div className="list">
      <h2 className="list-heading">{data.title}</h2>
      <ul className="list-ul">
        {data.items.map(item => 
          <li className="list-li" key={item.id}>
            {item.text}
          </li>
        )}
      </ul>
    </div>
  )
}

function App ({lists, HEADER_BTN_CLICK}) {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Slow Trello</h1>
        <button onClick={HEADER_BTN_CLICK} className="header-btn" data-task="shuffle" data-target="cols">Shuffle Columns</button>
        <button onClick={HEADER_BTN_CLICK} className="header-btn" data-task="shuffle" data-target="rows">Shuffle Rows</button>
        <button onClick={HEADER_BTN_CLICK} className="header-btn" data-task="shuffle" data-target="both">Shuffle Both</button>
        <button onClick={HEADER_BTN_CLICK} className="header-btn" data-task="sort" data-target="cols">Sort Columns</button>
        <button onClick={HEADER_BTN_CLICK} className="header-btn" data-task="sort" data-target="rows">Sort Rows</button>
        <button onClick={HEADER_BTN_CLICK} className="header-btn" data-task="sort" data-target="both">Sort Both</button>
      </header>
      <div className="lists">
        {lists && lists.map(data => 
          <List
            data={data}
            key={data.id}
          />
        )}
      </div>
    </div>
  );
}

function mapStateToProps (state) {
  return {
    lists: state.lists
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
