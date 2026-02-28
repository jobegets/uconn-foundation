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
  let nodeIdCounter = 0;
  let nextLeafX = START_X;

  const traverse = (node: SummaryTree, parentId: string | null, depth: number): number => {
    const nodeId = `summary-${nodeIdCounter}`;
    nodeIdCounter += 1;

    const childPositions = (node.children ?? []).map((child) =>
      traverse(child, nodeId, depth + 1),
    );

    const x =
      childPositions.length === 0
        ? nextLeafX
        : (childPositions[0] + childPositions[childPositions.length - 1]) / 2;

    if (childPositions.length === 0) {
      nextLeafX += X_GAP;
    }

    newNodes.push({
      id: nodeId,
      type: "summary",
      position: {
        x,
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

    return x;
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

  const shiftSubtree = (rootNodeId: string, deltaX: number, deltaY: number) => {
    if (deltaX === 0 && deltaY === 0) {
      return;
    }

    const queue = [rootNodeId];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const nodeId = queue.shift();
      if (!nodeId || visited.has(nodeId)) {
        continue;
      }
      visited.add(nodeId);

      const nodeIndex = nodeIndexById.get(nodeId);
      if (nodeIndex !== undefined) {
        const node = newNodes[nodeIndex];
        const shiftedNode: FlowNode = {
          ...node,
          position: {
            x: node.position.x + deltaX,
            y: node.position.y + deltaY,
          },
        };

        newNodes[nodeIndex] = shiftedNode;
        nodeById.set(nodeId, shiftedNode);
      }

      (outgoingEdgesBySource.get(nodeId) ?? []).forEach((edge) => {
        if (!visited.has(edge.target)) {
          queue.push(edge.target);
        }
      });
    }
  };

  const centerDirectChildren = (parentNode: SummaryNode, childIds: string[]) => {
    if (childIds.length === 0) {
      return;
    }

    const centerOffset = (childIds.length - 1) / 2;
    childIds.forEach((childId, index) => {
      const childNode = nodeById.get(childId);
      if (!childNode || !isSummaryNode(childNode)) {
        return;
      }

      const targetX = parentNode.position.x + (index - centerOffset) * X_GAP;
      const targetY = parentNode.position.y + Y_GAP;

      shiftSubtree(
        childId,
        targetX - childNode.position.x,
        targetY - childNode.position.y,
      );
    });
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
    const existingSummaryChildren = existingOutgoingEdges
      .map((edge) => nodeById.get(edge.target))
      .filter((node): node is SummaryNode => !!node && isSummaryNode(node))
      .sort((a, b) => a.position.x - b.position.x);

    const orderedChildIds = existingSummaryChildren.map((child) => child.id);
    const existingChildIdByTopic = new Map<string, string>();
    existingSummaryChildren.forEach((childNode) => {
      const childTopicKey = normalizeTopic(childNode.data.label);
      if (childTopicKey) {
        existingChildIdByTopic.set(childTopicKey, childNode.id);
      }
    });

    const nextMergeTargets: Array<{ childId: string; childChildren: SummaryTree[] }> = [];

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
        nextMergeTargets.push({
          childId: existingChildId,
          childChildren: child.children ?? [],
        });
        return;
      }

      const childNodeId = createNodeId();
      const childNode: SummaryNode = {
        id: childNodeId,
        type: "summary",
        position: {
          x: parentNode.position.x,
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

      orderedChildIds.push(childNodeId);
      existingChildIdByTopic.set(childTopicKey, childNodeId);
      nextMergeTargets.push({
        childId: childNodeId,
        childChildren: child.children ?? [],
      });
    });

    centerDirectChildren(parentNode, orderedChildIds);
    nextMergeTargets.forEach(({ childId, childChildren }) => {
      mergeChildren(childId, childChildren);
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
