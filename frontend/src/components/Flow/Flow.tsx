import { useCallback, useMemo, useRef, useState, type MouseEvent } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  MarkerType,
  Position,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
  type NodeProps,
  type NodeMouseHandler,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useToolContext } from "../../context/useToolContext";
import { BOX_STYLE, TEXT_STYLE } from "./styles";

type SketchKind = "box" | "text";
type SketchNodeData = { label: string; kind: SketchKind };
type SketchNode = Node<SketchNodeData>;
type SketchEdge = Edge;

export function SketchNodeComponent({ data }: NodeProps<SketchNode>) {
  return (
    <div className={`sketch-node sketch-node--${data.kind}`}>
      <Handle type="target" position={Position.Left} />
      <div className="sketch-node__label">{data.label}</div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

const nodeTypes = {
  sketch: SketchNodeComponent,
};

const initialNodes: SketchNode[] = [
  {
    id: "node-1",
    type: "sketch",
    position: { x: 220, y: 180 },
    data: { label: "Start here", kind: "box" },
    style: BOX_STYLE,
  },
];

function Flow() {
  const { activeTool } = useToolContext();
  const [nodes, setNodes, onNodesChange] =
    useNodesState<SketchNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<SketchEdge>([]);
  const [flowInstance, setFlowInstance] = useState<ReactFlowInstance<
    SketchNode,
    SketchEdge
  > | null>(null);
  const idCounterRef = useRef(initialNodes.length + 1);

  const defaultEdgeOptions = useMemo(
    () => ({
      type: "straight",
      markerEnd: { type: MarkerType.ArrowClosed, color: "#111827" },
      style: { stroke: "#111827", strokeWidth: 2 },
    }),
    [],
  );

  const createNode = useCallback(
    (kind: SketchKind, clickPosition: { x: number; y: number }) => {
      const id = `node-${idCounterRef.current}`;
      const nextNode: SketchNode = {
        id,
        type: "sketch",
        position: {
          x: kind === "box" ? clickPosition.x - 95 : clickPosition.x - 10,
          y: kind === "box" ? clickPosition.y - 50 : clickPosition.y - 15,
        },
        data: {
          label: `${kind === "box" ? "Box" : "Text"} ${idCounterRef.current}`,
          kind,
        },
        style: kind === "box" ? BOX_STYLE : TEXT_STYLE,
      };

      idCounterRef.current += 1;
      setNodes((currentNodes) => [...currentNodes, nextNode]);
    },
    [setNodes],
  );

  const onPaneClick = useCallback(
    (event: MouseEvent) => {
      if (!flowInstance || (activeTool !== "box" && activeTool !== "text")) {
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
      if (activeTool !== "arrow") {
        return;
      }

      setEdges((currentEdges) =>
        addEdge({ ...connection, ...defaultEdgeOptions }, currentEdges),
      );
    },
    [activeTool, defaultEdgeOptions, setEdges],
  );

  const onNodeDoubleClick = useCallback<NodeMouseHandler<SketchNode>>(
    (_event, node) => {
      const promptMessage =
        node.data.kind === "box" ? "Rename box:" : "Edit text:";
      const nextLabel = window.prompt(promptMessage, node.data.label);

      if (nextLabel === null) {
        return;
      }

      const trimmedLabel = nextLabel.trim();
      if (!trimmedLabel) {
        return;
      }

      setNodes((currentNodes) =>
        currentNodes.map((currentNode) =>
          currentNode.id === node.id
            ? {
                ...currentNode,
                data: { ...currentNode.data, label: trimmedLabel },
              }
            : currentNode,
        ),
      );
    },
    [setNodes],
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
      onNodeDoubleClick={onNodeDoubleClick}
      fitView
      defaultEdgeOptions={defaultEdgeOptions}
      nodesConnectable={activeTool === "arrow"}
      elementsSelectable={activeTool === "select" || activeTool === "arrow"}
      selectionOnDrag={activeTool === "select"}
      panOnDrag={activeTool === "select" || activeTool === "arrow"}
      className="canvas"
    >
      <Background gap={20} size={1.1} color="#d6dce5" />
      <Controls position="bottom-right" showInteractive={false} />
    </ReactFlow>
  );
}

export default Flow;
