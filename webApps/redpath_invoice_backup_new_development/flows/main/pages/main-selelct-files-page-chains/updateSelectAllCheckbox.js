define([
  'vb/action/actionChain',
  'vb/action/actions',
], (
  ActionChain,
  Actions
) => {
  'use strict';

  class UpdateSelectAllCheckbox extends ActionChain {

    async run(context) {
      const { $page, $variables } = context;
      
      const isChecked = $variables.selectAllArray && $variables.selectAllArray.length > 0;
      
      console.log('Select All changed:', isChecked);
      
      if (isChecked) {
        $variables.selectedContracts = $variables.tableData.map(c => String(c.contract_id));
      } else {
        $variables.selectedContracts = [];
      }
      
      console.log('Selected contracts:', $variables.selectedContracts);
    }
  }

  return UpdateSelectAllCheckbox;
});