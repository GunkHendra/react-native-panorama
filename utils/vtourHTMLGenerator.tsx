import { BASE_IMG_URL } from "@/constants/vtour";
import { PlayerConfig } from "@/interfaces/vtour";

interface generateVtourHTMLProps {
  vtourState: Partial<PlayerConfig>;
  activeSceneId?: string;
}

export const generateVtourHTML = ({ vtourState, activeSceneId }: generateVtourHTMLProps) => {
  return `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0" />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"
    />
    <script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"></script>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      html,
      body {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: fixed;
        background: transparent;
      }

      #panorama {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }

      #loadingScreen {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(240,240,240,0.5);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 12px;
        z-index: 9999;
        color: black;
        font-family: sans-serif;
      }

      .spinner {
        border: 6px solid rgba(200, 200, 200, 0.5);
        border-top: 6px solid black;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      #hotspotPickingUI {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(250, 250, 250, 0.5);
        display: none;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        z-index: 9999;
        color: white;
        font-family: sans-serif;
        pointer-events: none;
      }

      #hotspotPickingText {
        font-size: 14px;
        color: black;
        item-align: center;
        text-align: center;
      }

      .pnlm-load-box {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
      }
    </style>
  </head>
  <body>
    <div id="loadingScreen">
      <div class="spinner"></div>
    </div>
    <div id="hotspotPickingUI">
      <div id="hotspotPickingText">Tap anywhere to place the hotspot <br> You can still look around while in this mode</div>
    </div>
    <div id="panorama"></div>

    <script>
      const vtour = ${JSON.stringify(vtourState)};
      const scenes = ${JSON.stringify(vtourState.scenes || {})};
      const baseUrl = ${JSON.stringify(BASE_IMG_URL)};

      // Kita proses data dari API agar sesuai format Pannellum
      const processedScenes = {};
      let firstSceneId = ${JSON.stringify(activeSceneId || Object.keys(vtourState.scenes || {})[0] || "")};

      // Helper untuk menggabungkan URL agar aman dari double slash
      const getFullUrl = (path) => {
        if (!path) return "";
        if (path.startsWith("http")) return path; // Jika sudah URL lengkap

        const cleanBase = baseUrl.endsWith("/") ? baseUrl : baseUrl + "/";
        const cleanPath = path.startsWith("/") ? path.substring(1) : path;
        return cleanBase + cleanPath;
      };

      // Loop data API dan konversi
      if (scenes) {
        Object.keys(scenes).forEach((key) => {
          if (!firstSceneId) firstSceneId = key;

          const scene = scenes[key];

          // Konversi Hotspots
          const hotspots = (scene.hotSpots || []).map((spot) => ({
            pitch: parseFloat(spot.pitch),
            yaw: parseFloat(spot.yaw),
            type: spot.sceneId ? "scene" : "info",
            text: spot.title,
            sceneId: spot.sceneId,
            targetYaw: spot.targetYaw || 0, // Default value
            targetPitch: spot.targetPitch || 0, // Default value
          }));

          processedScenes[key] = {
            // title: scene.title ?? key,
            type: "equirectangular",
            panorama: getFullUrl(scene.image),
            preview: getFullUrl(vtour.imagePreview),
            crossOrigin: "anonymous",
            yaw: parseFloat(scene.yaw) || 0, 
            pitch: parseFloat(scene.pitch) || 0,
            hfov: 100,
            hotSpots: hotspots,
          };
        });
      }

      // Initialize Pannellum viewer
      var viewer = pannellum.viewer("panorama", {
        default: {
          firstScene: firstSceneId, // Starting scene
          autoLoad: vtour.autoLoad !== false,
          showControls: false,
          showLoader: false,
          showFullscreenCtrl: vtour.showFullscreenCtrl !== false,
          showZoomCtrl: vtour.showZoomCtrl !== false,
          sceneFadeDuration: vtour.sceneFadeDuration || 3000,
          autoRotate: vtour.autoRotate ? vtour.autoRotateSpeed : 0, 
          autoRotateInactivityDelay: vtour.autoRotate ? vtour.autoRotateInactivityDelay : 3000,
        },
        scenes: processedScenes, // use the processed scenes
      });

      const loader = document.getElementById("loadingScreen");

      // Show loader when switching scenes
      viewer.on("scenechange", function () {
        loader.style.display = "flex";
      });

      viewer.on("load", function () {
        const currentSceneId = window.viewer.getScene();

        // FORCED YAW: fix initial yaw if set to 0 even though config has a different yaw
        const config = processedScenes[currentSceneId];
        if (viewer.getYaw() === 0 && config.yaw !== 0) {
            viewer.setYaw(config.yaw, false);
            viewer.setPitch(config.pitch, false);
        }

        loader.style.display = "none";

        // Send message to Parent React Native Component
        const msg = JSON.stringify({
          type: "sceneChange",
          sceneId: currentSceneId,
        });

        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(msg);
        } else {
          console.log(msg);
        }
      });

      let isPickingHotspot = false;
      let hotspotPickingUI = document.getElementById("hotspotPickingUI");

      function enableHotspotPicking() {
        isPickingHotspot = true;
        showHotspotPickingUI();
      }

      function disableHotspotPicking() {
        isPickingHotspot = false;
        hideHotspotPickingUI();
      }

      function showHotspotPickingUI() {
        if (!hotspotPickingUI) return;
        hotspotPickingUI.style.display = "flex";
      }

      function hideHotspotPickingUI() {
        if (hotspotPickingUI) {
          hotspotPickingUI.style.display = "none";
        }
      }

      // Tap anywhere to log yaw/pitch
      viewer.on("mousedown", function (e) {
        if (!isPickingHotspot) return;

        const coords = viewer.mouseEventToCoords(e);

        const msg = JSON.stringify({
          type: "hotspotCoords",
          yaw: coords[1],
          pitch: coords[0],
        });

        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(msg);
        } else {
          console.log(msg);
        }

        disableHotspotPicking();
      });
    </script>
  </body>
</html>
  `;
};