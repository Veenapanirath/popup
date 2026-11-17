
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { DraggablePopup } from "../../components/DraggablePopup";
import ConfirmationDialog from "../../components/ConfirmationDialog/ConfirmationDialog";

import VehicleForm from "./VehicleForm";
import VehicleTable from "./VehicleTable";

import type {
  Booking,
  VehicleFormData,
  PopupMode,
  Page,
} from "../../types/booking";

import {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../../services/bookingApi";

type PendingAction =
  | { type: "add" }
  | { type: "edit"; booking: Booking }
  | { type: "close" }
  | { type: "navigate"; page: Page }
  | null;

type VehiclePageProps = {
  onNavigate: (page: Page) => void;
  onRegisterNavigationHandler: (
    handler: (page: Page) => void
  ) => void;
};

export default function VehiclePage({
  onNavigate,
  onRegisterNavigationHandler,
}: VehiclePageProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] =
    useState<Booking | null>(null);

  const [popupMode, setPopupMode] = useState<PopupMode>("add");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [isDirty, setIsDirty] = useState(false);
  const [currentFormData, setCurrentFormData] =
    useState<VehicleFormData | null>(null);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] =
    useState<PendingAction>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [tableError, setTableError] = useState("");
  const [formError, setFormError] = useState("");

  const initialFormData = useMemo<VehicleFormData | null>(() => {
    if (!selectedBooking) {
      return null;
    }

    return {
      fullName: selectedBooking.full_name,
      age: String(selectedBooking.age),
      email: selectedBooking.email,
      phone: selectedBooking.phone,
      gender: selectedBooking.gender,
      vehicle: selectedBooking.vehicle,
      bookingDate: selectedBooking.booking_date.slice(0, 10),
      location: selectedBooking.location,
    };
  }, [selectedBooking]);

  const loadBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      setTableError("");

      const data = await getBookings();
      setBookings(data as Booking[]);
    } catch (error) {
      console.error("Error loading bookings:", error);

      setTableError(
        "Unable to load bookings. Please check your backend."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  const handleFormStateChange = useCallback(
    (dirty: boolean, data: VehicleFormData) => {
      setIsDirty(dirty);
      setCurrentFormData(data);
    },
    []
  );
  const saveCurrentBooking = async (
    data: VehicleFormData
  ): Promise<boolean> => {
    try {
      setIsSaving(true);
      setFormError("");

      if (popupMode === "add") {
        await createBooking(data);
      } else if (selectedBooking) {
        await updateBooking(selectedBooking.id, data);
      } else {
        throw new Error("No booking selected for update.");
      }

      await loadBookings();

      setIsDirty(false);
      return true;
    } catch (error) {
      console.error("Error saving booking:", error);

      setFormError(
        "Unable to save booking. Please check your details and try again."
      );

      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const executePendingAction = useCallback(
    (action: PendingAction) => {
      if (!action) return;

      setShowConfirmation(false);
      setPendingAction(null);
      setFormError("");
      setIsDirty(false);
      setCurrentFormData(null);

      if (action.type === "add") {
        setPopupMode("add");
        setSelectedBooking(null);
        setIsPopupOpen(true);
      } else if (action.type === "edit") {
        setPopupMode("edit");
        setSelectedBooking(action.booking);
        setIsPopupOpen(true);
      } else if (action.type === "close") {
        setIsPopupOpen(false);
        setSelectedBooking(null);
      } else if (action.type === "navigate") {
        onNavigate(action.page);
      }
    },
    [onNavigate]
  );

  const requestAction = useCallback(
    (action: PendingAction) => {
      if (!action) return;

      if (isPopupOpen && isDirty) {
        setPendingAction(action);
        setShowConfirmation(true);
        return;
      }

      executePendingAction(action);
    },
    [isPopupOpen, isDirty, executePendingAction]
  );

  const openAddBooking = () => {
    requestAction({ type: "add" });
  };


  const openEditBooking = (booking: Booking) => {
    requestAction({
      type: "edit",
      booking,
    });
  };


  const closePopup = () => {
    if (isSaving) return;

    requestAction({ type: "close" });
  };

  const handleNavigationRequest = useCallback(
    (page: Page) => {
      requestAction({
        type: "navigate",
        page,
      });
    },
    [requestAction]
  );
  useEffect(() => {
    onRegisterNavigationHandler(handleNavigationRequest);
  }, [handleNavigationRequest, onRegisterNavigationHandler]);

  
  const handleFormSubmit = async (data: VehicleFormData) => {
    const saved = await saveCurrentBooking(data);

    if (!saved) return;

    alert(
      popupMode === "add"
        ? "Booking added successfully!"
        : "Booking updated successfully!"
    );

    executePendingAction({ type: "close" });
  };

  const handleSaveAndContinue = async () => {
    if (!currentFormData || !pendingAction) return;

    const actionToPerform = pendingAction;

    const saved = await saveCurrentBooking(currentFormData);

    if (!saved) {
      // Keep the dialog and form open if saving fails.
      return;
    }

    alert(
      popupMode === "add"
        ? "Booking added successfully!"
        : "Booking updated successfully!"
    );

    executePendingAction(actionToPerform);
  };
  const handleDiscard = () => {
    executePendingAction(pendingAction);
  };


  const handleContinueEditing = () => {
    setShowConfirmation(false);
    setPendingAction(null);
  };

  
  const handleDeleteBooking = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?"
    );

    if (!confirmed) return;

    try {
      await deleteBooking(id);

      alert("Booking deleted successfully!");

      await loadBookings();
    } catch (error) {
      console.error("Error deleting booking:", error);

      alert("Unable to delete booking. Please try again.");
    }
  };

  const popupTitle =
    popupMode === "add"
      ? "Add Vehicle Booking"
      : "Edit Vehicle Booking";

  return (
    <>
      <div className="section-heading">
        <div>
          <h3>Vehicle Bookings</h3>
          <p>View and manage bookings saved in the database.</p>
        </div>

        <button className="add-button" onClick={openAddBooking}>
          + Add Booking
        </button>
      </div>

      <VehicleTable
        bookings={bookings}
        isLoading={isLoading}
        error={tableError}
        onEdit={openEditBooking}
        onDelete={handleDeleteBooking}
      />

      <div className="background-card">
        <h3>Additional Information</h3>

        <p>
          This page represents the content behind the popup.
          It should remain interactive while the popup is open.
        </p>

        <button
          onClick={() => alert("Background interaction works!")}
        >
          Test Background Interaction
        </button>
      </div>

      {isPopupOpen && (
        <DraggablePopup
          title={popupTitle}
          onClose={closePopup}
        >
          <VehicleForm
            key={`${popupMode}-${selectedBooking?.id ?? "new"}`}
            mode={popupMode}
            initialData={initialFormData}
            onSubmit={handleFormSubmit}
            onDirtyChange={handleFormStateChange}
            isSaving={isSaving}
            error={formError}
          />
        </DraggablePopup>
      )}

      {showConfirmation && (
        <ConfirmationDialog
          onSaveAndContinue={handleSaveAndContinue}
          onDiscard={handleDiscard}
          onContinueEditing={handleContinueEditing}
          isSaving={isSaving}
        />
      )}
    </>
  );
}
