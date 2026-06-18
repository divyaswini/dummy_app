define([
  'vb/action/actionChain',
  'vb/action/actions',
], (
  ActionChain,
  Actions
) => {
  'use strict';
  class PaginationChain extends ActionChain {
    async run(context, params) {
      const { $page } = context;
      var direction = params.direction || 'first';
      var data = $page.variables.filteredData || [];
      var perPage = $page.variables.rowsPerPage || 15;
      var totalPages = Math.max(1, Math.ceil(data.length / perPage));
      var current = $page.variables.currentPage || 1;

      if (direction === 'next') {
        current = Math.min(current + 1, totalPages);
      } else if (direction === 'prev') {
        current = Math.max(current - 1, 1);
      } else if (direction === 'first') {
        current = 1;
      } else if (direction === 'last') {
        current = totalPages;
      }

      $page.variables.currentPage = current;

      var startIdx = (current - 1) * perPage;
      var endIdx = Math.min(startIdx + perPage, data.length);
      $page.variables.paginatedData = data.slice(startIdx, endIdx);
    }
  }
  return PaginationChain;
});