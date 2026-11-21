"use client";

import { useState } from "react";

export function Calculator({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [display, setDisplay] = useState("0");
  const [acc, setAcc] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);

  if (!open) return null;

  function inputDigit(d: string) {
    setDisplay((cur) => {
      if (fresh || cur === "0") {
        setFresh(false);
        return d;
      }
      if (cur.length > 14) return cur;
      return cur + d;
    });
  }

  function inputDot() {
    setDisplay((cur) => {
      if (fresh) {
        setFresh(false);
        return "0.";
      }
      return cur.includes(".") ? cur : cur + ".";
    });
  }

  function applyOp(nextOp: string) {
    const n = parseFloat(display);
    if (acc == null || op == null || fresh) {
      setAcc(n);
    } else {
      const result = compute(acc, n, op);
      setAcc(result);
      setDisplay(String(result));
    }
    setOp(nextOp);
    setFresh(true);
  }

  function equals() {
    if (acc == null || op == null) return;
    const result = compute(acc, parseFloat(display), op);
    setDisplay(String(result));
    setAcc(null);
    setOp(null);
    setFresh(true);
  }

  function clear() {
    setDisplay("0");
    setAcc(null);
    setOp(null);
    setFresh(true);
  }

  const keys = [
    ["7", "8", "9", "/"],
    ["4", "5", "6", "*"],
    ["1", "2", "3", "-"],
    ["0", ".", "=", "+"],
  ];

  return (
    <div className="vue-modal-backdrop" onClick={onClose}>
      <div className="vue-modal" style={{ width: 260 }} onClick={(e) => e.stopPropagation()}>
        <div className="vue-modal-title">Calculator</div>
        <div className="vue-modal-body">
          <div
            style={{
              background: "#001a00",
              color: "#9f9",
              fontFamily: "Consolas, monospace",
              padding: "8px 10px",
              textAlign: "right",
              marginBottom: 10,
              border: "1px solid #404040",
              minHeight: 36,
            }}
          >
            {display}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
            <button type="button" className="vue-btn" style={{ gridColumn: "span 4" }} onClick={clear}>
              C
            </button>
            {keys.flat().map((k) => (
              <button
                key={k}
                type="button"
                className="vue-btn"
                onClick={() => {
                  if (k >= "0" && k <= "9") inputDigit(k);
                  else if (k === ".") inputDot();
                  else if (k === "=") equals();
                  else applyOp(k);
                }}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
        <div className="vue-modal-actions">
          <button type="button" className="vue-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function compute(a: number, b: number, op: string): number {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return b === 0 ? NaN : a / b;
    default:
      return b;
  }
}
