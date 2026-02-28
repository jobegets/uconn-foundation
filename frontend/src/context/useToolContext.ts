import { useContext } from "react";
import { ToolContext } from "./tool-context";

export function useToolContext() {
  const context = useContext(ToolContext);

  if (!context) {
    throw new Error("useToolContext must be used within a ToolProvider");
  }

  return context;
}
