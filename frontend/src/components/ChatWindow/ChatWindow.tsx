import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowUpTrayIcon } from "@heroicons/react/16/solid";
import type { Edge } from "@xyflow/react";
import { useFlowGraphContext } from "../../context/useFlowGraphContext";
import type { FlowNode } from "../../context/flow-graph-context";
import "./styles.css";

const MOCK_DATA = {
  topic: "Circle",
  summary:
    "A circle is a set of points in a plane that are all the same distance from a fixed point called the center; the constant distance is the radius. The longest distance across the circle passing through the center is the diameter, which is twice the radius. The line that goes around the edge of the circle is the circumference. A straight line that joins two points on the circle is a chord, and the part of the circle between two points is an arc. A region bounded by two radii and the included arc is a sector. These basic terms form the foundation for understanding circles in geometry.",
  children: [
    {
      topic: "Euclidean plane geometry",
      summary:
        "Euclidean plane geometry studies flat shapes made of points, lines, and segments that lie on a two‑dimensional surface called a plane. The basic objects are points (locations with no size), lines (infinite straight paths), line segments (finite parts of lines), and rays (half‑lines starting at a point). Angles are formed where two rays meet, and they are measured in degrees. Common figures include triangles, quadrilaterals, circles, and polygons, each defined by their sides and angles. Key concepts are parallel lines (lines that never meet), perpendicular lines (lines that meet at a right angle), congruence (exact same size and shape), and similarity (same shape but different size). Euclid’s five postulates, especially the parallel postulate, provide the foundational rules for reasoning and proofs. Constructions using only a compass and straightedge illustrate how to create basic figures and prove geometric properties. Understanding terms such as vertex, side, interior, exterior, bisector, and midpoint is essential for solving problems and building more advanced topics like coordinate geometry and transformations.",
    },
    {
      topic: "Distance formula",
      summary:
        "The distance formula gives the straight‑line length between two points on a plane by using their x and y coordinates; it comes from the Pythagorean theorem. Important terms include point, coordinate, x‑value, y‑value, difference, square, sum, square root, and Euclidean distance. In three dimensions a similar idea adds the z coordinate. This method is used to measure lengths of line segments, find distances in geometry, physics, and many real‑world applications.",
    },
    {
      topic: "Radius",
      summary:
        "The radius is the distance from the center of a circle or sphere to any point on its edge or surface. It is half the length of the diameter, which stretches across the shape through the center. In a circle, all radii are equal, giving the shape its symmetry. In three‑dimensional objects like spheres and cylinders, the radius still measures from the central axis or point to the outer boundary. Knowing the radius helps calculate size, area, and volume in geometry.",
    },
    {
      topic: "Diameter",
      summary:
        "The diameter of a circle is the longest straight line that passes through the center, connecting two points on the circle’s edge. It is twice the length of the radius, which is the distance from the center to any point on the edge. Because it goes through the center, the diameter also divides the circle into two equal halves and is a special type of chord that has the greatest possible length. Knowing the diameter helps calculate other properties such as the circle’s circumference and area.",
    },
    {
      topic: "Circumference",
      summary:
        "The circumference is the distance around a circle, essentially the circle’s perimeter. Key terms to know are radius (the distance from the center to the edge) and diameter (twice the radius). The length of the circumference increases with the size of the circle and is commonly related to the constant pi, which is the ratio of circumference to diameter. You can measure it directly with a flexible tape or determine it from the radius or diameter.",
    },
    {
      topic: "Chord",
      summary:
        "A chord is a group of notes sounded together, typically built from a root note and stacked in thirds; basic types include major, minor, diminished, and augmented, each defined by the intervals between the notes. Key terms are root (the base note), third (the note a third above the root), fifth (the note a fifth above), seventh (an added note for richer harmony), inversion (reordering the notes so a different note is the lowest), and voicing (the specific arrangement of the notes). Chords provide the harmonic foundation of music and are written with symbols such as C, Am, or G7 to indicate their quality and any added tones.",
    },
    {
      topic: "Arc",
      summary:
        "An arc is a portion of a circle’s circumference between two points called endpoints. The line segment joining the endpoints is the chord, while the distance from the center of the circle to the middle of the arc is the radius. The size of an arc can be described by its length or by the angle it subtends at the circle’s center, known as the central angle. A minor arc is the shorter path between the endpoints, whereas a major arc is the longer one. Understanding arcs involves the concepts of circle, radius, chord, central angle, and the distinction between minor and major arcs.",
    },
    {
      topic: "Sector",
      summary:
        "A sector is a broad area of economic activity that groups together businesses and organizations with similar functions or products. The main sectors are the primary sector (extraction of natural resources), the secondary sector (manufacturing and construction), and the tertiary sector (services such as retail, finance, and health care). Within each sector there can be subsectors that focus on more specific activities, like automotive manufacturing in the secondary sector or banking in the tertiary sector. Understanding sectors helps analysts compare market performance, investors allocate capital, and policymakers design regulations. Key terms to know include industry, market segment, subsector, and economic classification.",
    },
  ],
};

type SummaryTree = {
  topic: string;
  summary: string;
  children?: SummaryTree[];
};

const ROOT_Y = 100;
const CHILDREN_Y = 360;
const CHILD_X_GAP = 320;
const START_X = 140;

function buildGraphFromSummaryTree(root: SummaryTree): {
  nodes: FlowNode[];
  edges: Edge[];
} {
  const rootId = "summary-root";
  const children = root.children ?? [];

  // Constraint: one children array level for now (root -> children).
  const rootNode: FlowNode = {
    id: rootId,
    type: "summary",
    position: {
      x: START_X + (Math.max(children.length - 1, 0) * CHILD_X_GAP) / 2,
      y: ROOT_Y,
    },
    data: {
      label: root.topic,
      summary: root.summary,
    },
  };

  const childNodes: FlowNode[] = children.map((child, index) => ({
    id: `summary-child-${index}`,
    type: "summary",
    position: {
      x: START_X + index * CHILD_X_GAP,
      y: CHILDREN_Y,
    },
    data: {
      label: child.topic,
      summary: child.summary,
    },
  }));

  const childEdges: Edge[] = childNodes.map((childNode) => ({
    id: `edge-${rootId}-${childNode.id}`,
    source: rootId,
    target: childNode.id,
  }));

  return { nodes: [rootNode, ...childNodes], edges: childEdges };
}

function ChatWindow() {
  const { setNodes, setEdges } = useFlowGraphContext();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const focusedTag = (event.target as HTMLElement | null)?.tagName;
      if (focusedTag === "INPUT" || focusedTag === "TEXTAREA") {
        return;
      }

      if (event.key === "=") {
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

    const prompt = message.trim();
    if (!prompt) return;

    setMessage("");
    const response = await fetch(
      `https://uconn-foundation-backend.vercel.app/studymap?prompt=${prompt}`,
    );
    const data = await response.json();
    const { nodes, edges } = buildGraphFromSummaryTree(data);
    setNodes(nodes);
    setEdges(edges);
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
