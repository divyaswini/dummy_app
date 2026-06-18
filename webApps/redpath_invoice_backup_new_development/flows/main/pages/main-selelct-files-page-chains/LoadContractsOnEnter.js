define([
  'vb/action/actionChain',
  'vb/action/actions',
], (
  ActionChain,
  Actions
) => {
  'use strict';

  class LoadContractsOnEnter extends ActionChain {

    async run(context) {
      const { $page, $flow, $variables } = context;

      if (!$flow.variables.bu_id || !$flow.variables.project_id) {
        await Actions.navigateToPage(context, { page: 'main-start' });
        return;
      }

      try {
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
            'P_PROJECT_ID': $flow.variables.project_id,
          },
        });

       // $variables.tableData = response.body.data.Contracts || [];
        $variables.tableData = response.body.Contracts || [];
        console.log('Loaded contracts:', $variables.tableData.length);

        // Load saved selections from ORDS
        try {
          const response2 = await Actions.callRest(context, {
            endpoint: 'getContractSelections/getOrdsConvertriteContractSelectionsContractSelection',
            uriParams: {
              'business_unit': String($flow.variables.bu_id),
              'project_id': String($flow.variables.project_id),
            },
          });

          var savedItems = response2.body.items || [];
          console.log('ORDS saved items:', savedItems.length);

          var savedIds = [];
          for (var i = 0; i < savedItems.length; i++) {
            savedIds.push(String(savedItems[i].contract_id));
          }
          $variables.selectedContracts = savedIds;

          // Sync select all
          if (savedIds.length === $variables.tableData.length && $variables.tableData.length > 0) {
            $variables.selectAllArray = ["all"];
          } else {
            $variables.selectAllArray = [];
          }

          console.log('Pre-selected:', JSON.stringify($variables.selectedContracts));

        } catch (ordsError) {
          console.log('No saved selections');
          $variables.selectedContracts = [];
          $variables.selectAllArray = [];
        }

      } catch (error) {
        console.error('Error:', error);
      }
    }
  }

  return LoadContractsOnEnter;
});