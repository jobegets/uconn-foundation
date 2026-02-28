import { useEdgesState, useNodesState, type Edge } from "@xyflow/react";
import type { ReactNode } from "react";
import { FlowGraphContext, type FlowNode } from "./flow-graph-context";

const initialNodes: FlowNode[] = [
  {
    id: "node-1",
    type: "summary",
    position: { x: 220, y: 180 },
    data: { label: "Start here", summary: "hi" },
  },
];

type FlowGraphProviderProps = {
  children: ReactNode;
};

export function FlowGraphProvider({ children }: FlowGraphProviderProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  return (
    <FlowGraphContext.Provider
      value={{ nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange }}
    >
      {children}
    </FlowGraphContext.Provider>
  );
}
