
import { useState } from "react";
import "./App.css";

import DraggablePopup from "./components/DraggablePopup";

import VehicleForm from "./pages/VehicleManagement/VehicleForm";
import CustomerForm from "./pages/Customer/CustomerForm";
import LoginForm from "./pages/Login/LoginForm";

type Page = "vehicle" | "customer" | "login";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("vehicle");
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

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
    alert("Vehicle details submitted successfully!");
    closePopup();
  };

  const handleCustomerSubmit = (data: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  }) => {
    console.log("Submitted customer details:", data);
    alert("Customer details submitted successfully!");
    closePopup();
  };

  const handleLoginSubmit = (data: {
    email: string;
    password: string;
  }) => {
    console.log("Login details:", data);
    alert("Login form submitted!");
    closePopup();
  };

  return (
    <div className="app-container">

      <header className="page-header">
        <h2>Ford Management Demo</h2>
        <p>Reusable draggable popup demonstration</p>
      </header>

      <nav className="page-navigation">
        <button onClick={() => {
          setIsOpen(false);
          setCurrentPage("vehicle");
        }}>
          Vehicle Management
        </button>

        <button onClick={() => {
          setIsOpen(false);
          setCurrentPage("customer");
        }}>
          Customer Management
        </button>

        <button onClick={() => {
          setIsOpen(false);
          setCurrentPage("login");
        }}>
          Login
        </button>
      </nav>

      <main className="main-content">

        {currentPage === "vehicle" && (
          <>
            <div className="section-heading">
              <div>
                <h3>Vehicle Details</h3>
                <p>View and manage your vehicle records.</p>
              </div>

              <button className="add-button" onClick={openPopup}>
                + Add Vehicle
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

              <button onClick={() => alert("Background interaction works!")}>
                Test Background Interaction
              </button>
            </div>
          </>
        )}

        {currentPage === "customer" && (
          <>
            <div className="section-heading">
              <div>
                <h3>Customer Details</h3>
                <p>View and manage customer records.</p>
              </div>

              <button className="add-button" onClick={openPopup}>
                + Add Customer
              </button>
            </div>

            <div className="background-card">
              <h3>Customer Management</h3>
              <p>Click Add Customer to open the customer form.</p>
            </div>
          </>
        )}

        {currentPage === "login" && (
          <>
            <div className="section-heading">
              <div>
                <h3>User Login</h3>
                <p>Open the login form.</p>
              </div>

              <button className="add-button" onClick={openPopup}>
                Open Login
              </button>
            </div>

            <div className="background-card">
              <h3>Login Demonstration</h3>
              <p>Click Open Login to display the login popup.</p>
            </div>
          </>
        )}

      </main>

      {isOpen && (
        <DraggablePopup
          title={
            currentPage === "vehicle"
              ? "Add Vehicle Details"
              : currentPage === "customer"
              ? "Add Customer Details"
              : "User Login"
          }
          size={
            currentPage === "vehicle"
              ? "medium"
              : currentPage === "customer"
              ? "large"
              : "normal"
          }
          onClose={closePopup}
        >
          {currentPage === "vehicle" && (
            <VehicleForm onSubmit={handleVehicleSubmit} />
          )}

          {currentPage === "customer" && (
            <CustomerForm onSubmit={handleCustomerSubmit} />
          )}

          {currentPage === "login" && (
            <LoginForm onSubmit={handleLoginSubmit} />
          )}
        </DraggablePopup>
      )}

    </div>
  );
}

export default App;
