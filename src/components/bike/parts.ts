import type { Vector3Tuple } from "three";

export type PartId =
  | "frame"
  | "tank"
  | "seat"
  | "tail"
  | "nose"
  | "screen"
  | "engine"
  | "exhaust"
  | "swingarm"
  | "forkL"
  | "forkR"
  | "bars"
  | "wheelF"
  | "wheelR"
  | "discF"
  | "discR"
  | "winglet";

export type PartSpec = {
  id: PartId;
  /** assembled local position */
  to: Vector3Tuple;
  /** exploded offset added to `to` */
  offset: Vector3Tuple;
  /** exploded extra rotation (radians) */
  spin: Vector3Tuple;
  /** 0..1 point in the assembly timeline where this part locks in */
  order: number;
};

export const PARTS: PartSpec[] = [
  { id: "frame", to: [0, 0.05, 0], offset: [0, 0.15, 0], spin: [0, 0.1, 0], order: 0.0 },
  { id: "engine", to: [-0.05, -0.28, 0], offset: [0, -1.35, 0], spin: [0.3, 0.4, 0], order: 0.06 },
  { id: "swingarm", to: [-0.95, -0.22, 0], offset: [-1.5, -0.7, 0], spin: [0, 0, 0.4], order: 0.14 },
  { id: "forkL", to: [1.06, -0.1, 0.2], offset: [1.5, 1.0, 0.5], spin: [0.4, 0, 0.3], order: 0.2 },
  { id: "forkR", to: [1.06, -0.1, -0.2], offset: [1.5, 1.0, -0.5], spin: [0.4, 0, 0.3], order: 0.22 },
  { id: "wheelR", to: [-1.58, -0.5, 0], offset: [-2.6, -0.2, 0], spin: [0, 0.6, 1.1], order: 0.3 },
  { id: "discR", to: [-1.58, -0.5, 0.2], offset: [-2.9, 0.6, 1.0], spin: [0.5, 0.8, 0.6], order: 0.36 },
  { id: "wheelF", to: [1.62, -0.5, 0], offset: [2.7, 0.1, 0], spin: [0, -0.6, -1.1], order: 0.34 },
  { id: "discF", to: [1.62, -0.5, 0.2], offset: [3.0, 0.9, 1.0], spin: [0.5, -0.8, 0.6], order: 0.4 },
  { id: "exhaust", to: [-0.75, -0.5, -0.18], offset: [-1.1, -1.5, -1.1], spin: [0.2, 0.5, 0.6], order: 0.46 },
  { id: "tank", to: [0.28, 0.42, 0], offset: [0.2, 1.5, 0], spin: [0.25, 0, 0.15], order: 0.54 },
  { id: "seat", to: [-0.62, 0.42, 0], offset: [-0.5, 1.5, 0.2], spin: [0.2, 0.3, 0], order: 0.6 },
  { id: "tail", to: [-1.15, 0.5, 0], offset: [-1.6, 1.7, 0], spin: [0.4, 0.2, 0.3], order: 0.66 },
  { id: "nose", to: [1.22, 0.3, 0], offset: [2.1, 1.3, 0], spin: [0.3, 0.4, 0.2], order: 0.74 },
  { id: "screen", to: [0.98, 0.62, 0], offset: [1.6, 1.9, 0], spin: [0.5, 0.2, 0], order: 0.8 },
  { id: "winglet", to: [1.0, 0.12, 0], offset: [1.9, -0.9, 1.2], spin: [0.3, 0.6, 0.4], order: 0.86 },
  { id: "bars", to: [0.86, 0.72, 0], offset: [1.2, 2.0, 0], spin: [0.4, 0.5, 0.3], order: 0.92 },
];

/** Labels that annotate the exploded stage. */
export const CALLOUTS = [
  { label: "Monocoque carbon frame", value: "7.4 kg" },
  { label: "Axial-flux drive unit", value: "214 hp" },
  { label: "Forged titanium swingarm", value: "1.9 kg" },
  { label: "Active aero winglets", value: "38 kg @ 250" },
];
