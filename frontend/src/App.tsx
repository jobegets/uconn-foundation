import { useEffect } from "react";
import "@xyflow/react/dist/style.css";
import "./App.css";
import Flow from "./components/Flow/Flow";
import HelperText from "./components/HelperText/HelperText";
import ChatWindow from "./components/ChatWindow/ChatWindow";
import Tools from "./components/Tools/Tools";
import { useToolContext } from "./context/useToolContext";
import { PuffLoader } from "react-spinners";

function App() {
  const { activeTool, setActiveTool, loadingState } = useToolContext();

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
      <PuffLoader
        loading={loadingState}
        color="#000000"
        size={50}
        cssOverride={{
          position: "fixed",
          top: "50%",
          left: "50%",
          zIndex: 1000,
        }}
      />
      <div className="canvas-surface"></div>
      <ChatWindow />
    </div>
  );
}

export default App;
