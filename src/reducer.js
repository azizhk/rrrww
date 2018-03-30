import _ from 'underscore'
const lorem = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'Morbi', 'vel', 'arcu', 'vel', 'quam', 'malesuada', 'condimentum', 'nec', 'sed', 'velit', 'Cras', 'eget', 'neque', 'nunc', 'Donec', 'metus', 'diam', 'placerat', 'sed', 'mauris', 'ut', 'pulvinar', 'efficitur', 'leo', 'Donec', 'lacus', 'nisi', 'bibendum', 'eu', 'leo', 'ut', 'tincidunt', 'gravida', 'nibh', 'Fusce', 'accumsan', 'velit', 'sit', 'amet', 'lorem', 'placerat', 'luctus', 'Nunc', 'porta', 'eget', 'est', 'fringilla', 'tristique', 'Suspendisse', 'potenti', 'Sed', 'id', 'vestibulum', 'purus', 'Mauris', 'nunc', 'odio', 'ultrices', 'sit', 'amet', 'erat', 'non', 'congue', 'porttitor', 'leo']

function randomRange (min, max) {
  const value = min + Math.floor((max - min) * Math.random())
  // return value
  return Math.floor(value / 10) + 2
}

function generateSentence (wordCount) {
  return _.sample(lorem, wordCount).join(' ')
}

function generateItem (id) {
  const wordCount = randomRange(10, 20)
  return {
    id: id,
    text: generateSentence(wordCount)
  }
}

function generateList (id) {
  const itemCount = randomRange(180, 220)
  const items = _
    .range(itemCount)
    .map(generateItem)
  return {
    id: id,
    title: generateSentence(randomRange(3, 5)),
    items: items
  }
}

function generateState () {
  const listsCount = randomRange(90, 110)
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