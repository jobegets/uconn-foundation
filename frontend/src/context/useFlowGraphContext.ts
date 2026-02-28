import { useContext } from "react";
import { FlowGraphContext } from "./flow-graph-context";

export function useFlowGraphContext() {
  const context = useContext(FlowGraphContext);

  if (!context) {
    throw new Error("useFlowGraphContext must be used within a FlowGraphProvider");
  }

  return context;
}
