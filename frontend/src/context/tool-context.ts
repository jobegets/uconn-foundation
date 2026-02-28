import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Tool } from "../constants/react-flow";

export type ToolContextValue = {
  // whatever lol
  loadingState: boolean;
  setLoadingState: Dispatch<SetStateAction<boolean>>;
  activeTool: Tool;
  setActiveTool: Dispatch<SetStateAction<Tool>>;
};

export const ToolContext = createContext<ToolContextValue | null>(null);
