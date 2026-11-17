
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { VehicleFormData } from "../../types/booking";

type VehicleFormProps = {
  mode: "add" | "edit";
  initialData?: VehicleFormData | null;
  onSubmit: (data: VehicleFormData) => Promise<void>;
  onDirtyChange: (isDirty: boolean, data: VehicleFormData) => void;
  isSaving?: boolean;
  error?: string;
};

const emptyForm: VehicleFormData = {
  fullName: "",
  age: "",
  email: "",
  phone: "",
  gender: "",
  vehicle: "",
  bookingDate: "",
  location: "",
};

const formFields = [
  { label: "Full Name", name: "fullName", placeholder: "Enter full name", type: "text" },
  { label: "Age", name: "age", placeholder: "Enter age", type: "number" },
  { label: "Email", name: "email", placeholder: "Enter email", type: "email" },
  { label: "Phone Number", name: "phone", placeholder: "Enter phone number", type: "tel" },
  { label: "Booking Date", name: "bookingDate", placeholder: "", type: "date" },
  { label: "Location", name: "location", placeholder: "Enter location", type: "text" },
] as const;

export default function VehicleForm({
  mode,
  initialData,
  onSubmit,
  onDirtyChange,
  isSaving = false,
  error,
}: VehicleFormProps) {
  const startingData = initialData ?? emptyForm;

  const [formData, setFormData] =
    useState<VehicleFormData>({ ...startingData });

  const [originalData, setOriginalData] =
    useState<VehicleFormData>({ ...startingData });

  // Compare current form data with the original data.
  useEffect(() => {
    const hasChanges =
      JSON.stringify(formData) !== JSON.stringify(originalData);

    onDirtyChange(hasChanges, formData);
  }, [formData, originalData, onDirtyChange]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleReset = () => {
    const resetData = { ...originalData };
    setFormData(resetData);
    onDirtyChange(false, resetData);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form className="vehicle-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        {formFields.map((field) => (
          <div className="form-group" key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>

            <input
              id={field.name}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.name]}
              onChange={handleChange}
              min={field.name === "age" ? 1 : undefined}
              max={field.name === "age" ? 120 : undefined}
              required
              disabled={isSaving}
            />
          </div>
        ))}

        <div className="form-group">
          <label htmlFor="gender">Gender</label>

          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            disabled={isSaving}
          >
            <option value="">Select gender</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="vehicle">Vehicle Model</label>

          <select
            id="vehicle"
            name="vehicle"
            value={formData.vehicle}
            onChange={handleChange}
            required
            disabled={isSaving}
          >
            <option value="">Select vehicle</option>
            <option value="Mustang">Ford Mustang</option>
            <option value="Endeavour">Ford Endeavour</option>
            <option value="EcoSport">Ford EcoSport</option>
          </select>
        </div>
      </div>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}

      <div className="form-actions">
        <button
          type="button"
          className="cancel-button"
          onClick={handleReset}
          disabled={isSaving}
        >
          Reset
        </button>

        <button
          type="submit"
          className="save-button"
          disabled={isSaving}
        >
          {isSaving
            ? "Saving..."
            : mode === "add"
              ? "Save Details"
              : "Update Details"}
        </button>
      </div>
    </form>
  );
}
