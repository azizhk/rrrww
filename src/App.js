import React from 'react';
import logo from './logo.svg';

function List ({data}) {
  return (
    <div className="list" data-key={data.id}>
      <h2 className="list-heading">{data.title}</h2>
      <ul className="list-ul">
        {data.items.map(item => 
          <li className="list-li" key={item.id} data-key={item.id}>
            {item.text}
          </li>
        )}
      </ul>
    </div>
  )
}

export default function App ({lists}) {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
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

export function mapStateToProps (state) {
  return {
    lists: state.lists
  }
}

