import _ from 'underscore'
const lorem = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'Morbi', 'vel', 'arcu', 'vel', 'quam', 'malesuada', 'condimentum', 'nec', 'sed', 'velit', 'Cras', 'eget', 'neque', 'nunc', 'Donec', 'metus', 'diam', 'placerat', 'sed', 'mauris', 'ut', 'pulvinar', 'efficitur', 'leo', 'Donec', 'lacus', 'nisi', 'bibendum', 'eu', 'leo', 'ut', 'tincidunt', 'gravida', 'nibh', 'Fusce', 'accumsan', 'velit', 'sit', 'amet', 'lorem', 'placerat', 'luctus', 'Nunc', 'porta', 'eget', 'est', 'fringilla', 'tristique', 'Suspendisse', 'potenti', 'Sed', 'id', 'vestibulum', 'purus', 'Mauris', 'nunc', 'odio', 'ultrices', 'sit', 'amet', 'erat', 'non', 'congue', 'porttitor', 'leo']

function generateSentence (wordCount) {
  return _.sample(lorem, wordCount).join(' ')
}

function generateItem (id) {
  const wordCount = 10 + Math.floor(10 * Math.random())
  return {
    id: id,
    text: generateSentence(wordCount)
  }
}

function generateList (id) {
  // Between 180 to 220
  const itemCount = 180 + Math.floor(40 * Math.random())
  const items = _
    .range(itemCount)
    .map(generateItem)
  return {
    id: id,
    title: generateSentence(3 + Math.floor(2 * Math.random())),
    items: items
  }
}

function generateState () {
  // Between 90 to 110
  const listsCount = 90 + Math.floor(20 * Math.random())
  const lists = _
    .range(listsCount)
    .map(generateList)
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
      if (task === 'sort') {
        lists = _.sortBy(lists, 'title')
      } else if (task === 'shuffle') {
        lists = _.shuffle(lists)
      }
    }

    if (target === 'rows' || target === 'both') {
      if (task === 'sort') {
        lists = lists.map(list => ({
          ...list,
          items: _.sortBy(list.items, 'text')
        }))
      } else if (task === 'shuffle') {
        lists = lists.map(list => ({
          ...list,
          items: _.shuffle(list.items)
        }))
      }
    }
    return {...state, lists}
  }
}