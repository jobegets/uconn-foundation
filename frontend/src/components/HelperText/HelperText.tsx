import { useMemo } from "react";
import { useToolContext } from "../../context/useToolContext";
import "./styles.css";

function HelperText() {
  const { activeTool } = useToolContext();

  const helperText = useMemo(() => {
    if (activeTool === "box") {
      return "Box tool: click the canvas to place a new box.";
    }
    if (activeTool === "note") {
      return "Note tool: click the canvas to place new note.";
    }
    return "Select tool: move nodes, pan, and double-click a node to edit text.";
  }, [activeTool]);

  return <div className="helper-note">{helperText}</div>;
}

export default HelperText;
