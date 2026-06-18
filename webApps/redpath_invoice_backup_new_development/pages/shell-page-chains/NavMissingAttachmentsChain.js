define(['vb/action/actionChain', 'vb/action/actions'], (ActionChain, Actions) => {
  'use strict';
  class NavMissingAttachmentsChain extends ActionChain {
    async run(context) {
      context.$application.variables.sidebar = false;
      // Replace with your actual BIP report URL
      window.open('https://fa-etao-dev20-saasfademo1.ds-fa.oraclepdemos.com/analytics/saw.dll?bipublisherEntry&Action=open&itemType=.xdo&bipPath=%2FCustom%2FInvoice_Backup%2FRED%20Path%2FInvoice%20Backup%20Missing%20and%20Unsupported%20Attachments.xdo&path=%2Fshared%2FCustom%2FInvoice_Backup%2FRED%20Path%2FInvoice%20Backup%20Missing%20and%20Unsupported%20Attachments.xdo', '_blank');
    }
  }
  return NavMissingAttachmentsChain;
});