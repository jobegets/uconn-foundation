import { useState } from "react";
import {
  Handle,
  Position,
  useReactFlow,
  type NodeProps,
  type Node,
} from "@xyflow/react";

type SummaryNodeData = { label: string; summary: string };
export type SummaryNode = Node<SummaryNodeData>;

export function SummaryNode({ id, data }: NodeProps<SummaryNode>) {
  const { setNodes } = useReactFlow();
  const [isOpen, setIsOpen] = useState(false);
  const [editingField, setEditingField] = useState<"label" | "summary" | null>(
    null,
  );
  const [draftLabel, setDraftLabel] = useState(data.label);
  const [draftSummary, setDraftSummary] = useState(data.summary);

  const saveField = (field: "label" | "summary") => {
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id !== id) {
          return node;
        }

        return {
          ...node,
          data: {
            ...node.data,
            label:
              field === "label"
                ? draftLabel.trim() || "Summary"
                : String(node.data.label ?? "Summary"),
            summary:
              field === "summary"
                ? draftSummary.trim() || "Empty summary"
                : String(node.data.summary ?? "Empty summary"),
          },
        };
      }),
    );

    setEditingField((currentField) =>
      currentField === field ? null : currentField,
    );
  };

  return (
    <div className="summary-node">
      <div className="summary-node__label-row">
        {editingField === "label" ? (
          <input
            className="summary-node__label-input nodrag nowheel"
            autoFocus
            value={draftLabel}
            onChange={(event) => setDraftLabel(event.target.value)}
            onBlur={() => saveField("label")}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                saveField("label");
              }
            }}
            onMouseDown={(event) => event.stopPropagation()}
          />
        ) : (
          <span
            className="summary-node__label"
            onDoubleClick={(event) => {
              event.stopPropagation();
              setDraftLabel(data.label);
              setEditingField("label");
            }}
          >
            {data.label || "Summary"}
          </span>
        )}
      </div>
      <details
        className="summary-node__dropdown"
        open={isOpen}
        onToggle={(event) =>
          setIsOpen((event.currentTarget as HTMLDetailsElement).open)
        }
      >
        <summary className="summary-node__toggle">View summary</summary>
        {editingField === "summary" ? (
          <textarea
            className="summary-node__editor nodrag nowheel"
            autoFocus
            value={draftSummary}
            onChange={(event) => setDraftSummary(event.target.value)}
            onBlur={() => saveField("summary")}
            onMouseDown={(event) => event.stopPropagation()}
          />
        ) : (
          <p
            className="summary-node__content"
            onDoubleClick={(event) => {
              event.stopPropagation();
              setDraftSummary(data.summary);
              if (!isOpen) {
                setIsOpen(true);
              }
              setEditingField("summary");
            }}
          >
            {data.summary}
          </p>
        )}
      </details>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
