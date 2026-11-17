
import {
  useCallback,
  useRef,
  useState,
} from "react";

import "./App.css";

import VehiclePage from "./pages/VehicleManagement/VehiclePage";
import CustomerForm from "./pages/Customer/CustomerForm";
import LoginForm from "./pages/Login/LoginForm";

import { DraggablePopup } from "./components/DraggablePopup";

import type { Page } from "./types/booking";

function App() {
  const [currentPage, setCurrentPage] = useState<Page>("vehicle");
  const [isOtherPopupOpen, setIsOtherPopupOpen] = useState(false);

  const navigationHandlerRef = useRef<
    ((page: Page) => void) | null
  >(null);

  const registerNavigationHandler = useCallback(
    (handler: (page: Page) => void) => {
      navigationHandlerRef.current = handler;
    },
    []
  );

 
  const navigateToPage = useCallback((page: Page) => {
    setIsOtherPopupOpen(false);
    setCurrentPage(page);
  }, []);


  const handleNavigation = (page: Page) => {
    if (page === currentPage) return;

    if (currentPage === "vehicle") {
      navigationHandlerRef.current?.(page);
    } else {
      navigateToPage(page);
    }
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
    setIsOtherPopupOpen(false);
  };

  const handleLoginSubmit = (data: {
    email: string;
    password: string;
  }) => {
    console.log("Login details:", data);
    alert("Login form submitted!");
    setIsOtherPopupOpen(false);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "vehicle":
        return (
          <VehiclePage
            onNavigate={navigateToPage}
            onRegisterNavigationHandler={registerNavigationHandler}
          />
        );

      case "customer":
        return (
          <>
            <div className="section-heading">
              <div>
                <h3>Customer Details</h3>
                <p>View and manage customer records.</p>
              </div>

              <button
                className="add-button"
                onClick={() => setIsOtherPopupOpen(true)}
              >
                + Add Customer
              </button>
            </div>

            <div className="background-card">
              <h3>Customer Management</h3>
              <p>Click Add Customer to open the customer form.</p>
            </div>
          </>
        );

      case "login":
        return (
          <>
            <div className="section-heading">
              <div>
                <h3>User Login</h3>
                <p>Open the login form.</p>
              </div>

              <button
                className="add-button"
                onClick={() => setIsOtherPopupOpen(true)}
              >
                Open Login
              </button>
            </div>

            <div className="background-card">
              <h3>Login Demonstration</h3>
              <p>Click Open Login to display the login popup.</p>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <header className="page-header">
        <h2>Ford Management Demo</h2>
        <p>Reusable draggable popup demonstration</p>
      </header>

      <nav className="page-navigation">
        <button onClick={() => handleNavigation("vehicle")}>
          Vehicle Management
        </button>

        <button onClick={() => handleNavigation("customer")}>
          Customer Management
        </button>

        <button onClick={() => handleNavigation("login")}>
          Login
        </button>
      </nav>

      <main className="main-content">
        {renderPage()}
      </main>

      {isOtherPopupOpen && currentPage === "customer" && (
        <DraggablePopup
          title="Add Customer Details"
          onClose={() => setIsOtherPopupOpen(false)}
        >
          <CustomerForm onSubmit={handleCustomerSubmit} />
        </DraggablePopup>
      )}

      {isOtherPopupOpen && currentPage === "login" && (
        <DraggablePopup
          title="User Login"
          onClose={() => setIsOtherPopupOpen(false)}
        >
          <LoginForm onSubmit={handleLoginSubmit} />
        </DraggablePopup>
      )}
    </div>
  );
}

export default App;
