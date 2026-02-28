import { useState } from "react";
import {
  Handle,
  Position,
  useReactFlow,
  type NodeProps,
  type Node,
} from "@xyflow/react";

type NoteNodeData = { summary: string };

export const PLACEHOLDER_TEXT = "Double-click to write your scratchpad note...";

export type NoteNode = Node<NoteNodeData>;

export function NoteNode({ id, data }: NodeProps<NoteNode>) {
  const { setNodes } = useReactFlow();
  const [isEditingSummary, setIsEditingSummary] = useState(false);
  const [draftSummary, setDraftSummary] = useState(data.summary);
  const isPlaceholder = data.summary === PLACEHOLDER_TEXT;

  const saveSummary = () => {
    const nextSummary = draftSummary.trim();

    setNodes((currentNodes) =>
      currentNodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                summary: nextSummary || PLACEHOLDER_TEXT,
              },
            }
          : node,
      ),
    );
    setIsEditingSummary(false);
  };

  const onDoubleClick = (
    e: React.MouseEvent<HTMLParagraphElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    setDraftSummary(isPlaceholder ? "" : data.summary);
    setIsEditingSummary(true);
  };

  return (
    <div className="note-node">
      <div className="note-node__paper">
        <div className="note-node__header">Scratchpad</div>
        {isEditingSummary ? (
          <textarea
            className="note-node__editor nodrag nowheel"
            autoFocus
            value={draftSummary}
            onChange={(event) => setDraftSummary(event.target.value)}
            onBlur={saveSummary}
            onMouseDown={(event) => event.stopPropagation()}
          />
        ) : (
          <p
            className={`note-node__text${isPlaceholder ? " note-node__text--placeholder" : ""}`}
            onDoubleClick={onDoubleClick}
          >
            {data.summary}
          </p>
        )}
      </div>
      <Handle type="target" position={Position.Bottom} />
    </div>
  );
}
