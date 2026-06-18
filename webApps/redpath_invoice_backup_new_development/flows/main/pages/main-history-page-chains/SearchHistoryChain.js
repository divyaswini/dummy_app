define([
  'vb/action/actionChain',
  'vb/action/actions',
], (
  ActionChain,
  Actions
) => {
  'use strict';

  class SearchHistoryChain extends ActionChain {

    async run(context) {
      const { $page, $variables } = context;

      if (!$variables.project_id) {
        await Actions.fireNotificationEvent(context, {
          summary: 'Missing Project',
          message: 'Please select a project first.',
          displayMode: 'transient',
          type: 'warning',
        });
        return;
      }

      $variables.isLoading = true;
      $variables.hasSearched = true;

      try {
        const response2 = await Actions.callRest(context, {
          endpoint: 'getContractSelections/getOrdsConvertriteConvertriteBackupHistory',
          uriParams: {
            'project_id': $variables.project_id,
          },
        });

        var items = response2.body.items || [];
        console.log('History items:', items.length);

        // Format created_date for display
        var formatted = [];
        for (var i = 0; i < items.length; i++) {
          var row = items[i];
          var createdDate = row.created_date || '';
          
          // Format timestamp to readable date
          if (createdDate) {
            try {
              var d = new Date(createdDate);
              if (!isNaN(d.getTime())) {
                createdDate = d.toLocaleString();
              }
            } catch (e) {
              // keep original
            }
          }

          formatted.push({
            version: row.version || '',
            project_name: row.project_name || '',
            exp_source: row.exp_source || '',
exp_type: row.exp_type || '',
exp_type_list: row.exp_type ? row.exp_type.split(',').map(function(s){return s.trim()}).filter(function(s){return s.length > 0}) : [],
batch_names: row.batch_names || '',
batch_names_list: row.batch_names ? row.batch_names.split(',').map(function(s){return s.trim()}).filter(function(s){return s.length > 0}) : [],
            exp_from_date: row.exp_from_date || '',
            exp_to_date: row.exp_to_date || '',
            ucm_document_id: row.ucm_document_id || '',
            created_date: createdDate
          });
        }

$variables.historyData = formatted;
$variables.currentPage = 1;
var perPage = $variables.rowsPerPage || 10;
$variables.paginatedHistory = formatted.slice(0, perPage);
      } catch (error) {
        console.error('History fetch error:', error);
        $variables.historyData = [];
        await Actions.fireNotificationEvent(context, {
          summary: 'Error',
          message: 'Failed to fetch backup history.',
          displayMode: 'transient',
          type: 'error',
        });
      }

      $variables.isLoading = false;
    }
  }

  return SearchHistoryChain;
});