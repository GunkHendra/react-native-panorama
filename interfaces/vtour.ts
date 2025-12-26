// ==========================================
// LAYER 1: Player Configuration
// ==========================================

// ==========================================
// 1. Hotspot Definition (Inside the Player)
// ==========================================
export interface PlayerHotspot {
  title: string;
  yaw: number;
  pitch: number;
  sceneId: string; // The ID of the scene this hotspot links to

  // Image properties (Nullable in your JSON)
  imageUrl: string | null;
  imageWidth: number | null;
  imageHeight: number | null;

  // Link properties
  link: string | null;
  linkNewWindow: boolean;

  // Popover properties
  popoverHtml: boolean;
  popoverContent: string | null;
  popoverSelector: string | null;
  popoverLazyload: boolean;
  popoverShow: boolean;
}

// ==========================================
// 2. Scene Definition
// ==========================================
export interface PlayerScene {
  type: string; // e.g., "sphere"
  cubeTextureCount: string; // e.g., "single"
  sphereWidthSegments: number;
  sphereHeightSegments: number;

  image: string; // URL path

  // Thumbnails
  thumb: boolean;
  thumbImage?: string; // Optional because scene2 doesn't have it in your JSON, but scene1 does

  // Camera positioning
  yaw: number;
  pitch: number;
  zoom: number;
  saveCamera: boolean;

  // Title settings
  title: string | null;
  titleHtml: boolean;
  titleSelector: string | null;

  // Hotspots Array
  hotSpots: PlayerHotspot[];
}

// ==========================================
// 3. Main Player Configuration (The Root)
// ==========================================
export interface PlayerConfig {
  theme: string;
  imagePreview: string | null;

  // Auto Load/Rotate Settings
  autoLoad: boolean;
  autoRotate: boolean;
  autoRotateSpeed: number;
  autoRotateInactivityDelay: number;
  autoRotateControl: boolean;

  // Mouse/Input Interactions
  mouseWheelPreventDefault: boolean;
  mouseWheelRotate: boolean;
  mouseWheelRotateCoef: number;
  mouseWheelZoom: boolean;
  mouseWheelZoomCoef: number;
  hoverGrab: boolean;
  hoverGrabYawCoef: number;
  hoverGrabPitchCoef: number;
  grab: boolean;
  grabCoef: number;
  pinchZoom: boolean;
  pinchZoomCoef: number;

  // UI Controls Visibility
  showControlsOnHover: boolean;
  showSceneThumbsCtrl: boolean;
  showSceneMenuCtrl: boolean;
  showSceneNextPrevCtrl: boolean;
  showShareCtrl: boolean;
  showZoomCtrl: boolean;
  showFullscreenCtrl: boolean;
  showAutoRotateCtrl: boolean;

  // Scene Navigation & Thumbnails
  sceneThumbsVertical: boolean;
  sceneThumbsStatic: boolean;
  sceneNextPrevLoop: boolean;
  sceneId: string; // The starting scene ID
  sceneFadeDuration: number;
  sceneBackgroundLoad: boolean;

  // General UI Elements
  title: boolean;
  compass: boolean;
  keyboardNav: boolean;
  keyboardZoom: boolean;
  mobile: boolean;

  // Popover Global Settings
  popover: boolean;
  popoverPlacement: string; // e.g., "top"
  hotSpotBelowPopover: boolean;
  popoverShowTrigger: string; // e.g., "hover"
  popoverHideTrigger: string; // e.g., "leave"

  // ⚠️ THE KEY PART: Scenes are a Record (Dictionary), not an Array
  scenes: Record<string, PlayerScene>;
}

// ==========================================
// LAYER 1: Editor Configuration
// ==========================================
// ==========================================
// 1. Shared / Helper Types
// ==========================================
export interface EditorImageResource {
  isCustom: boolean;
  url: string | null;
  width?: number | null; // Used in hotspots
  height?: number | null; // Used in hotspots
  isActive?: boolean; // Used in global imagePreview
}

// ==========================================
// 2. Hotspot Definition (Editor Version)
// ==========================================
export interface EditorHotspotConfig {
  title: string | null;
  yaw: number;
  pitch: number;
  sceneId: string;

  // Visuals
  image: EditorImageResource;
  custom: boolean;
  customClassName: string | null;
  customContent: string | null;
  userData: any | null; // Often null, but could be user-defined object

  // Link & Interaction
  link: string | null;
  linkNewWindow: boolean;

  // Popover Settings
  popover: boolean;
  popoverLazyload: boolean;
  popoverShow: boolean;
  popoverContent: string | null;
  popoverHtml: boolean;
  popoverSelector: string | null;
  popoverPlacement: string; // e.g., "default"
  popoverWidth: number | null;
}

// ⚠️ WRAPPER: The Editor wraps the config with UI state
export interface EditorHotspotWrapper {
  id: string; // "Hotspot 1"
  isSelected: boolean;
  isVisible: boolean;
  config: EditorHotspotConfig;
}

// ==========================================
// 3. Scene Definition (Editor Version)
// ==========================================
export interface EditorSceneConfig {
  title: string | null;
  titleHtml: boolean;
  titleSelector: string | null;

  type: string; // "sphere"
  cubeTextureCount: string; // "single"
  sphereWidthSegments: number;
  sphereHeightSegments: number;

  // Thumbnails & Images
  thumb: boolean;
  thumbImage: EditorImageResource;
  imageFront: EditorImageResource;
  imageBack: EditorImageResource;
  imageLeft: EditorImageResource;
  imageRight: EditorImageResource;
  imageTop: EditorImageResource;
  imageBottom: EditorImageResource;

  // Camera & Limits
  yaw: number;
  pitch: number;
  zoom: number;
  compassNorthOffset: number | null;
  saveCamera: boolean;

  // Limits (Not present in Player config usually)
  pitchLimits: boolean;
  pitchLimitUp: number;
  pitchLimitDown: number;
  yawLimits: boolean;
  yawLimitLeft: number;
  yawLimitRight: number;

  // Hotspots are wrapped here too
  hotspots: EditorHotspotWrapper[];
}

// ⚠️ WRAPPER: The Editor wraps the scene
export interface EditorSceneWrapper {
  id: string; // "Scene 1"
  isSelected: boolean;
  isVisible: boolean;
  yaw: number; // Preview yaw in editor
  pitch: number; // Preview pitch in editor
  zoom: number; // Preview zoom in editor
  config: EditorSceneConfig;
}

// ==========================================
// 4. Editor UI State (Tabs, Folding, Global)
// ==========================================

// Which sections are collapsed in the UI?
export interface EditorFoldedSections {
  size: boolean;
  theme: boolean;
  imagePreview: boolean;
  actions: boolean;
  controls: boolean;
  popover: boolean;
  customCSS: boolean;
  customJS: boolean;
  sceneSettings: boolean;
  hotspotTargetTool: boolean;
  hotspotLocation: boolean;
  hotspotSettings: boolean;
  hotspotPopover: boolean;
}

// Which tab is currently active?
export interface EditorTabState {
  id: string;
  isActive: boolean;
}

export interface EditorTabPanel {
  general: EditorTabState;
  scenes: EditorTabState;
  hotspots: EditorTabState;
}

// Global overrides (mostly booleans in your JSON)
// Using Record<string, any> is safest here as it duplicates the config keys
export type EditorGlobalOverrides = Record<
  string,
  boolean | string | number | null
>;

// ==========================================
// 5. Main Editor Configuration (The Root)
// ==========================================
export interface EditorConfigData {
  // Appearance
  theme: string;
  imagePreview: EditorImageResource;

  // Auto Load/Rotate
  autoLoad: boolean;
  autoRotate: boolean;
  autoRotateSpeed: number;
  autoRotateInactivityDelay: number;

  // Input Settings
  mouseWheelPreventDefault: boolean;
  mouseWheelRotate: boolean;
  mouseWheelRotateCoef: number;
  mouseWheelZoom: boolean;
  mouseWheelZoomCoef: number;
  hoverGrab: boolean;
  hoverGrabYawCoef: number;
  hoverGrabPitchCoef: number;
  grab: boolean;
  grabCoef: number;
  pinchZoom: boolean;
  pinchZoomCoef: number;

  // UI Controls
  showControlsOnHover: boolean;
  showSceneThumbsCtrl: boolean;
  showSceneMenuCtrl: boolean;
  showSceneNextPrevCtrl: boolean;
  showShareCtrl: boolean;
  showZoomCtrl: boolean;
  showFullscreenCtrl: boolean;
  showAutoRotateCtrl: boolean;
  sceneThumbsVertical: boolean;
  sceneThumbsStatic: boolean;
  title: boolean;
  compass: boolean;
  keyboardNav: boolean;
  keyboardZoom: boolean;
  sceneNextPrevLoop: boolean;
  mobile: boolean;

  // Popover Global Config
  popover: boolean;
  popoverTemplate: string; // HTML string
  popoverPlacement: string;
  hotSpotBelowPopover: boolean;
  popoverShowTriggerHover: boolean;
  popoverShowTriggerClick: boolean;
  popoverHideTriggerLeave: boolean;
  popoverHideTriggerClick: boolean;
  popoverHideTriggerGrab: boolean;
  popoverHideTriggerManual: boolean;
  popoverShowClass: string | null;
  popoverHideClass: string | null;

  // Scene Management
  sceneFadeDuration: number;
  sceneBackgroundLoad: boolean;
  sceneId: string | null; // Currently selected scene ID in editor

  // ⚠️ THE KEY PART: Scenes are an Array of Wrappers
  scenes: EditorSceneWrapper[];

  // Editor Specifics
  foldedSections: EditorFoldedSections;
  tabPanel: EditorTabPanel;
  global: EditorGlobalOverrides;
}

// The Top-Level Object
export interface EditorConfig {
  id: string;
  name: string;
  config: EditorConfigData;
}

// ==========================================
// LAYER 2: The API Response (Network Layer)
// ==========================================
export interface VTourApiResponse<T> {
  status: string;
  data: T;
}

export interface DirectoryItem {
  type: "directory";
  name: string;
  files: {
    type: "file";
    name: string;
  }[];
}

// ==========================================
// LAYER 3: The App Data (Domain Layer)
// ==========================================

export interface VTour {
  id: number;
  user_id: number;
  title: string;
  thumb: string;
  code: Partial<PlayerConfig>; // Parsed from 'code'
  json_data: Partial<EditorConfig>; // Parsed from 'json_data'
  status: "draft" | "publish";
}

export interface VTourStringified {
  id: number;
  user_id: number;
  title: string;
  thumb: string;
  code: string; // Stringified JSON
  json_data: string; // Stringified JSON
  status: "draft" | "publish";
}
export interface SceneOption {
  label: string;
  value: "sphere" | "cube" | "cylinder";
}

export type VtourParams = {
  TOUR_ID: string;
  USER_ID: string;
};
