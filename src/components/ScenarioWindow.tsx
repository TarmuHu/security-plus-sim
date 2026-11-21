"use client";

import { useEffect, useRef, useState } from "react";

export function ScenarioWindow({
  title = "Scenario",
  body,
  open,
  onClose,
}: {
  title?: string;
  body: string;
  open: boolean;
  onClose: () => void;
}) {
  const [pos, setPos] = useState({ x: 24, y: 24 });
  const drag = useRef<{ ox: number; oy: number; px: number; py: number } | null>(
    null
  );

  useEffect(() => {
    if (open) setPos({ x: 24, y: 24 });
  }, [open, body]);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!drag.current) return;
      setPos({
        x: drag.current.px + (e.clientX - drag.current.ox),
        y: drag.current.py + (e.clientY - drag.current.oy),
      });
    }
    function onUp() {
      drag.current = null;
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  if (!open) return null;

  return (
    <div
      className="vue-window"
      style={{ left: pos.x, top: pos.y }}
      role="dialog"
      aria-label={title}
    >
      <div
        className="vue-window-title"
        onMouseDown={(e) => {
          drag.current = {
            ox: e.clientX,
            oy: e.clientY,
            px: pos.x,
            py: pos.y,
          };
        }}
      >
        <span>{title}</span>
        <button
          type="button"
          className="vue-window-x"
          aria-label="Close scenario"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <div className="vue-window-body whitespace-pre-wrap">{body}</div>
      <div
        style={{
          padding: "6px 10px",
          fontSize: 11,
          color: "#444",
          background: "#ece9d8",
          borderTop: "1px solid #808080",
        }}
      >
        Tip: Drag this window or close it if it covers the workspace.
      </div>
    </div>
  );
}
