define(['vb/action/actionChain', 'vb/action/actions'], (ActionChain, Actions) => {
  'use strict';
  class vbEnterListener extends ActionChain {
    async run(context) {
      const { $page, $flow, $variables } = context;
    }
  }
  return vbEnterListener;
});
