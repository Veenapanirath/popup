import "./ConfirmationDialog.css";
type ConfirmationDialogProps = {
  onSaveAndContinue: () => void;
  onDiscard: () => void;
  onContinueEditing: () => void;
  isSaving?: boolean;
};

export default function ConfirmationDialog({
  onSaveAndContinue,
  onDiscard,
  onContinueEditing,
  isSaving = false,
}: ConfirmationDialogProps) {
  return (
    <div className="confirmation-overlay">
      <div
        className="confirmation-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmation-title"
      >
        <h3 id="confirmation-title">
          Unsaved Changes
        </h3>

        <p>
          You have unsaved changes. What would you like
          to do before continuing?
        </p>

        <div className="confirmation-actions">
          <button
            className="confirm-save"
            onClick={onSaveAndContinue}
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Changes & Continue"}
          </button>

          <button
            className="confirm-discard"
            onClick={onDiscard}
            disabled={isSaving}
          >
            Discard Changes
          </button>

          <button
            className="confirm-cancel"
            onClick={onContinueEditing}
            disabled={isSaving}
          >
            Continue Editing
          </button>
        </div>
      </div>
    </div>
  );
}
