
import { useState, type ReactNode } from "react";
import DraggablePopup from "./DraggablePopup";

type PopupLauncherProps = {
  title: string;
  buttonText: string;
  children: ReactNode;
};

export default function PopupLauncher({
  title,
  buttonText,
  children,
}: PopupLauncherProps) {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <button onClick={() => setShowPopup(true)}>
        {buttonText}
      </button>

      {showPopup && (
        <DraggablePopup
          title={title}
          onClose={() => setShowPopup(false)}
        >
          {children}
        </DraggablePopup>
      )}
    </>
  );
}
