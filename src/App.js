import React from 'react';
import { connect } from 'react-redux'

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

function App ({lists}) {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="App-title">Slow Trello</h1>
        <button data-onclick="HEADER_BTN_CLICK" className="header-btn" data-task="shuffle" data-target="cols">Shuffle Columns</button>
        <button data-onclick="HEADER_BTN_CLICK" className="header-btn" data-task="shuffle" data-target="rows">Shuffle Rows</button>
        <button data-onclick="HEADER_BTN_CLICK" className="header-btn" data-task="shuffle" data-target="both">Shuffle Both</button>
        <button data-onclick="HEADER_BTN_CLICK" className="header-btn" data-task="sort" data-target="cols">Sort Columns</button>
        <button data-onclick="HEADER_BTN_CLICK" className="header-btn" data-task="sort" data-target="rows">Sort Rows</button>
        <button data-onclick="HEADER_BTN_CLICK" className="header-btn" data-task="sort" data-target="both">Sort Both</button>
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

export default connect(mapStateToProps)(App);
