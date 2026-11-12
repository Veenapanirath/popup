
import { useState } from "react";
import DraggablePopup from "../../components/DraggablePopup";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div>
      <h1>Login Page</h1>

      <button onClick={() => setShowPopup(true)}>
        Open Login
      </button>

      {showPopup && (
        <DraggablePopup
          title="User Login"
          size="normal"
          onClose={() => setShowPopup(false)}
        >
          <LoginForm />
        </DraggablePopup>
      )}
    </div>
  );
}
