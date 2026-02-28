import { TOOL_BUTTONS } from "../../constants/react-flow";
import { useToolContext } from "../../context/useToolContext";
import "./styles.css";

export default function Tools() {
  const { activeTool, setActiveTool } = useToolContext();
  return (
    <header className="top-toolbar" role="toolbar" aria-label="Drawing tools">
      <div className="top-toolbar__group">
        {TOOL_BUTTONS.map((button) => (
          <button
            type="button"
            key={button.tool}
            className={`tool-button${activeTool === button.tool ? " is-active" : ""}`}
            onClick={() => setActiveTool(button.tool)}
          >
            <span className="tool-button__label">{button.label}</span>
            <span className="tool-button__hotkey">{button.hotkey}</span>
          </button>
        ))}
      </div>
    </header>
  );
}
