export type Tool = "select" | "box" | "arrow" | "text";

export const TOOL_BUTTONS: Array<{
  tool: Tool;
  label: string;
  hotkey: string;
}> = [
  { tool: "select", label: "Select", hotkey: "V" },
  { tool: "box", label: "Box", hotkey: "B" },
  { tool: "arrow", label: "Arrow", hotkey: "A" },
  { tool: "text", label: "Text", hotkey: "T" },
];
