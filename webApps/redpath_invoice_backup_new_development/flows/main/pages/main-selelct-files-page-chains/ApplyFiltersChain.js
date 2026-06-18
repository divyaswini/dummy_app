define([
  'vb/action/actionChain',
  'vb/action/actions',
], (
  ActionChain,
  Actions
) => {
  'use strict';

  class ApplyFiltersChain extends ActionChain {

    async run(context) {
      const { $page, $variables } = context;

      var filters = $variables.filters;
      var result = [];

      for (var i = 0; i < $variables.tableData.length; i++) {
        var row = $variables.tableData[i];
        var match = true;

        if (filters.contractNumber && String(row.contractNumber || '').toLowerCase().indexOf(filters.contractNumber.toLowerCase()) === -1) { match = false; }
        if (match && filters.expenditureItemId && String(row.expenditureItemId || '').toLowerCase().indexOf(filters.expenditureItemId.toLowerCase()) === -1) { match = false; }
        if (match && filters.apInvoiceNumber && String(row.apInvoiceNumber || '').toLowerCase().indexOf(filters.apInvoiceNumber.toLowerCase()) === -1) { match = false; }
        if (match && filters.userBatchName && String(row.userBatchName || '').toLowerCase().indexOf(filters.userBatchName.toLowerCase()) === -1) { match = false; }
        if (match && filters.userTransactionSource && String(row.userTransactionSource || '').toLowerCase().indexOf(filters.userTransactionSource.toLowerCase()) === -1) { match = false; }
        if (match && filters.expenditureTypeName && String(row.expenditureTypeName || '').toLowerCase().indexOf(filters.expenditureTypeName.toLowerCase()) === -1) { match = false; }
        if (match && filters.expenditureItemDate && String(row.expenditureItemDate || '').toLowerCase().indexOf(filters.expenditureItemDate.toLowerCase()) === -1) { match = false; }
        if (match && filters.billableFlag && String(row.billableFlag || '').toLowerCase().indexOf(filters.billableFlag.toLowerCase()) === -1) { match = false; }
        if (match && filters.systemLinkageFunction && String(row.systemLinkageFunction || '').toLowerCase().indexOf(filters.systemLinkageFunction.toLowerCase()) === -1) { match = false; }
        if (match && filters.taskNumber && String(row.taskNumber || '').toLowerCase().indexOf(filters.taskNumber.toLowerCase()) === -1) { match = false; }
        if (match && filters.quantity && String(row.quantity || '').toLowerCase().indexOf(filters.quantity.toLowerCase()) === -1) { match = false; }
        if (match && filters.projfuncRawCost && String(row.projfuncRawCost || '').toLowerCase().indexOf(filters.projfuncRawCost.toLowerCase()) === -1) { match = false; }
        if (match && filters.rawCostRate && String(row.rawCostRate || '').toLowerCase().indexOf(filters.rawCostRate.toLowerCase()) === -1) { match = false; }
        if (match && filters.projectRawCost && String(row.projectRawCost || '').toLowerCase().indexOf(filters.projectRawCost.toLowerCase()) === -1) { match = false; }
        if (match && filters.projfuncBurdenedCost && String(row.projfuncBurdenedCost || '').toLowerCase().indexOf(filters.projfuncBurdenedCost.toLowerCase()) === -1) { match = false; }
        if (match && filters.projectBurdenedCost && String(row.projectBurdenedCost || '').toLowerCase().indexOf(filters.projectBurdenedCost.toLowerCase()) === -1) { match = false; }
        if (match && filters.burdenCostRate && String(row.burdenCostRate || '').toLowerCase().indexOf(filters.burdenCostRate.toLowerCase()) === -1) { match = false; }
        if (match && filters.invoicedFlag && String(row.invoicedFlag || '').toLowerCase().indexOf(filters.invoicedFlag.toLowerCase()) === -1) { match = false; }
        if (match && filters.invoicedPercentage && String(row.invoicedPercentage || '').toLowerCase().indexOf(filters.invoicedPercentage.toLowerCase()) === -1) { match = false; }
        if (match && filters.attachmentFileName && String(row.attachmentFileName || '').toLowerCase().indexOf(filters.attachmentFileName.toLowerCase()) === -1) { match = false; }
        if (match && filters.dmDocumentId && String(row.dmDocumentId || '').toLowerCase().indexOf(filters.dmDocumentId.toLowerCase()) === -1) { match = false; }

        if (match) {
          result.push(row);
        }
      }

      $variables.filteredData = result;
      console.log('Filtered:', result.length, 'of', $variables.tableData.length);
      $variables.currentPage = 1;
var perPage = $variables.rowsPerPage || 15;
$variables.paginatedData = result.slice(0, perPage);
    }
  }

  return ApplyFiltersChain;
});