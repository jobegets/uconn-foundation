export type Tool = "select" | "box" | "note";

export const TOOL_BUTTONS: Array<{
  tool: Tool;
  label: string;
  hotkey: string;
}> = [
  { tool: "select", label: "Select", hotkey: "V" },
  { tool: "box", label: "Box", hotkey: "B" },
  { tool: "note", label: "Note", hotkey: "N" },
];
