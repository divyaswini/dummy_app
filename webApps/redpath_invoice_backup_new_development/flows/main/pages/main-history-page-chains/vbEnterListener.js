define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
], (
  ActionChain,
  Actions,
  ActionUtils
) => {
  'use strict';

  class vbEnterListener extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $constants, $variables } = context;


      const response = await Actions.callRest(context, {
        endpoint: 'Databridge_Oracle_Invoice_Backup/getApiOracleLovBusinessUnits',
      });

      $variables.lovbusinessunit.data = response.body.data.BusinessUnits;
    }
  }

  return vbEnterListener;
});
