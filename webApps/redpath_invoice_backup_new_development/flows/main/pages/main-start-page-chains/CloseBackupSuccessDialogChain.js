define([
  'vb/action/actionChain',
  'vb/action/actions',
], (
  ActionChain,
  Actions
) => {
  'use strict';
  class CloseBackupSuccessDialogChain extends ActionChain {
    async run(context) {
      const { $page, $flow, $variables } = context;

      document.getElementById('backupSuccessDialog').close();

      // Reset all form values
      $flow.variables.bu_id = '';
      $flow.variables.project_id = '';
      $flow.variables.email = '';
      $variables.contract_id = '';
      $variables.ppmInvoicenumber = '';
      $variables.AR_Invoice_Number = '';
      $variables.selectedExpTypes = [];
      $variables.selectedExpSources = [];
      $variables.expFromDate = '';
      $variables.expToDate = '';
      $variables.erroremail = '';
      $variables.lovContractInvoices.data = [];
      $variables.lovArInvoices.data = [];
      $variables.lovProjects.data = [];
    }
  }
  return CloseBackupSuccessDialogChain;
});