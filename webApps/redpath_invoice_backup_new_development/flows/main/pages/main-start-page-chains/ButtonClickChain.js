define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
], (
  ActionChain,
  Actions,
  ActionUtils
) => {
  'use strict';

  class ButtonClickChain extends ActionChain {

    async run(context, { event }) {
      const { $page, $flow, $variables } = context;

      // Convert date format from YYYY-MM-DD to MM-DD-YYYY
      function convertDate(isoDate) {
        if (!isoDate) return '';
        var parts = isoDate.split('-');
        if (parts.length === 3) return parts[1] + '-' + parts[2] + '-' + parts[0];
        return isoDate;
      }

      console.log('RAW dates:', $variables.expFromDate, $variables.expToDate);

      $flow.variables.exp_from_date = convertDate($variables.expFromDate || '');
      $flow.variables.exp_to_date = convertDate($variables.expToDate || '');

      if ($variables.selectedExpTypes && $variables.selectedExpTypes.length > 0) {
        $flow.variables.expenditure_type_name = $variables.selectedExpTypes.join(',');
      } else {
        $flow.variables.expenditure_type_name = '';
      }

      if ($variables.selectedExpSources && $variables.selectedExpSources.length > 0) {
        $flow.variables.user_transaction_source = $variables.selectedExpSources.join(',');
      } else {
        $flow.variables.user_transaction_source = '';
      }

      console.log('FLOW VARS:', $flow.variables.exp_from_date, $flow.variables.exp_to_date, $flow.variables.expenditure_type_name, $flow.variables.user_transaction_source);

      await Actions.navigateToPage(context, {
        page: 'main-selelct-files',
      });
    }
  }

  return ButtonClickChain;
});