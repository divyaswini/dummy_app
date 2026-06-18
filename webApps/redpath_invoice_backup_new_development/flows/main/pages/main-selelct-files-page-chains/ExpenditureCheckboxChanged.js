define([
  'vb/action/actionChain',
  'vb/action/actions',
], (
  ActionChain,
  Actions
) => {
  'use strict';

  class ExpenditureCheckboxChanged extends ActionChain {

    async run(context, params) {
      const { $page, $variables } = context;

      var selCount = $variables.selectedExpenditures ? $variables.selectedExpenditures.length : 0;
      var totalUniqueIds = {};
      for (var i = 0; i < $variables.tableData.length; i++) {
        totalUniqueIds[String($variables.tableData[i].expenditure_item_id)] = true;
      }
      var uniqueCount = Object.keys(totalUniqueIds).length;

      console.log('Checkbox changed. Selected:', selCount, 'Unique IDs:', uniqueCount);

      if (selCount === uniqueCount && uniqueCount > 0) {
        $variables.selectAllArray = ["all"];
      } else {
        $variables.selectAllArray = [];
      }
    }
  }

  return ExpenditureCheckboxChanged;
});