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
  class SelectValueItemChangeChain1 extends ActionChain {
    async run(context, { event, previousValue, value, updatedFrom, key, data, metadata, valueItem }) {
      const { $page, $flow, $application, $constants, $variables } = context;

      // Reset dependents
      $variables.lovProjects.data = [];
      $flow.variables.project_id = '';
      $variables.contract_id = '';
      $variables.ppmInvoicenumber = '';
      $variables.AR_Invoice_Number = '';
      $variables.selectedExpTypes = [];
      $variables.selectedExpSources = [];
      $variables.expFromDate = '';
      $variables.expToDate = '';
      $variables.lovContractInvoices.data = [];
      $variables.lovArInvoices.data = [];

      // const response = await Actions.callRest(context, {
      //   endpoint: 'Databridge_Oracle_Invoice_Backup/getApiOracleLovProjects2',
      //   uriParams: {
      //     'P_BU_ID': $flow.variables.bu_id,
      //   },
      // });
      // const response = await Actions.callRest(context, {
      //   endpoint: 'Oracle_Invoice_Backup_OIC/getIcApiOracleLovProjects',
      //   uriParams: {
      //     'P_BU_ID': $flow.variables.bu_id,
      //   },
      // });
      // $variables.lovProjects.data = response.body.data.Projects;
      // $variables.lovProjects.data = response.body.Projects;

      // const response2 = await Actions.callRest(context, {
      //   endpoint: 'Databridge_Oracle_Invoice_Backup/getApiOracleLovErrorEmails2',
      //   uriParams: {
      //     'P_BU_ID': $flow.variables.bu_id,
      //   },
      // });

      const response2 = await Actions.callRest(context, {
        endpoint: 'Oracle_Invoice_Backup_OIC/getIcApiOracleErrorEmails',
        uriParams: {
          
          'P_BU_ID': $flow.variables.bu_id,
        },
      });
    //  $variables.erroremail = response2.body.data.DESCRIPTION;
      $variables.erroremail = response2.body.DESCRIPTION;
    }
  }
  return SelectValueItemChangeChain1;
});