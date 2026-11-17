
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/bookings",
});

export const getBookings = async () => {
  const response = await API.get("/");
  return response.data;
};


export const getBookingById = async (id: number) => {
  const response = await API.get(`/${id}`);
  return response.data;
};


export const createBooking = async (bookingData: object) => {
  const response = await API.post("/", bookingData);
  return response.data;
};


export const updateBooking = async (
  id: number,
  bookingData: object
) => {
  const response = await API.put(`/${id}`, bookingData);
  return response.data;
};


export const deleteBooking = async (id: number) => {
  const response = await API.delete(`/${id}`);
  return response.data;
};
