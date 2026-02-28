import { useMemo } from "react";
import { useToolContext } from "../../context/useToolContext";
import "./styles.css";

function HelperText() {
  const { activeTool } = useToolContext();

  const helperText = useMemo(() => {
    if (activeTool === "box") {
      return "Box tool: click the canvas to place a new box.";
    }
    if (activeTool === "text") {
      return "Text tool: click the canvas to place new text.";
    }
    if (activeTool === "arrow") {
      return "Arrow tool: drag from one node handle to another to connect.";
    }
    return "Select tool: move nodes, pan, and double-click a node to edit text.";
  }, [activeTool]);

  return <div className="helper-note">{helperText}</div>;
}

export default HelperText;
