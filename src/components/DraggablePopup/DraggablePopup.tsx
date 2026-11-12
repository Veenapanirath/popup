
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";

import "./DraggablePopup.css";

type PopupState = "normal" | "maximized";

type Position = {
  x: number;
  y: number;
};

type RestoreSnapshot = {
  mode: PopupState;
  position: Position;
};

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

  // Popup starts in normal size
  const [mode, setMode] = useState<PopupState>("normal");

  // Minimized is handled separately
  const [isMinimized, setIsMinimized] = useState(false);

  const [position, setPosition] = useState<Position>({
    x: 24,
    y: 24,
  });

  const [minimizedPosition, setMinimizedPosition] =
    useState<Position>({
      x: 24,
      y: 24,
    });

  const popupRef = useRef<HTMLDivElement>(null);
  const minimizedRef = useRef<HTMLDivElement>(null);

  // Remember normal popup position
  const normalPosition = useRef<Position>({
    x: 24,
    y: 24,
  });

  // Remember popup state before minimizing
  const restoreSnapshot = useRef<RestoreSnapshot>({
    mode: "normal",
    position: { x: 24, y: 24 },
  });

  const dragRef = useRef({
    dragging: false,
    kind: "popup" as "popup" | "minimized",
    pointerId: -1,
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  });

  // Keeps a portion of the popup visible on the screen
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

      const minX = 60 - rect.width;
      const maxX = window.innerWidth - 60;

      const minY = 0;
      const maxY = window.innerHeight - 40;

      return {
        x: Math.max(minX, Math.min(nextPosition.x, maxX)),
        y: Math.max(minY, Math.min(nextPosition.y, maxY)),
      };
    },
    []
  );

  // Starts dragging popup or minimized tab
  const startDrag = (
    e: PointerEvent<HTMLDivElement>,
    kind: "popup" | "minimized"
  ) => {
    const target = e.target as HTMLElement;

    // Do not drag when using form controls or buttons
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

  // Moves popup while dragging
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

      if (mode === "normal") {
        normalPosition.current = nextPosition;
      }
    } else {
      setMinimizedPosition(nextPosition);
    }
  };

  // Stops dragging
  const stopDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId !== e.pointerId) {
      return;
    }

    dragRef.current.dragging = false;
    dragRef.current.pointerId = -1;
  };

  // Maximizes or restores popup
  const toggleMaximize = () => {
    if (mode === "normal") {
      // Save normal position before maximizing
      normalPosition.current = { ...position };

      // Move maximized popup to the centre
      setPosition({
        x: window.innerWidth * 0.075,
        y: window.innerHeight * 0.075,
      });

      setMode("maximized");
    } else {
      // Return to previous normal position
      setPosition({ ...normalPosition.current });

      setMode("normal");
    }
  };

  // Minimizes popup and places floating tab in the centre
  const minimizePopup = () => {
    restoreSnapshot.current = {
      mode,
      position: { ...position },
    };

    // Get minimized tab dimensions and centre it
    const tabWidth = minimizedRef.current?.offsetWidth ?? 210;
    const tabHeight = minimizedRef.current?.offsetHeight ?? 48;

    setMinimizedPosition({
      x: Math.max(0, (window.innerWidth - tabWidth) / 2),
      y: Math.max(0, (window.innerHeight - tabHeight) / 2),
    });

    setIsMinimized(true);
  };

  // Restores popup to its previous state
  const restorePopup = () => {
    setPosition({ ...restoreSnapshot.current.position });
    setMode(restoreSnapshot.current.mode);
    setIsMinimized(false);
  };

  // Centers popup when it first appears
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

  // Adjusts popup position when browser is resized
  useEffect(() => {
    const handleResize = () => {
      if (isMinimized) {
        setMinimizedPosition((current) =>
          clampPosition(current, "minimized")
        );
      } else if (mode === "normal") {
        setPosition((current) => {
          const safePosition = clampPosition(current, "popup");
          normalPosition.current = safePosition;
          return safePosition;
        });
      } else {
        // Keep maximized popup centred after resizing
        setPosition({
          x: window.innerWidth * 0.075,
          y: window.innerHeight * 0.075,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMinimized, mode, clampPosition]);

  // Minimized popup UI
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

  // Normal and maximized popup UI
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
            onClick={toggleMaximize}
            aria-label={
              mode === "normal" ? "Maximize popup" : "Restore popup"
            }
            title={mode === "normal" ? "Maximize" : "Restore"}
          >
            {mode === "normal" ? "□" : "❐"}
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

      <div className="popup-form">
        {children}
      </div>
    </div>
  );
}
