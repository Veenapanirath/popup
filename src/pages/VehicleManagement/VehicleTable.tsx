
import type { Booking } from "../../types/booking";

type VehicleTableProps = {
  bookings: Booking[];
  isLoading: boolean;
  error: string;
  onEdit: (booking: Booking) => void;
  onDelete: (id: number) => void;
};

export default function VehicleTable({
  bookings,
  isLoading,
  error,
  onEdit,
  onDelete,
}: VehicleTableProps) {
  if (isLoading) {
    return <p>Loading bookings...</p>;
  }

  if (error) {
    return <p className="table-error">{error}</p>;
  }

  if (bookings.length === 0) {
    return <p>No bookings found. Add your first booking!</p>;
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Booking ID</th>
            <th>Full Name</th>
            <th>Age</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>Vehicle</th>
            <th>Booking Date</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.full_name}</td>
              <td>{booking.age}</td>
              <td>{booking.email}</td>
              <td>{booking.phone}</td>
              <td>{booking.gender}</td>
              <td>{booking.vehicle}</td>
              <td>{booking.booking_date.slice(0, 10)}</td>
              <td>{booking.location}</td>

              <td>
                <div className="table-actions">
                  <button
                    className="edit-button"
                    onClick={() => onEdit(booking)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() => onDelete(booking.id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
