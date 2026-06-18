define(['vb/action/actionChain', 'vb/action/actions'], (ActionChain, Actions) => {
  'use strict';
  class NavSearchHistoryChain extends ActionChain {
    async run(context) {
      context.$application.variables.sidebar = false;
      await Actions.navigateToFlow(context, { flow: 'main', page: 'main-history' });
    }
  }
  return NavSearchHistoryChain;
});