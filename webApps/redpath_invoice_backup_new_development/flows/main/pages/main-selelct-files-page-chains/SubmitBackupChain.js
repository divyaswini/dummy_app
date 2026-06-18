define([
  'vb/action/actionChain',
  'vb/action/actions',
], (
  ActionChain,
  Actions
) => {
  'use strict';

  class SubmitBackupChain extends ActionChain {

    async run(context) {
      const { $page, $flow, $variables } = context;

      console.log('=== SUBMIT BACKUP START ===');

      if (!$variables.ordsData || $variables.ordsData.length === 0) {
        await Actions.fireNotificationEvent(context, {
          summary: 'No Saved Data',
          message: 'Please save your expenditure selections first before submitting backup.',
          displayMode: 'transient',
          type: 'warning',
        });
        return;
      }

      var projectNumber = '';
      var projectName = '';
      if ($variables.tableData && $variables.tableData.length > 0) {
        projectNumber = $variables.tableData[0].projectNumber || '';
        projectName = $variables.tableData[0].projectName || '';
      }

      var payload = {
        project_id: String($flow.variables.project_id),
        project_number: projectNumber,
        project_name: projectName,
        email: String($flow.variables.email || ''),
        error_email: '',
        exp_source: String($flow.variables.user_transaction_source || ''),
        exp_type: String($flow.variables.expenditure_type_name || ''),
        exp_from_date: String($flow.variables.exp_from_date || ''),
        exp_to_date: String($flow.variables.exp_to_date || '')
      };

      console.log('BACKUP PAYLOAD:', JSON.stringify(payload));

// Show loading dialog
document.getElementById('loadingDialog').open();

try {
  var response = await Actions.callRest(context, {
    endpoint: 'postBackupAttachments/postBackup_attachments',
    body: payload,
  });

  console.log('Backup response:', response);

  // Close loading, open success
  document.getElementById('loadingDialog').close();
  document.getElementById('submitSuccessDialog').open();

} catch (error) {
  console.error('Backup submit failed:', error);

  try { document.getElementById('loadingDialog').close(); } catch (e) {}

  await Actions.fireNotificationEvent(context, {
    summary: 'Backup Failed',
    message: 'Error starting backup: ' + (error.message || 'Unknown error'),
    displayMode: 'persist',
    type: 'error',
  });
}
    }
  }

  return SubmitBackupChain;
});