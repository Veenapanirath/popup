
import { useState } from "react";
import "./App.css";

import DraggablePopup from "./components/DraggablePopup";
import VehicleForm from "./pages/VehicleManagement/VehicleForm";

function App() {
  const [isOpen, setIsOpen] = useState(false);

  // Open the vehicle popup
  const openPopup = () => {
    setIsOpen(true);
  };

  // Close the vehicle popup
  const closePopup = () => {
    setIsOpen(false);
  };

  // Handle submitted vehicle form data
  const handleVehicleSubmit = (data: {
    fullName: string;
    age: string;
    email: string;
    phone: string;
    gender: string;
    vehicle: string;
    bookingDate: string;
    location: string;
  }) => {
    console.log("Submitted vehicle details:", data);
    alert("Details submitted successfully!");
  };

  return (
    <div className="app-container">
      <header className="page-header">
        <h2>Ford Vehicle Management</h2>
        <p>Manage your vehicle information and details.</p>
      </header>

      <main className="main-content">
        <div className="section-heading">
          <div>
            <h3>Vehicle Details</h3>
            <p>View and manage your vehicle records.</p>
          </div>

          <button className="add-button" onClick={openPopup}>
            + Add
          </button>
        </div>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Vehicle ID</th>
                <th>Vehicle Model</th>
                <th>Registration</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>001</td>
                <td>Ford Mustang</td>
                <td>HR 26 AB 1234</td>
                <td>Active</td>
              </tr>

              <tr>
                <td>002</td>
                <td>Ford Endeavour</td>
                <td>HR 26 CD 5678</td>
                <td>Active</td>
              </tr>

              <tr>
                <td>003</td>
                <td>Ford EcoSport</td>
                <td>HR 26 EF 9012</td>
                <td>Pending</td>
              </tr>
            </tbody>
          </table>
        </div>

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
      </main>

      {/* Show the reusable popup when Add is clicked */}
      {isOpen && (
        <DraggablePopup
          title="Add Vehicle Details"
          onClose={closePopup}
        >
          <VehicleForm onSubmit={handleVehicleSubmit} />
        </DraggablePopup>
      )}
    </div>
  );
}

export default App;
