define([
  'vb/action/actionChain',
  'vb/action/actions',
], (
  ActionChain,
  Actions
) => {
  'use strict';

  class ContractCheckboxChanged extends ActionChain {

    async run(context, params) {
      const { $page, $variables } = context;

      console.log('=== CONTRACT CHECKBOX CHANGED ===');
      console.log('selectedContracts:', JSON.stringify($variables.selectedContracts));
      console.log('Count:', $variables.selectedContracts.length);
      console.log('tableData count:', $variables.tableData.length);

      // Sync Select All checkbox
      if ($variables.selectedContracts.length === $variables.tableData.length) {
        $variables.selectAllArray = ["all"];
      } else {
        $variables.selectAllArray = [];
      }
    }
  }

  return ContractCheckboxChanged;
});