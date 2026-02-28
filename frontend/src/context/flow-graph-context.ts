import { createContext, type Dispatch, type SetStateAction } from "react";
import type { Edge, OnEdgesChange, OnNodesChange } from "@xyflow/react";
import type { SummaryNode } from "../components/Flow/Nodes/SummaryNode";
import type { NoteNode } from "../components/Flow/Nodes/NoteNode";

export type FlowNode = SummaryNode | NoteNode;

export type FlowGraphContextValue = {
  nodes: FlowNode[];
  setNodes: Dispatch<SetStateAction<FlowNode[]>>;
  onNodesChange: OnNodesChange<FlowNode>;
  edges: Edge[];
  setEdges: Dispatch<SetStateAction<Edge[]>>;
  onEdgesChange: OnEdgesChange<Edge>;
};

export const FlowGraphContext = createContext<FlowGraphContextValue | null>(
  null,
);
