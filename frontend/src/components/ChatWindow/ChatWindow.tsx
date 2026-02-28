import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/16/solid";
import { useFlowGraphContext } from "../../context/useFlowGraphContext";
import "./styles.css";
import {
  buildGraphFromSummaryTree,
  type SummaryTree,
} from "../../helpers/treeHelpers";
import { getStudyMapChildren } from "../../api";
import { useToolContext } from "../../context/useToolContext";

function ChatWindow() {
  const { nodes, edges, setNodes, setEdges } = useFlowGraphContext();
  const { setLoadingState } = useToolContext();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const focusedTag = (event.target as HTMLElement | null)?.tagName;
      if (focusedTag === "INPUT" || focusedTag === "TEXTAREA") {
        return;
      }

      if (event.key === "/") {
        event.preventDefault();
        setIsOpen((currentState) => !currentState);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const uploadLabel = useMemo(() => {
    if (!selectedFileName) {
      return "";
    }

    return `File: ${selectedFileName}`;
  }, [selectedFileName]);

  if (!isOpen) {
    return null;
  }

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoadingState(true);
    const prompt = message.trim();
    if (!prompt) return;

    setMessage("");
    const resTree = (await getStudyMapChildren(prompt)) as SummaryTree;

    // we just replace the entire tree
    const { newNodes, newEdges } = buildGraphFromSummaryTree(
      nodes,
      edges,
      resTree,
      true,
    );
    setNodes(newNodes);
    setEdges(newEdges);

    setLoadingState(false);
  };

  return (
    <div className="chat-overlay" role="dialog" aria-modal="false">
      <div className="chat-window">
        <button
          type="button"
          className="chat-window__close"
          onClick={() => setIsOpen(false)}
          aria-label="Close chat window"
        >
          x
        </button>
        <form className="chat-window__bar" onSubmit={onSubmit}>
          <label className="chat-window__upload">
            {uploadLabel.length > 0 ? (
              uploadLabel
            ) : (
              <ArrowUpTrayIcon width={25} height={25} />
            )}
            <input
              className="chat-window__upload-input"
              type="file"
              onChange={(event) => {
                const selectedFile = event.target.files?.[0] ?? null;
                setSelectedFileName(selectedFile ? selectedFile.name : null);
              }}
            />
          </label>
          <input
            className="chat-window__input"
            type="text"
            placeholder="Ask anything..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
        </form>
      </div>
    </div>
  );
}

export default ChatWindow;
