import { useState, type ReactNode } from "react";
import type { Tool } from "../constants/react-flow";
import { ToolContext } from "./tool-context";

type ToolProviderProps = {
  children: ReactNode;
};

export function ToolProvider({ children }: ToolProviderProps) {
  const [activeTool, setActiveTool] = useState<Tool>("select");

  return (
    <ToolContext.Provider value={{ activeTool, setActiveTool }}>
      {children}
    </ToolContext.Provider>
  );
}
