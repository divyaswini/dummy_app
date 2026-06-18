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
  class SelectValueItemChangeChain extends ActionChain {
    async run(context, { event, previousValue, value, updatedFrom, key, data, metadata, valueItem }) {
      const { $page, $flow, $application, $constants, $variables } = context;

      // Reset dependents
      $variables.contract_id = '';
      $variables.ppmInvoicenumber = '';
      $variables.AR_Invoice_Number = '';
      $variables.selectedExpTypes = [];
      $variables.lovContractInvoices.data = [];
      $variables.lovArInvoices.data = [];

      // const response = await Actions.callRest(context, {
      //   endpoint: 'Databridge_Oracle_Invoice_Backup/getApiOracleLovExpenditure_type',
      //   uriParams: {
      //     'P_PROJECT_ID': $flow.variables.project_id,
      //   },
      // });

      const response = await Actions.callRest(context, {
        endpoint: 'Oracle_Invoice_Backup_OIC/getIcApiOracleLovExpenditure_type',
        uriParams: {
          'P_PROJECT_ID': $flow.variables.project_id,
        },
      });
      //$variables.expenditure_type.data = response.body.data.Projects;
      $variables.expenditure_type.data = response.body.Projects;
    }
  }
  return SelectValueItemChangeChain;
});