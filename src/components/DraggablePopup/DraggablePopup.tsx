
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";

import "./DraggablePopup.css";

// The three available popup sizes
type PopupSize = "normal" | "medium" | "large";

// Position of the popup or minimized tab
type Position = {
  x: number;
  y: number;
};

// Information required to restore the popup
type RestoreSnapshot = {
  mode: PopupSize;
  position: Position;
};

// Props accepted by our reusable component
type DraggablePopupProps = {
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export default function DraggablePopup({
  title,
  children,
  onClose,
}: DraggablePopupProps) {
  // Current popup size
  const [mode, setMode] = useState<PopupSize>("normal");

  // Whether the popup is minimized
  const [isMinimized, setIsMinimized] = useState(false);

  // Popup position
  const [position, setPosition] = useState<Position>({
    x: 24,
    y: 24,
  });

  // Minimized tab position
  const [minimizedPosition, setMinimizedPosition] =
    useState<Position>({
      x: 24,
      y: 24,
    });

  // Reference to the popup DOM element
  const popupRef = useRef<HTMLDivElement>(null);

  // Reference to the minimized tab DOM element
  const minimizedRef = useRef<HTMLDivElement>(null);

  // Remember the normal-sized popup position
  const normalPosition = useRef<Position>({
    x: 24,
    y: 24,
  });

  // Remember the popup state before minimizing
  const restoreSnapshot = useRef<RestoreSnapshot>({
    mode: "normal",
    position: { x: 24, y: 24 },
  });

  // Store information about an active drag
  const dragRef = useRef({
    dragging: false,
    kind: "popup" as "popup" | "minimized",
    pointerId: -1,
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  });

  // Keep an element's position inside the browser viewport
  const clampPosition = useCallback(
    (nextPosition: Position, kind: "popup" | "minimized") => {
      const element =
        kind === "popup"
          ? popupRef.current
          : minimizedRef.current;

      if (!element) {
        return nextPosition;
      }

      const rect = element.getBoundingClientRect();

      const maxX = Math.max(0, window.innerWidth - rect.width);
      const maxY = Math.max(0, window.innerHeight - rect.height);

      return {
        x: Math.min(Math.max(0, nextPosition.x), maxX),
        y: Math.min(Math.max(0, nextPosition.y), maxY),
      };
    },
    []
  );

  // Start dragging the popup or minimized tab
  const startDrag = (
    e: PointerEvent<HTMLDivElement>,
    kind: "popup" | "minimized"
  ) => {
    const target = e.target as HTMLElement;

    // Do not start dragging when using interactive elements
    if (
      target.closest(
        "button, input, select, textarea, option, a, [data-no-drag]"
      )
    ) {
      return;
    }

    e.preventDefault();

    const currentPosition =
      kind === "popup" ? position : minimizedPosition;

    dragRef.current = {
      dragging: true,
      kind,
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      initialX: currentPosition.x,
      initialY: currentPosition.y,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  // Move the popup or minimized tab
  const moveWindow = (e: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;

    if (!drag.dragging || drag.pointerId !== e.pointerId) {
      return;
    }

    const deltaX = e.clientX - drag.startX;
    const deltaY = e.clientY - drag.startY;

    const nextPosition = clampPosition(
      {
        x: drag.initialX + deltaX,
        y: drag.initialY + deltaY,
      },
      drag.kind
    );

    if (drag.kind === "popup") {
      setPosition(nextPosition);

      // Remember the position when the popup is normal-sized
      if (mode === "normal") {
        normalPosition.current = nextPosition;
      }
    } else {
      setMinimizedPosition(nextPosition);
    }
  };

  // Stop dragging
  const stopDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId !== e.pointerId) {
      return;
    }

    dragRef.current.dragging = false;
    dragRef.current.pointerId = -1;
  };

  // Cycle through normal, medium and large sizes
  const changeSize = () => {
    if (mode === "normal") {
      normalPosition.current = { ...position };
      setMode("medium");
    } else if (mode === "medium") {
      setMode("large");
    } else {
      setPosition({ ...normalPosition.current });
      setMode("normal");
    }
  };

  // Minimize the popup
  const minimizePopup = () => {
    restoreSnapshot.current = {
      mode,
      position: { ...position },
    };

    setMinimizedPosition({ ...position });
    setIsMinimized(true);
  };

  // Restore the popup to its previous size and position
  const restorePopup = () => {
    setPosition({ ...restoreSnapshot.current.position });
    setMode(restoreSnapshot.current.mode);
    setIsMinimized(false);
  };

  // Center the popup when it first appears
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const element = popupRef.current;

      if (!element) {
        return;
      }

      const rect = element.getBoundingClientRect();

      const centeredPosition = {
        x: Math.max(0, (window.innerWidth - rect.width) / 2),
        y: Math.max(0, (window.innerHeight - rect.height) / 2),
      };

      setPosition(centeredPosition);
      normalPosition.current = centeredPosition;
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  // Keep the popup or minimized tab inside the viewport on resize
  useEffect(() => {
    const handleResize = () => {
      if (isMinimized) {
        setMinimizedPosition((current) =>
          clampPosition(current, "minimized")
        );
      } else {
        setPosition((current) => {
          const safePosition = clampPosition(current, "popup");

          if (mode === "normal") {
            normalPosition.current = safePosition;
          }

          return safePosition;
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMinimized, mode, clampPosition]);

  // Recalculate position after the popup changes size
  useEffect(() => {
    if (isMinimized) {
      return;
    }

    setPosition((current) => {
      const safePosition = clampPosition(current, "popup");

      if (mode === "normal") {
        normalPosition.current = safePosition;
      }

      return safePosition;
    });
  }, [mode, isMinimized, clampPosition]);

  // Render the minimized tab
  if (isMinimized) {
    return (
      <div
        ref={minimizedRef}
        className="minimized-bar"
        style={{
          left: minimizedPosition.x,
          top: minimizedPosition.y,
        }}
        onPointerDown={(e) => startDrag(e, "minimized")}
        onPointerMove={moveWindow}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onLostPointerCapture={stopDrag}
      >
        <span>{title}</span>

        <button type="button" onClick={restorePopup}>
          Restore
        </button>

        <button type="button" onClick={onClose}>
          ×
        </button>
      </div>
    );
  }

  // Render the full popup
  return (
    <div
      ref={popupRef}
      className={`popup-window ${mode}`}
      style={{
        left: position.x,
        top: position.y,
      }}
      onPointerDown={(e) => startDrag(e, "popup")}
      onPointerMove={moveWindow}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      onLostPointerCapture={stopDrag}
    >
      <div className="popup-header">
        <h3>{title}</h3>

        <div className="window-controls">
          <button
            type="button"
            onClick={minimizePopup}
            aria-label="Minimize popup"
            title="Minimize"
          >
            −
          </button>

          <button
            type="button"
            onClick={changeSize}
            aria-label="Change popup size"
            title="Change size"
          >
            □
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close popup"
            title="Close"
          >
            ×
          </button>
        </div>
      </div>

      <div className="popup-form">{children}</div>
    </div>
  );
}
