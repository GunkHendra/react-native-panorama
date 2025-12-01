export type SceneTypeValue = "sphere" | "cube" | "cylinder";

export interface SceneOption {
  label: string;
  value: SceneTypeValue;
}

export const SCENE_TYPES: SceneOption[] = [
  { label: "Sphere", value: "sphere" },
  { label: "Cube", value: "cube" },
  { label: "Cylinder", value: "cylinder" },
];
