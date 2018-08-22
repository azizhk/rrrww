import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import actions from './actions'
import logo from './logo.svg';

function List ({data}) {
  return (
    <div className="list">
      <h2 className="list-heading">{data.title}</h2>
      <ul className="list-ul">
        {data.items.map(item => 
          <li className="list-li" key={item.id} style={{background:item.color}}>
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
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">React Sync</h1>
        <button onClick={HEADER_BTN_CLICK} className="header-btn" data-task="color" data-target="cols">Sort Cols Color</button>
        <button onClick={HEADER_BTN_CLICK} className="header-btn" data-task="color" data-target="rows">Sort Rows Color</button>
        <button onClick={HEADER_BTN_CLICK} className="header-btn" data-task="color" data-target="both">Sort Both Color</button>
        <button onClick={HEADER_BTN_CLICK} className="header-btn" data-task="text" data-target="cols">Sort Cols Text</button>
        <button onClick={HEADER_BTN_CLICK} className="header-btn" data-task="text" data-target="rows">Sort Rows Text</button>
        <button onClick={HEADER_BTN_CLICK} className="header-btn" data-task="text" data-target="both">Sort Both Text</button>
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
