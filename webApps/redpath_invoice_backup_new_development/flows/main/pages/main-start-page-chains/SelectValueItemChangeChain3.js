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

  class SelectValueItemChangeChain3 extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {object} params.event
     * @param {any} params.previousValue
     * @param {any} params.value
     * @param {string} params.updatedFrom
     * @param {any} params.key
     * @param {any} params.data
     * @param {any} params.metadata
     * @param {any} params.valueItem
     */
    async run(context, { event, previousValue, value, updatedFrom, key, data, metadata, valueItem }) {
      const { $page, $flow, $application, $constants, $variables } = context;

      await Actions.resetVariables(context, {
        variables: [
    '$variables.lovContracts.data',
  ],
      });

      // const response = await Actions.callRest(context, {
      //   endpoint: 'Databridge_Oracle_Invoice_Backup/getApiOracleLovContracts',
      //   uriParams: {
      //     'P_BU_ID': $flow.variables.bu_id,
      //     'P_PROJECT_ID': $flow.variables.project_id,
      //   },
      // });

      const response = await Actions.callRest(context, {
        endpoint: 'Oracle_Invoice_Backup_OIC/getIcApiOracleLovContracts',
        uriParams: {
          'P_BU_ID': $flow.variables.bu_id,
          // 'P_PROJECT_ID': $flow.variables.project_id,,
          'P_PROJECT_ID': data.PROJECT_ID,
        },
      });

     // $variables.lovContracts.data = response.body.data.Contracts;

       $variables.selectedProjectId = data.PROJECT_ID;
       
      $flow.variables.project = data.PROJECT_ID;

     
      $variables.lovContracts.data = response.body.Contracts;
    }
  }

  return SelectValueItemChangeChain3;
});
