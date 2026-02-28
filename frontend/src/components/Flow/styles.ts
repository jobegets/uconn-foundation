import type { CSSProperties } from "react";

export const BOX_STYLE: CSSProperties = {
  width: 190,
  height: 100,
  borderRadius: 12,
  border: "2px solid #1f2937",
  boxShadow: "0 1px 0 #ffffff, 0 10px 20px rgba(15, 23, 42, 0.08)",
  background: "#fffef6",
  color: "#1f2937",
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

export const TEXT_STYLE: CSSProperties = {
  border: "none",
  borderRadius: 0,
  boxShadow: "none",
  background: "transparent",
  color: "#0f172a",
  fontSize: 24,
  fontWeight: 600,
  padding: 0,
};
