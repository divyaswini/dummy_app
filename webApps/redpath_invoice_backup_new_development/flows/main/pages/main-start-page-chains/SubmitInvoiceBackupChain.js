define([
  'vb/action/actionChain',
  'vb/action/actions',
], (
  ActionChain,
  Actions
) => {
  'use strict';
  class SubmitInvoiceBackupChain extends ActionChain {
    async run(context) {
      const { $page, $flow, $variables } = context;

      var invoiceId = $variables.AR_Invoice_Number
        ? $variables.AR_Invoice_Number
        : ($variables.ppmInvoicenumber ? $variables.ppmInvoicenumber : null);

      if (!invoiceId) {
        await Actions.fireNotificationEvent(context, {
          summary: 'Missing Invoice',
          message: 'Please select a Contract Invoice Number or AR Invoice Number.',
          displayMode: 'transient',
          type: 'warning',
        });
        return;
      }

      console.log('=== SUBMIT INVOICE BACKUP ===');
      console.log('Invoice ID:', invoiceId);
      console.log('Project ID:', $flow.variables.project_id);
      console.log('Email:', $flow.variables.email);

      // Show loading dialog
      document.getElementById('loadingDialog').open();

      try {
// const response = await Actions.callRest(context, {
        //   endpoint: 'Databridge_Oracle_Invoice_Backup/getApiOracleTriggerInvoiceBackup2',
        //   uriParams: {
        //     'P_INVOICE_FORMAT_CODE': 'Standard',
        //     'P_INVOICE_ID': invoiceId,
        //     'P_LE_BANK_ACCOUNT_ID': '300000047314450',
        //     'P_PROJECT_ID': $flow.variables.project_id || '',
        //     'P_EMAIL': $flow.variables.email || '',
        //     'P_ERROR_EMAIL': '',
        //   },
        // });

        const response = await Actions.callRest(context, {
          endpoint: 'Oracle_Invoice_Backup_OIC/postIcApiTriggerInvoiceBackup',
          uriParams: {
            
            'P_ERROR_EMAIL': '',
            'P_INVOICE_FORMAT_CODE': 'Standard',
            'P_INVOICE_ID': invoiceId,
            'P_LE_BANK_ACCOUNT_ID': '300000047314450',
            'P_PROJECT_ID': $flow.variables.project_id || '',
            'P_VENDOR_ID': '',
            'Email': $flow.variables.email || '',
          },
        });

        if (!response.ok) {

                let errMsg =
                  response.body?.detail ||
                  response.body?.message ||
                  (typeof response.body === 'string' ? response.body : null) ||
                  response.statusText ||
                  'UnKnown API Error';

                throw new Error(errMsg);
              }


        console.log('Backup response:', response.body);

        // Close loading, open success
        document.getElementById('loadingDialog').close();
        document.getElementById('backupSuccessDialog').open();

        await Actions.resetVariables(context, {
          variables: [
            '$variables.AR_Invoice_Number',
            '$variables.ppmInvoicenumber',
          ],
        });

      } catch (error) {
        console.error('Invoice backup submit failed:', error);

        // Close loading dialog
        try { document.getElementById('loadingDialog').close(); } catch (e) {}

        await Actions.fireNotificationEvent(context, {
          summary: 'Backup Failed',
          message: 'Error submitting invoice backup: ' + (error.message || 'Unknown error'),
          displayMode: 'persist',
          type: 'error',
        });
      }
    }
  }
  return SubmitInvoiceBackupChain;
});