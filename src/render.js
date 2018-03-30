import Renderer from './reconciler'

let root
export default function render (element) {
  if (!root) {
    root = Renderer.createContainer();
  }
  return Renderer.updateContainer(element, root, null);
}
