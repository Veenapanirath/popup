
import { useState } from "react";
import DraggablePopup from "../../components/DraggablePopup";
import CustomerForm from "./CustomerForm";

export default function CustomerPage() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <h1>Customer Management</h1>

      <button onClick={() => setShowPopup(true)}>
        Add Customer
      </button>

      {showPopup && (
        <DraggablePopup
          title="Add Customer"
          size="large"
          onClose={() => setShowPopup(false)}
        >
          <CustomerForm />
        </DraggablePopup>
      )}
    </div>
  );
}
