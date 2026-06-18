define([
  'vb/action/actionChain',
  'vb/action/actions',
], (
  ActionChain,
  Actions
) => {
  'use strict';

  class SelectAllChanged extends ActionChain {
    async run(context) {
      const { $page, $variables } = context;

      if ($variables.skipSelectAll) {
        console.log('Skipping SelectAllChanged during load');
        return;
      }

      var isChecked = $variables.selectAllArray && $variables.selectAllArray.length > 0;
      if (isChecked) {
        var allIds = [];
        for (var i = 0; i < $variables.filteredData.length; i++) {
          allIds.push($variables.filteredData[i]._rowIndex);
        }
        $variables.selectedExpenditures = allIds;
      } else {
        $variables.selectedExpenditures = [];
      }
      console.log('Select All:', isChecked, 'Count:', $variables.selectedExpenditures.length);
    }
  }
  return SelectAllChanged;
});