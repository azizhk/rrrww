import _ from 'underscore'
import leftPad from 'left-pad'

function RNG (s) {
  return function() {
    s = Math.sin(s) * 10000; return s - Math.floor(s);
  };
};

const rng = RNG(42);
_.random = function(min, max) {
  if (max == null) {
    max = min;
    min = 0;
  }
  return min + Math.floor(rng() * (max - min + 1));
};

function toColor (number) {
  return leftPad(
    Math.floor(number * 255).toString(16), 2, '0'
  )
}

function generateItem (val, red, green) {
  return {
    id: val,
    text: val,
    color: `#${toColor(red)}${toColor(green)}ff`
  }
}

function generateList (id, green) {
  const itemCount = 150
  const items = _.shuffle(
      _.range(itemCount)
    )
    .map((val, index) => {
      return generateItem(index, val/itemCount, green)
    })
  return {
    id: toColor(green),
    title: id,
    items: items
  }
}

function generateState () {
  const listsCount = 200
  const lists = _.shuffle(
      _.range(listsCount)
    )
    .map((val, index) => {
      return generateList(index, val/listsCount)
    })
  return lists
}

export default function reducer (state, action) {
  if (!state) {
    return {lists: generateState()}
  }

  if (action.type === 'HEADER_BTN_CLICK') {
    const {task, target} = action.payload;
    let lists = state.lists
    if (target === 'cols' || target === 'both') {
      if (task === 'text') {
        lists = _.sortBy(lists, 'title')
      } else if (task === 'color') {
        lists = _.sortBy(lists, 'id')
      }
    }

    if (target === 'rows' || target === 'both') {
      if (task === 'text') {
        lists = lists.map(list => ({
          ...list,
          items: _.sortBy(list.items, 'text')
        }))
      } else if (task === 'color') {
        lists = lists.map(list => ({
          ...list,
          items: _.sortBy(list.items, 'color')
        }))
      }
    }
    return {...state, lists}
  }
}