define([
  'vb/action/actionChain',
  'vb/action/actions',
], (
  ActionChain,
  Actions
) => {
  'use strict';
  class CloseSuccessDialogChain extends ActionChain {
    async run(context) {
      document.getElementById('submitSuccessDialog').close();
      const toMain = await Actions.navigateToFlow(context, {
        flow: 'main',
        target: 'parent',
        page: 'main-start',
      });
    }
  }
  return CloseSuccessDialogChain;
});