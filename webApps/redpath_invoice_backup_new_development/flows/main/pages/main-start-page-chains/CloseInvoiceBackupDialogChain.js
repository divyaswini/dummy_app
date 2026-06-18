define([
  'vb/action/actionChain',
  'vb/action/actions',
], (
  ActionChain,
  Actions
) => {
  'use strict';
  class CloseInvoiceBackupDialogChain extends ActionChain {
    async run(context) {
      document.getElementById('invoiceBackupSuccessDialog').close();
    }
  }
  return CloseInvoiceBackupDialogChain;
});