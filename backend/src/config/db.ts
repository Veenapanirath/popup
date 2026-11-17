
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});


export const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS vehicle_bookings (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        age SMALLINT NOT NULL CHECK (age BETWEEN 1 AND 120),
        email VARCHAR(150) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        gender VARCHAR(20) NOT NULL,
        vehicle VARCHAR(50) NOT NULL,
        booking_date DATE NOT NULL,
        location VARCHAR(150) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Vehicle bookings table is ready!");
  } catch (error) {
    console.error("Error creating table:", error);
    throw error;
  }
};

export default pool;
