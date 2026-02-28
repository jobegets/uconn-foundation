import { useCallback, useRef, useState, type MouseEvent } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  type Connection,
  type Edge,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useToolContext } from "../../context/useToolContext";
import { SummaryNode } from "./Nodes/SummaryNode";
import { NoteNode, PLACEHOLDER_TEXT } from "./Nodes/NoteNode";
import "./Nodes/styles.css";
import type { Tool } from "../../constants/react-flow";
import { useFlowGraphContext } from "../../context/useFlowGraphContext";
import type { FlowNode } from "../../context/flow-graph-context";

const nodeTypes = {
  summary: SummaryNode,
  note: NoteNode,
};

const Node = {
  Summary: "summary",
  Note: "note",
} as const;

function Flow() {
  const { activeTool } = useToolContext();
  const { nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange } =
    useFlowGraphContext();
  const [flowInstance, setFlowInstance] = useState<ReactFlowInstance<
    FlowNode,
    Edge
  > | null>(null);
  const idCounterRef = useRef(nodes.length + 1);
  const isElementsSelectable = activeTool === "select";
  const shouldPanOnDrag = activeTool === "select";
  const shouldSelectionOnDrag = activeTool === "select";

  const createNode = useCallback(
    (activeTool: Tool, clickPosition: { x: number; y: number }) => {
      const id = `node-${idCounterRef.current}`;

      let nextNode: FlowNode;
      if (activeTool === "box") {
        nextNode = {
          id,
          type: Node.Summary,
          position: {
            x: clickPosition.x - 95,
            y: clickPosition.y - 50,
          },
          data: {
            label: "",
            summary: "hi",
          },
        };
      } else if (activeTool === "note") {
        nextNode = {
          id,
          type: Node.Note,
          position: {
            x: clickPosition.x - 95,
            y: clickPosition.y - 50,
          },
          data: {
            summary: PLACEHOLDER_TEXT,
          },
        };
      }
      idCounterRef.current += 1;
      setNodes((currentNodes) => [...currentNodes, nextNode]);
    },
    [setNodes],
  );

  const onPaneClick = useCallback(
    (event: MouseEvent) => {
      if (!flowInstance || (activeTool !== "box" && activeTool !== "note")) {
        return;
      }

      const flowPosition = flowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      createNode(activeTool, flowPosition);
    },
    [activeTool, createNode, flowInstance],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((currentEdges) => addEdge({ ...connection }, currentEdges));
    },
    [setEdges],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onInit={setFlowInstance}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onPaneClick={onPaneClick}
      onConnect={onConnect}
      fitView
      nodesConnectable
      elementsSelectable={isElementsSelectable}
      selectionOnDrag={shouldSelectionOnDrag}
      panOnDrag={shouldPanOnDrag}
      className="canvas"
    >
      <Background gap={20} size={1.1} color="#d6dce5" />
      <Controls position="bottom-right" showInteractive={true} />
    </ReactFlow>
  );
}

export default Flow;
