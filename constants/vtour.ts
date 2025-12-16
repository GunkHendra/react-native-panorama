import { PlayerHotspot, PlayerScene, SceneOption } from "@/interfaces/vtour";

export const BASE_IMG_URL = "https://virtuard.com/uploads/ipanoramaBuilder/";

export const SCENE_TYPES: SceneOption[] = [
  { label: "Sphere", value: "sphere" },
  { label: "Cube", value: "cube" },
  { label: "Cylinder", value: "cylinder" },
];

export const defaultBlankVtourScene: PlayerScene = {
  title: "",
  titleHtml: false,
  titleSelector: null,
  type: "",
  image: "",
  hotSpots: [],
  cubeTextureCount: "single",
  sphereWidthSegments: 100,
  sphereHeightSegments: 40,
  thumb: false,
  yaw: 0,
  pitch: 0,
  zoom: 1,
  saveCamera: true,
};

export const defaultBlankVtourHotspot = (index: number): PlayerHotspot => ({
  title: "Hotspot " + (index + 1),
  yaw: 0,
  pitch: 0,
  sceneId: "",
  imageUrl: null,
  imageWidth: null,
  imageHeight: null,
  link: null,
  linkNewWindow: false,
  popoverHtml: true,
  popoverContent: null,
  popoverSelector: null,
  popoverLazyload: true,
  popoverShow: false,
});
