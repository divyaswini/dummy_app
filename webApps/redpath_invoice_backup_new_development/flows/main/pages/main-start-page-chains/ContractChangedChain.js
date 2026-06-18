define([
  'vb/action/actionChain',
  'vb/action/actions',
], (
  ActionChain,
  Actions
) => {
  'use strict';
  class ContractChangedChain extends ActionChain {
    async run(context, { value }) {
      const { $page, $flow, $variables } = context;

      $variables.ppmInvoicenumber = '';
      $variables.AR_Invoice_Number = '';

      let contractId = $variables.contract_id || '';
      console.log('Contract changed, contract_id:', contractId);

      if (!contractId) {
        $variables.lovContractInvoices.data = [];
        $variables.lovArInvoices.data = [];
        return;
      }

      try {
        // var contractInvResponse = await Actions.callRest(context, {
        //   endpoint: 'Databridge_Oracle_Invoice_Backup/getApiOracleLovContractInvoices',
        //   uriParams: {
        //     'P_CONTRACT_ID': contractId,
        //   },
        // });

        let contractInvResponse = await Actions.callRest(context, {
          endpoint: 'Oracle_Invoice_Backup_OIC/getIcApiOracleLovContractInvoices',
          uriParams: {
           
            'p_contract_id': contractId,
          },
        });
       // var ppmItems = contractInvResponse.body.data.PPMInvoices || [];
        let ppmItems = contractInvResponse.body.PPMInvoices || [];
        console.log('Contract invoices loaded:', ppmItems.length);
        $variables.lovContractInvoices.data = ppmItems;
      } catch (e) {
        console.log('Contract invoices fetch error:', e.message || e);
        $variables.lovContractInvoices.data = [];
      }

      try {
        // var arInvResponse = await Actions.callRest(context, {
        //   endpoint: 'Databridge_Oracle_Invoice_Backup/getApiOracleLovArInvoices',
        //   uriParams: {
        //     'P_CONTRACT_ID': contractId,
        //   },
        // });

        let arInvResponse = await Actions.callRest(context, {
          endpoint: 'Oracle_Invoice_Backup_OIC/getIcApiLovArInvoices',
          uriParams: {
            
            'p_contract_id': contractId,
          },
        });
        //var arItems = arInvResponse.body.data.ARInvoices || [];
        let arItems = arInvResponse.body.ARInvoices || [];
        console.log('AR invoices loaded:', arItems.length);
        $variables.lovArInvoices.data = arItems;
      } catch (e) {
        console.log('AR invoices fetch error:', e.message || e);
        $variables.lovArInvoices.data = [];
      }
    }
  }
  return ContractChangedChain;
});