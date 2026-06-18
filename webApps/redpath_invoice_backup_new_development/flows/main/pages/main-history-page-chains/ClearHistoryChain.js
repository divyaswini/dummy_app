define([
  'vb/action/actionChain',
  'vb/action/actions',
], (
  ActionChain,
  Actions
) => {
  'use strict';
  class ClearHistoryChain extends ActionChain {
    async run(context) {
      const { $page, $variables } = context;
      $variables.bu_id = null;
      $variables.project_id = null;
      $variables.lovProjects = { data: [] };
      $variables.historyData = [];
      $variables.paginatedHistory = [];
      $variables.currentPage = 1;
      $variables.hasSearched = false;
      $variables.isLoading = false;
    }
  }
  return ClearHistoryChain;
});