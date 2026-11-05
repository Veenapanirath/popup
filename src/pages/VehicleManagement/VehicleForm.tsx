
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

type VehicleFormData = {
  fullName: string;
  age: string;
  email: string;
  phone: string;
  gender: string;
  vehicle: string;
  bookingDate: string;
  location: string;
};

type VehicleFormProps = {
  onSubmit?: (data: VehicleFormData) => void;
};

const formFields = [
  {
    label: "Full Name",
    name: "fullName",
    placeholder: "Enter full name",
    type: "text",
  },
  {
    label: "Age",
    name: "age",
    placeholder: "Enter age",
    type: "number",
  },
  {
    label: "Email",
    name: "email",
    placeholder: "Enter email",
    type: "email",
  },
  {
    label: "Phone Number",
    name: "phone",
    placeholder: "Enter phone number",
    type: "tel",
  },
  {
    label: "Booking Date",
    name: "bookingDate",
    placeholder: "",
    type: "date",
  },
  {
    label: "Location",
    name: "location",
    placeholder: "Enter location",
    type: "text",
  },
] as const;

export default function VehicleForm({ onSubmit }: VehicleFormProps) {
  const [formData, setFormData] = useState<VehicleFormData>({
    fullName: "",
    age: "",
    email: "",
    phone: "",
    gender: "",
    vehicle: "",
    bookingDate: "",
    location: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (onSubmit) {
      onSubmit(formData);
    } else {
      console.log("Submitted details:", formData);
      alert("Details submitted successfully!");
    }
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
              required
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
          >
            <option value="">Select vehicle</option>
            <option value="Mustang">Ford Mustang</option>
            <option value="Endeavour">Ford Endeavour</option>
            <option value="EcoSport">Ford EcoSport</option>
          </select>
        </div>
      </div>

      <div className="form-actions">
        <button
          type="reset"
          className="cancel-button"
          onClick={() =>
            setFormData({
              fullName: "",
              age: "",
              email: "",
              phone: "",
              gender: "",
              vehicle: "",
              bookingDate: "",
              location: "",
            })
          }
        >
          Reset
        </button>

        <button type="submit" className="save-button">
          Save Details
        </button>
      </div>
    </form>
  );
}
