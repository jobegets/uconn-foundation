import { useState, type ReactNode } from "react";
import type { Tool } from "../constants/react-flow";
import { ToolContext } from "./tool-context";

type ToolProviderProps = {
  children: ReactNode;
};

export function ToolProvider({ children }: ToolProviderProps) {
  const [activeTool, setActiveTool] = useState<Tool>("select");
  const [loadingState, setLoadingState] = useState<boolean>(false);

  return (
    <ToolContext.Provider
      value={{ activeTool, setActiveTool, loadingState, setLoadingState }}
    >
      {children}
    </ToolContext.Provider>
  );
}
