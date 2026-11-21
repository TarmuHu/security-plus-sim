"use client";

import { useEffect, useRef, useState } from "react";

export function Timer({
  endsAt,
  onExpire,
  hidden,
  onToggleHide,
}: {
  endsAt: number;
  onExpire: () => void;
  hidden?: boolean;
  onToggleHide?: () => void;
}) {
  const [now, setNow] = useState(Date.now());
  const expired = useRef(false);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, []);

  const remaining = Math.max(0, endsAt - now);
  useEffect(() => {
    if (remaining === 0 && !expired.current) {
      expired.current = true;
      onExpire();
    }
  }, [remaining, onExpire]);

  const totalSec = Math.floor(remaining / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  const label =
    h > 0
      ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;

  const urgent = remaining < 5 * 60 * 1000;

  return (
    <div className={`vue-timer ${urgent ? "urgent" : ""}`} aria-live="polite">
      <button
        type="button"
        className="vue-btn"
        style={{ minWidth: 32, padding: "2px 8px" }}
        title={hidden ? "Show time remaining" : "Hide time remaining"}
        onClick={onToggleHide}
      >
        🕒
      </button>
      {!hidden && (
        <span>
          Time Remaining: <strong>{label}</strong>
        </span>
      )}
    </div>
  );
}
