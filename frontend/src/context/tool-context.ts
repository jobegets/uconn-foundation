import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Tool } from "../constants/react-flow";

export type ToolContextValue = {
  activeTool: Tool;
  setActiveTool: Dispatch<SetStateAction<Tool>>;
};

export const ToolContext = createContext<ToolContextValue | null>(null);
