
import type { Request, Response } from "express";
import pool from "../config/db.js";


export const getBookings = async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(
      "SELECT * FROM vehicle_bookings ORDER BY id DESC"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};


export const getBookingById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ message: "Invalid booking ID" });
      return;
    }

    const result = await pool.query(
      "SELECT * FROM vehicle_bookings WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch booking" });
  }
};


export const createBooking = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      age,
      email,
      phone,
      gender,
      vehicle,
      bookingDate,
      location,
    } = req.body;

    if (
      !fullName || !age || !email || !phone ||
      !gender || !vehicle || !bookingDate || !location
    ) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const result = await pool.query(
      `INSERT INTO vehicle_bookings
      (full_name, age, email, phone, gender, vehicle, booking_date, location)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [
        fullName,
        Number(age),
        email,
        phone,
        gender,
        vehicle,
        bookingDate,
        location,
      ]
    );

    res.status(201).json({
      message: "Booking created successfully",
      booking: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ message: "Invalid booking ID" });
      return;
    }

    const {
      fullName,
      age,
      email,
      phone,
      gender,
      vehicle,
      bookingDate,
      location,
    } = req.body;

    if (
      !fullName || !age || !email || !phone ||
      !gender || !vehicle || !bookingDate || !location
    ) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const result = await pool.query(
      `UPDATE vehicle_bookings
       SET full_name = $1,
           age = $2,
           email = $3,
           phone = $4,
           gender = $5,
           vehicle = $6,
           booking_date = $7,
           location = $8,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [
        fullName,
        Number(age),
        email,
        phone,
        gender,
        vehicle,
        bookingDate,
        location,
        id,
      ]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    res.status(200).json({
      message: "Booking updated successfully",
      booking: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update booking" });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ message: "Invalid booking ID" });
      return;
    }

    const result = await pool.query(
      "DELETE FROM vehicle_bookings WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: "Booking not found" });
      return;
    }

    res.status(200).json({
      message: "Booking deleted successfully",
      booking: result.rows[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete booking" });
  }
};
