export default {
  HEADER_BTN_CLICK (e) {
    return {
      type: 'HEADER_BTN_CLICK',
      payload: {
        task: e.currentTarget.dataset.task,
        target: e.currentTarget.dataset.target
      }
    }
  }
}