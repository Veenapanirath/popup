
export type Booking = {
  id: number;
  full_name: string;
  age: number;
  email: string;
  phone: string;
  gender: string;
  vehicle: string;
  booking_date: string;
  location: string;
};

export type VehicleFormData = {
  fullName: string;
  age: string;
  email: string;
  phone: string;
  gender: string;
  vehicle: string;
  bookingDate: string;
  location: string;
};

export type Page = "vehicle" | "customer" | "login";

export type PopupMode = "add" | "edit";
