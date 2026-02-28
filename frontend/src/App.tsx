import { useEffect } from "react";
import "@xyflow/react/dist/style.css";
import "./App.css";
import Flow from "./components/Flow/Flow";
import HelperText from "./components/HelperText/HelperText";
import ChatWindow from "./components/ChatWindow/ChatWindow";
import Tools from "./components/Tools/Tools";
import { useToolContext } from "./context/useToolContext";

function App() {
  const { activeTool, setActiveTool } = useToolContext();

  // key event listener for setting our active tool
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      const focusedTag = (event.target as HTMLElement | null)?.tagName;
      if (focusedTag === "INPUT" || focusedTag === "TEXTAREA") {
        return;
      }

      switch (event.key.toLowerCase()) {
        case "v":
          setActiveTool("select");
          break;
        case "b":
          setActiveTool("box");
          break;
        case "n":
          setActiveTool("note");
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [setActiveTool]);

  return (
    <div className={`sketch-app sketch-app--${activeTool}`}>
      <Tools />
      <Flow />
      <HelperText />
      <div className="canvas-surface"></div>
      <ChatWindow />
    </div>
  );
}

export default App;
