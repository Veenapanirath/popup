
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

type PopupKind = "popup" | "minimized";

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

  const [mode, setMode] = useState<PopupState>("normal");


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
    kind: "popup" as PopupKind,
    pointerId: -1,
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  });


  const getMaximizedPosition = useCallback((): Position => {
    const screenWidth = window.innerWidth;

    let popupWidth = 0.85;

    if (screenWidth <= 600) {
      popupWidth = 0.94;
    } else if (screenWidth <= 768) {
      popupWidth = 0.90;
    }

    return {
      x: (screenWidth * (1 - popupWidth)) / 2,
      y: window.innerHeight * 0.075,
    };
  }, []);

  // centered minimized tab position
  const getMinimizedPosition = useCallback((): Position => {
    const width = Math.min(210, window.innerWidth - 16);
    const height = window.innerWidth <= 600 ? 46 : 48;

    return {
      x: Math.max(0, (window.innerWidth - width) / 2),
      y: Math.max(0, (window.innerHeight - height) / 2),
    };
  }, []);

  const clampPosition = useCallback(
    (nextPosition: Position, kind: PopupKind) => {
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


  const startDrag = (
    e: PointerEvent<HTMLDivElement>,
    kind: PopupKind
  ) => {
  
    if (e.button !== 0) {
      return;
    }

    const target = e.target as HTMLElement;

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

  const stopDrag = (e: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId !== e.pointerId) {
      return;
    }

    dragRef.current.dragging = false;
    dragRef.current.pointerId = -1;
  };
  const toggleMaximize = () => {
    if (mode === "normal") {
     
      normalPosition.current = { ...position };

      setPosition(getMaximizedPosition());
      setMode("maximized");
    } else {
     
      setPosition({ ...normalPosition.current });
      setMode("normal");
    }
  };

  const minimizePopup = () => {
    restoreSnapshot.current = {
      mode,
      position: { ...position },
    };

    setMinimizedPosition(getMinimizedPosition());
    setIsMinimized(true);
  };


  const restorePopup = () => {
    setPosition({ ...restoreSnapshot.current.position });
    setMode(restoreSnapshot.current.mode);
    setIsMinimized(false);
  };
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

  useEffect(() => {
    if (isMinimized) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      if (mode === "maximized") {
        setPosition(getMaximizedPosition());
        return;
      }

      setPosition((current) => {
        const safePosition = clampPosition(current, "popup");
        normalPosition.current = safePosition;
        return safePosition;
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [
    isMinimized,
    mode,
    clampPosition,
    getMaximizedPosition,
  ]);

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
        setPosition(getMaximizedPosition());
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [
    isMinimized,
    mode,
    clampPosition,
    getMaximizedPosition,
  ]);

  if (isMinimized) {
    return (
      <div
        ref={minimizedRef}
        className="minimized-bar"
        style={{
          left: position.x === -1 ? 0 : minimizedPosition.x,
          top: minimizedPosition.y,
        }}
        onPointerDown={(e) => startDrag(e, "minimized")}
        onPointerMove={moveWindow}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onLostPointerCapture={stopDrag}
      >
        <span>{title}</span>

        <button
          type="button"
          onClick={restorePopup}
          aria-label="Restore popup"
        >
          Restore
        </button>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close popup"
        >
          ×
        </button>
      </div>
    );
  }

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

        <div className="window-controls" data-no-drag>
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
              mode === "normal"
                ? "Maximize popup"
                : "Restore popup"
            }
            title={
              mode === "normal"
                ? "Maximize"
                : "Restore"
            }
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

      {/* Content supplied by the parent page */}
      <div className="popup-form">
        {children}
      </div>
    </div>
  );
}
