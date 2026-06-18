define([
  'vb/action/actionChain',
  'vb/action/actions',
], (
  ActionChain,
  Actions
) => {
  'use strict';

  class SaveButtonActionChain extends ActionChain {

    async run(context) {
      const { $page, $flow, $variables } = context;

      console.log('=== SAVE START ===');
      console.log('Selected indices:', $variables.selectedExpenditures);

      var selectedObjects = [];
      for (var i = 0; i < $variables.tableData.length; i++) {
        if ($variables.selectedExpenditures.indexOf(String(i)) !== -1) {
          selectedObjects.push($variables.tableData[i]);
        }
      }

      console.log('Selected objects:', selectedObjects.length);

      if (selectedObjects.length === 0) {
        await Actions.fireNotificationEvent(context, {
          summary: 'No Selection',
          message: 'Please select at least one expenditure item',
          displayMode: 'transient',
          type: 'warning',
        });
        return;
      }

      try {
        try {
          var delResponse = await Actions.callRest(context, {
            endpoint: 'getContractSelections/deleteOrdsConvertriteContractSelectionsContractSelection',
            uriParams: { 'project_id': $flow.variables.project_id },
          });
          console.log('DELETE success:', delResponse);
        } catch (delErr) {
          console.log('Delete error:', delErr.message || delErr);
        }

        var payload = [];
        for (var j = 0; j < selectedObjects.length; j++) {
          var c = selectedObjects[j];
          payload.push({
            project_id: Number(c.projectId || 0),
            expenditure_item_id: Number(c.expenditureItemId || 0),
            project_number: String(c.projectNumber || ''),
            project_name: String(c.projectName || ''),
            contract_number: String(c.contractNumber || ''),
            contract_line_num: '',
            line_amount: 0,
            invoiced_amount: 0,
            attribute_number5: 0,
            ap_invoice_number: String(c.apInvoiceNumber || ''),
            source: String(c.source || ''),
            expenditure_item_date: String(c.expenditureItemDate || ''),
            expenditure_type_id: Number(c.expenditureTypeId || 0),
            bill_type_class_code: String(c.billTypeClassCode || ''),
            billable_flag: String(c.billableFlag || ''),
            user_transaction_source: String(c.userTransactionSource || ''),
            id_at_cntr_table: Number(c.idAtCntrTable || 0),
            expenditure_type_name: String(c.expenditureTypeName || ''),
            description: String(c.description || ''),
            rec_id: 0,
            line_id: 0,
            line_puid: '',
            ap_invoice_id: Number(c.apInvoiceId || 0),
            task_id: Number(c.taskId || 0),
            task_number: String(c.taskNumber || ''),
            task_name: String(c.taskName || ''),
            quantity: Number(c.quantity || 0),
            projfunc_raw_cost: Number(c.projfuncRawCost || 0),
            raw_cost_rate: Number(c.rawCostRate || 0),
            projfunc_burdened_cost: Number(c.projfuncBurdenedCost || 0),
            burden_cost_rate: Number(c.burdenCostRate || 0),
            invoiced_flag: String(c.invoicedFlag || ''),
            org_id: Number(c.orgId || 0),
            project_unit_id: Number(c.projectUnitId || 0),
            project_raw_cost: Number(c.projectRawCost || 0),
            unit_of_measure: String(c.unitOfMeasure || ''),
            expenditure_organization_id: Number(c.expenditureOrganizationId || 0),
            project_burdened_cost: Number(c.projectBurdenedCost || 0),
            attachment_file_name: String(c.attachmentFileName || ''),
            dm_document_id: String(c.dmDocumentId || ''),
            dm_version_number: String(c.dmVersionNumber || ''),
            attached_document_id: Number(c.attachedDocumentId || 0),
            attachment_entity: String(c.attachmentEntity || ''),
            user_batch_name: String(c.userBatchName || ''),
            system_linkage_function: String(c.systemLinkageFunction || ''),
            invoiced_percentage: Number(c.invoicedPercentage || 0),
            labor_rate_type_code: String(c.laborRateTypeCode || '')
          });
        }

        console.log('PAYLOAD JSON:', JSON.stringify(payload));

        await Actions.callRest(context, {
          endpoint: 'getContractSelections/postOrdsConvertriteContractSelectionsBatch',
          body: payload,
        });

        await Actions.fireNotificationEvent(context, {
          summary: 'Saved',
          message: selectedObjects.length + ' item(s) saved successfully',
          displayMode: 'transient',
          type: 'confirmation',
        });

      } catch (error) {
        console.error('Save failed:', error);
        await Actions.fireNotificationEvent(context, {
          summary: 'Save Failed',
          message: 'Error: ' + (error.message || 'Unknown error'),
          displayMode: 'transient',
          type: 'error',
        });
      }
    }
  }

  return SaveButtonActionChain;
});