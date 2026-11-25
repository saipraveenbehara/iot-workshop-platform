export interface ConceptByte {
  id: string;
  title: string;
  metaphor: string;
  readTimeSeconds: number;
  svgType: string;
  keyTakeaways: string[];
  analogyStory: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
}

export interface CircuitStep {
  stepNumber: number;
  title: string;
  instruction: string;
  component: string;
  fromPin: string;
  toBreadboardHole: string; // e.g. "Row 15, Col E"
  color: string;
  polarityNote?: string;
  // Matrix coordinates for breadboard SVG:
  fromCoords?: { x: number; y: number; label: string };
  toCoords?: { x: number; y: number; label: string };
}

export interface CodeChunk {
  blockId: string;
  title: string;
  language: "c" | "cpp" | "python";
  code: string;
  explanation: string;
  isConfigurable?: boolean;
}

export interface LevelData {
  levelNumber: number;
  id: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  conceptByte: ConceptByte;
  quizGate: QuizQuestion[];
  circuitSteps: CircuitStep[];
  codeChunks: CodeChunk[];
  fullScript: string;
  verificationChallenge: {
    instruction: string;
    expectedObservableResult: string;
  };
}
