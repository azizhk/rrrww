export default {
  HEADER_BTN_CLICK (e) {
    return {
      type: 'HEADER_BTN_CLICK',
      payload: {
        task: e.delegateTarget.dataset.task,
        target: e.delegateTarget.dataset.target
      }
    }
  }
}