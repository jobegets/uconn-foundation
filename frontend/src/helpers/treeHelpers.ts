import type { Edge } from "@xyflow/react";
import type { FlowNode } from "../context/flow-graph-context";

const START_X = 140;
const START_Y = 100;
const X_GAP = 280;
const Y_GAP = 220;

export type SummaryTree = {
  topic: string;
  summary: string;
  children?: SummaryTree[];
};

type SummaryNode = FlowNode & {
  data: {
    label: string;
    summary: string;
  };
};

function normalizeTopic(topic: string): string {
  return topic.trim().toLowerCase();
}

function isSummaryNode(node: FlowNode): node is SummaryNode {
  if (node.type !== "summary") {
    return false;
  }

  const nodeData = node.data as { label?: unknown; summary?: unknown };
  return (
    typeof nodeData.label === "string" && typeof nodeData.summary === "string"
  );
}

function buildGraphFromRoot(
  root: SummaryTree,
): { newNodes: FlowNode[]; newEdges: Edge[] } {
  const newNodes: FlowNode[] = [];
  const newEdges: Edge[] = [];
  const depthIndex = new Map<number, number>();

  const traverse = (
    node: SummaryTree,
    parentId: string | null,
    depth: number,
  ) => {
    const indexAtDepth = depthIndex.get(depth) ?? 0;
    depthIndex.set(depth, indexAtDepth + 1);

    const nodeId = `summary-${depth}-${indexAtDepth}`;

    newNodes.push({
      id: nodeId,
      type: "summary",
      position: {
        x: START_X + indexAtDepth * X_GAP,
        y: START_Y + depth * Y_GAP,
      },
      data: {
        label: node.topic,
        summary: node.summary.trim() || "Empty summary",
      },
    });

    if (parentId) {
      newEdges.push({
        id: `edge-${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
      });
    }

    node.children?.forEach((child) => traverse(child, nodeId, depth + 1));
  };

  traverse(root, null, 0);

  return { newNodes, newEdges };
}

export function buildGraphFromSummaryTree(
  currNodes: FlowNode[],
  currEdges: Edge[],
  newRoot: SummaryTree,
  shouldReplace: boolean = false,
): {
  newNodes: FlowNode[];
  newEdges: Edge[];
} {
  if (shouldReplace) {
    return buildGraphFromRoot(newRoot);
  }

  const newNodes = [...currNodes];
  const newEdges = [...currEdges];
  const nodeById = new Map(newNodes.map((node) => [node.id, node]));
  const nodeIndexById = new Map(
    newNodes.map((node, index) => [node.id, index]),
  );
  const outgoingEdgesBySource = new Map<string, Edge[]>();
  newEdges.forEach((edge) => {
    const existing = outgoingEdgesBySource.get(edge.source);
    if (existing) {
      existing.push(edge);
      return;
    }
    outgoingEdgesBySource.set(edge.source, [edge]);
  });

  const targetTopic = normalizeTopic(newRoot.topic);
  const targetNode = newNodes.find(
    (node) =>
      isSummaryNode(node) && normalizeTopic(node.data.label) === targetTopic,
  );

  if (!targetNode) {
    return { newNodes, newEdges };
  }

  const createNodeId = (() => {
    const idPrefix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    let idCounter = 0;

    return () => {
      let nextId = `summary-${idPrefix}-${idCounter}`;
      while (nodeById.has(nextId)) {
        idCounter += 1;
        nextId = `summary-${idPrefix}-${idCounter}`;
      }
      idCounter += 1;
      return nextId;
    };
  })();

  const updateSummaryNodeText = (nodeId: string, summary: string) => {
    const nodeIndex = nodeIndexById.get(nodeId);
    if (nodeIndex === undefined) {
      return;
    }

    const node = newNodes[nodeIndex];
    if (!isSummaryNode(node)) {
      return;
    }

    const nextNode: SummaryNode = {
      ...node,
      data: {
        ...node.data,
        summary,
      },
    };

    newNodes[nodeIndex] = nextNode;
    nodeById.set(nodeId, nextNode);
  };

  const mergeChildren = (parentId: string, children: SummaryTree[]) => {
    if (children.length === 0) {
      return;
    }

    const parentNode = nodeById.get(parentId);
    if (!parentNode || !isSummaryNode(parentNode)) {
      return;
    }

    const existingOutgoingEdges = outgoingEdgesBySource.get(parentId) ?? [];
    const existingChildIdByTopic = new Map<string, string>();
    existingOutgoingEdges.forEach((edge) => {
      const childNode = nodeById.get(edge.target);
      if (!childNode || !isSummaryNode(childNode)) {
        return;
      }

      const childTopicKey = normalizeTopic(childNode.data.label);
      if (childTopicKey) {
        existingChildIdByTopic.set(childTopicKey, childNode.id);
      }
    });

    let addedChildCount = 0;
    children.forEach((child) => {
      const childTopic = child.topic.trim();
      if (!childTopic) {
        return;
      }

      const childTopicKey = normalizeTopic(childTopic);
      const existingChildId = existingChildIdByTopic.get(childTopicKey);
      const childSummary = child.summary.trim() || "Empty summary";

      if (existingChildId) {
        updateSummaryNodeText(existingChildId, childSummary);
        mergeChildren(existingChildId, child.children ?? []);
        return;
      }

      const childNodeId = createNodeId();
      const childNode: SummaryNode = {
        id: childNodeId,
        type: "summary",
        position: {
          x:
            parentNode.position.x +
            (existingChildIdByTopic.size + addedChildCount) * X_GAP,
          y: parentNode.position.y + Y_GAP,
        },
        data: {
          label: childTopic,
          summary: childSummary,
        },
      };

      newNodes.push(childNode);
      nodeById.set(childNodeId, childNode);
      nodeIndexById.set(childNodeId, newNodes.length - 1);

      const childEdge: Edge = {
        id: `edge-${parentId}-${childNodeId}`,
        source: parentId,
        target: childNodeId,
      };
      newEdges.push(childEdge);
      const outgoingForParent = outgoingEdgesBySource.get(parentId);
      if (outgoingForParent) {
        outgoingForParent.push(childEdge);
      } else {
        outgoingEdgesBySource.set(parentId, [childEdge]);
      }

      addedChildCount += 1;
      mergeChildren(childNodeId, child.children ?? []);
    });
  };

  updateSummaryNodeText(
    targetNode.id,
    newRoot.summary.trim() || "Empty summary",
  );
  mergeChildren(targetNode.id, newRoot.children ?? []);

  return {
    newNodes,
    newEdges,
  };
}
