define([
  'vb/action/actionChain',
  'vb/action/actions',
], (
  ActionChain,
  Actions
) => {
  'use strict';

  class LoadExpendituresOnEnter extends ActionChain {

    async run(context) {
      const { $page, $flow, $variables ,data} = context;

      if (!$flow.variables.project_id) {
        await Actions.navigateToPage(context, { page: 'main-start' });
        return;
      }

      $variables.isLoading = true;
      $variables.skipSelectAll = true;

      try {
// var bipResponse = await Actions.callRest(context, {
//   endpoint: 'Databridge_Oracle_Invoice_Backup/getApiOracleLovInvoiceSearch',
//   uriParams: {
//     'PROJECT_ID': $flow.variables.project_id,
//     'EXP_ITEM_FROM_DATE': $flow.variables.exp_from_date || '',
//     'EXP_ITEM_TO_DATE': $flow.variables.exp_to_date || '',
//     'USER_TRANSACTION_SOURCE': $flow.variables.user_transaction_source || '',
//     'EXPENDITURE_TYPE_NAME': $flow.variables.expenditure_type_name || ''
//   },
// });

        var bipResponse = await Actions.callRest(context, {
          endpoint: 'Oracle_Invoice_Backup_OIC/getIcApiOracleLovInvoiceSearch',
          uriParams: {
            'EXPENDITURE_TYPE_NAME': $flow.variables.expenditure_type_name || '',
            'EXP_ITEM_FROM_DATE': $flow.variables.exp_from_date || '',
            'EXP_ITEM_TO_DATE': $flow.variables.exp_to_date || '',
            'PROJECT_ID': $flow.variables.project,
              //  'PROJECT_ID' :data.PROJECT_ID,
            'USER_TRANSACTION_SOURCE': $flow.variables.user_transaction_source || '',
          },
        });

       // var bipData = bipResponse.body.data.Projects || [];
        var bipData = bipResponse.body.Projects || [];
        console.log('BIP data loaded:', bipData.length);
        

        if (bipData.length > 0) {
$variables.projectDisplay = 'Project: ' + (bipData[0].PROJECT_NUMBER || '') + ' - ' + (bipData[0].PROJECT_NAME || '');        }

        var ordsItems = [];
        try {
          var ordsResponse = await Actions.callRest(context, {
            endpoint: 'getContractSelections/getOrdsConvertriteContractSelectionsContractSelection',
            uriParams: {
              'project_id': $flow.variables.project,
            },
          });
          ordsItems = ordsResponse.body.items || [];
          console.log('ORDS saved items:', ordsItems.length);
        } catch (ordsError) {
          console.log('No saved ORDS data');
          ordsItems = [];
        }

        $variables.ordsData = ordsItems;

        var ordsMap = {};
        for (var i = 0; i < ordsItems.length; i++) {
          var oKey = String(ordsItems[i].expenditure_item_id) + '|' + String(ordsItems[i].attached_document_id || '') + '|' + String(ordsItems[i].id_at_cntr_table || '');
          ordsMap[oKey] = ordsItems[i];
          console.log('ORDS key:', oKey);
        }

var fieldMap = [
          {bip: 'CONTRACT_NUMBER', ords: 'contract_number', display: 'contractNumber'},
          {bip: 'AP_INVOICE_NUMBER', ords: 'ap_invoice_number', display: 'apInvoiceNumber'},
          {bip: 'USER_TRANSACTION_SOURCE', ords: 'user_transaction_source', display: 'userTransactionSource'},
          {bip: 'EXPENDITURE_TYPE_NAME', ords: 'expenditure_type_name', display: 'expenditureTypeName'},
          {bip: 'EXPENDITURE_ITEM_DATE', ords: 'expenditure_item_date', display: 'expenditureItemDate'},
          {bip: 'BILLABLE_FLAG', ords: 'billable_flag', display: 'billableFlag'},
          {bip: 'USER_BATCH_NAME', ords: 'user_batch_name', display: 'userBatchName'},
          {bip: 'SYSTEM_LINKAGE_FUNCTION', ords: 'system_linkage_function', display: 'systemLinkageFunction'},
          {bip: 'TASK_NUMBER', ords: 'task_number', display: 'taskNumber'},
          {bip: 'QUANTITY', ords: 'quantity', display: 'quantity'},
          {bip: 'PROJFUNC_RAW_COST', ords: 'projfunc_raw_cost', display: 'projfuncRawCost'},
          {bip: 'RAW_COST_RATE', ords: 'raw_cost_rate', display: 'rawCostRate'},
          {bip: 'PROJECT_RAW_COST', ords: 'project_raw_cost', display: 'projectRawCost'},
          {bip: 'PROJFUNC_BURDENED_COST', ords: 'projfunc_burdened_cost', display: 'projfuncBurdenedCost'},
          {bip: 'PROJECT_BURDENED_COST', ords: 'project_burdened_cost', display: 'projectBurdenedCost'},
          {bip: 'BURDEN_COST_RATE', ords: 'burden_cost_rate', display: 'burdenCostRate'},
          {bip: 'INVOICED_FLAG', ords: 'invoiced_flag', display: 'invoicedFlag'},
          {bip: 'INVOICED_PERCENTAGE', ords: 'invoiced_percentage', display: 'invoicedPercentage'},
          {bip: 'ATTACHMENT_FILE_NAME', ords: 'attachment_file_name', display: 'attachmentFileName'},
          {bip: 'DM_DOCUMENT_ID', ords: 'dm_document_id', display: 'dmDocumentId'}
        ];

        var enrichedData = [];
        var preSelectedKeys = [];

for (var j = 0; j < bipData.length; j++) {
          var src = bipData[j];
          
          var compKey = String(src.EXPENDITURE_ITEM_ID || '') + '|' + String(src.ATTACHED_DOCUMENT_ID || '') + '|' + String(src.ID_AT_CNTR_TABLE || '');
          console.log('BIP key:', compKey);
          var ordsRow = ordsMap[compKey];

          var diffs = {};
          if (ordsRow) {
            preSelectedKeys.push(String(j));
            delete ordsMap[compKey];
            for (var f = 0; f < fieldMap.length; f++) {
              var rawBip = src[fieldMap[f].bip];
              var rawOrds = ordsRow[fieldMap[f].ords];
              var bipVal = (rawBip === null || rawBip === undefined || rawBip === '') ? '' : String(rawBip);
              var ordsVal = (rawOrds === null || rawOrds === undefined || rawOrds === '') ? '' : String(rawOrds);
              if (bipVal === '0' && ordsVal === '') ordsVal = '0';
              if (ordsVal === '0' && bipVal === '') bipVal = '0';
              diffs[fieldMap[f].display] = (bipVal !== ordsVal);
            }
          } else {
            for (var f2 = 0; f2 < fieldMap.length; f2++) {
              diffs[fieldMap[f2].display] = false;
            }
          }

          var bipRow = {
            _rowIndex: String(j),
            projectNumber: src.PROJECT_NUMBER || '',
            projectName: src.PROJECT_NAME || '',
            projectId: src.PROJECT_ID || '',
            contractNumber: src.CONTRACT_NUMBER || '',
            expenditureItemId: src.EXPENDITURE_ITEM_ID || '',
            apInvoiceNumber: src.AP_INVOICE_NUMBER || '',
            expenditureItemDate: src.EXPENDITURE_ITEM_DATE || '',
            billableFlag: src.BILLABLE_FLAG || '',
            userTransactionSource: src.USER_TRANSACTION_SOURCE || '',
            expenditureTypeName: src.EXPENDITURE_TYPE_NAME || '',
            taskNumber: src.TASK_NUMBER || '',
            taskName: src.TASK_NAME || '',
            projfuncRawCost: src.PROJFUNC_RAW_COST || '',
            rawCostRate: src.RAW_COST_RATE || '',
            projectRawCost: src.PROJECT_RAW_COST || '',
            projfuncBurdenedCost: src.PROJFUNC_BURDENED_COST || '',
            projectBurdenedCost: src.PROJECT_BURDENED_COST || '',
            burdenCostRate: src.BURDEN_COST_RATE || '',
            attachmentFileName: src.ATTACHMENT_FILE_NAME || '',
            attachmentEntity: src.ATTACHMENT_ENTITY || '',
            source: src.SOURCE || '',
            quantity: src.QUANTITY || '',
            expenditureTypeId: src.EXPENDITURE_TYPE_ID || '',
            billTypeClassCode: src.BILL_TYPE_CLASS_CODE || '',
            laborRateTypeCode: src.LABOR_RATE_TYPE_CODE || '',
            idAtCntrTable: src.ID_AT_CNTR_TABLE || '',
            description: src.DESCRIPTION || '',
            apInvoiceId: src.AP_INVOICE_ID || '',
            taskId: src.TASK_ID || '',
            invoicedFlag: src.INVOICED_FLAG || '',
            invoicedPercentage: src.INVOICED_PERCENTAGE || '',
            orgId: src.ORG_ID || '',
            projectUnitId: src.PROJECT_UNIT_ID || '',
            unitOfMeasure: src.UNIT_OF_MEASURE || '',
            expenditureOrganizationId: src.EXPENDITURE_ORGANIZATION_ID || '',
            attachedDocumentId: src.ATTACHED_DOCUMENT_ID || '',
            dmDocumentId: src.DM_DOCUMENT_ID || '',
            dmVersionNumber: src.DM_VERSION_NUMBER || '',
            contractLineNum: src.CONTRACT_LINE_NUM || '',
            lineAmount: src.LINE_AMOUNT || '',
            invoicedAmount: src.INVOICED_AMOUNT || '',
            attributeNumber5: src.ATTRIBUTE_NUMBER5 || '',
            userBatchName: src.USER_BATCH_NAME || '',
            systemLinkageFunction: src.SYSTEM_LINKAGE_FUNCTION || '',
            _diff_contractNumber: diffs.contractNumber || false,
            _diff_apInvoiceNumber: diffs.apInvoiceNumber || false,
            _diff_userTransactionSource: diffs.userTransactionSource || false,
            _diff_expenditureTypeName: diffs.expenditureTypeName || false,
            _diff_expenditureItemDate: diffs.expenditureItemDate || false,
            _diff_billableFlag: diffs.billableFlag || false,
            _diff_userBatchName: diffs.userBatchName || false,
            _diff_systemLinkageFunction: diffs.systemLinkageFunction || false,
            _diff_taskNumber: diffs.taskNumber || false,
            _diff_quantity: diffs.quantity || false,
            _diff_projfuncRawCost: diffs.projfuncRawCost || false,
            _diff_rawCostRate: diffs.rawCostRate || false,
            _diff_projectRawCost: diffs.projectRawCost || false,
            _diff_projfuncBurdenedCost: diffs.projfuncBurdenedCost || false,
            _diff_projectBurdenedCost: diffs.projectBurdenedCost || false,
            _diff_burdenCostRate: diffs.burdenCostRate || false,
            _diff_invoicedFlag: diffs.invoicedFlag || false,
            _diff_invoicedPercentage: diffs.invoicedPercentage || false,
            _diff_attachmentFileName: diffs.attachmentFileName || false,
            _diff_dmDocumentId: diffs.dmDocumentId || false
          };

          enrichedData.push(bipRow);
        }

        $variables.tableData = enrichedData;
        $variables.filteredData = enrichedData;
        $variables.selectedExpenditures = preSelectedKeys;

        if (preSelectedKeys.length === enrichedData.length && enrichedData.length > 0) {
          $variables.selectAllArray = ["all"];
        } else {
          $variables.selectAllArray = [];
        }

        console.log('Table ready:', enrichedData.length, 'Pre-selected:', preSelectedKeys.length);
        $variables.currentPage = 1;
var perPage = $variables.rowsPerPage || 15;
$variables.paginatedData = enrichedData.slice(0, perPage);

      } catch (error) {
        console.error('Load error:', error);
      }

      $variables.isLoading = false;
      $variables.skipSelectAll = false;
    }
  }

  return LoadExpendituresOnEnter;
});