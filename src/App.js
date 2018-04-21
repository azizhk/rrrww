import React from 'react';
import logo from './logo.svg';

function List ({data}) {
  return (
    <div className="list" data-key={data.id}>
      <h2 className="list-heading">{data.title}</h2>
      <ul className="list-ul">
        {data.items.map(item => 
          <li className="list-li" key={item.id} data-key={item.id} style={{background:item.color}}>
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
        <h1 className="App-title">Async</h1>
        <button data-onclick="HEADER_BTN_CLICK" className="header-btn" data-task="color" data-target="cols">Sort Cols Color</button>
        <button data-onclick="HEADER_BTN_CLICK" className="header-btn" data-task="color" data-target="rows">Sort Rows Color</button>
        <button data-onclick="HEADER_BTN_CLICK" className="header-btn" data-task="color" data-target="both">Sort Both Color</button>
        <button data-onclick="HEADER_BTN_CLICK" className="header-btn" data-task="text" data-target="cols">Sort Cols Text</button>
        <button data-onclick="HEADER_BTN_CLICK" className="header-btn" data-task="text" data-target="rows">Sort Rows Text</button>
        <button data-onclick="HEADER_BTN_CLICK" className="header-btn" data-task="text" data-target="both">Sort Both Text</button>
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

