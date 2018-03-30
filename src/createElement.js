import uuidv4 from 'uuid/v4'

export default function createElement (type, props) {
  return {
    type,
    key: uuidv4(),
    children: []
  }
}