import { PlayerConfig } from "@/interfaces/vtour";

export const generateVtourHTML = (apiData: Partial<PlayerConfig>, baseUrl: string): string => {

  const scenesData = apiData.scenes;

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
      html,
      body,
      #panorama {
        height: 100%;
        margin: 0;
        background: #000;
      }

      #customLoader {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.65);
        backdrop-filter: blur(4px);
        color: white;
        z-index: 9999;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-family: sans-serif;
      }

      .spinner {
        width: 50px;
        height: 50px;
        border: 6px solid rgba(255, 255, 255, 0.2);
        border-top: 6px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      #loadingScreen {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: #000;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 12px;
        z-index: 9999;
        color: white;
        font-family: sans-serif;
      }

      .spinner {
        border: 6px solid rgba(255, 255, 255, 0.2);
        border-top: 6px solid white;
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
      <div style="font-size: 14px">Loading panorama...</div>
    </div>
    <div id="customLoader">
      <div class="spinner"></div>
    </div>
    <div id="panorama"></div>
    
    <script>
      // ==========================================
      // BAGIAN DINAMIS (INJECTED DARI REACT NATIVE)
      // ==========================================
      
      const apiScenes = ${JSON.stringify(scenesData)};
      const baseUrl = "${baseUrl}";
      
      // Kita proses data dari API agar sesuai format Pannellum
      const processedScenes = {};
      let firstSceneId = null;

      // Helper untuk menggabungkan URL agar aman dari double slash
      const getFullUrl = (path) => {
         if (!path) return "";
         if (path.startsWith("http")) return path; // Jika sudah URL lengkap
         
         const cleanBase = baseUrl.endsWith('/') ? baseUrl : baseUrl + '/';
         const cleanPath = path.startsWith('/') ? path.substring(1) : path;
         return cleanBase + cleanPath;
      };

      // Loop data API dan konversi
      if (apiScenes) {
        Object.keys(apiScenes).forEach(key => {
            if (!firstSceneId) firstSceneId = key;
            
            const scene = apiScenes[key];
            
            // Konversi Hotspots
            const hotspots = (scene.hotSpots || []).map(spot => ({
                pitch: spot.pitch,
                yaw: spot.yaw,
                type: spot.sceneId ? "scene" : "info",
                text: spot.title,
                sceneId: spot.sceneId,
                targetYaw: spot.targetYaw || 0,     // Default value
                targetPitch: spot.targetPitch || 0  // Default value
            }));

            processedScenes[key] = {
                title: scene.title || key,
                type: "equirectangular",
                // API pakai 'image', Pannellum pakai 'panorama'
                panorama: getFullUrl(scene.image), 
                crossOrigin: "anonymous",
                yaw: scene.yaw || 0,
                pitch: scene.pitch || 0,
                hfov: 100,
                hotSpots: hotspots
            };
        });
      }

      // ==========================================
      // INISIALISASI VIEWER (KODE ASLI KAMU)
      // ==========================================

      var viewer = pannellum.viewer("panorama", {
        default: {
          firstScene: firstSceneId, // Menggunakan ID dinamis
          autoLoad: true,
          showControls: false,
          showLoader: false,
          showFullscreenCtrl: false,
          showZoomCtrl: false,
          sceneFadeDuration: 2000,
        },
        scenes: processedScenes, // Menggunakan object yang sudah diproses
      });

      const loader = document.getElementById("customLoader");

      // Show loader when switching scenes
      viewer.on("scenechange", function () {
        loader.style.display = "flex";
      });

      // Hide loader ONLY when the new scene is ready
      viewer.on("load", function () {
        loader.style.display = "none";
      });

      viewer.on("load", function () {
        // Hide loader only ONCE
        const loader = document.getElementById("loadingScreen");
        if (loader) loader.style.display = "none";
      });

      // Preload all scene images on startup
      var preloadedImages = {};
      Object.keys(viewer.getConfig().scenes).forEach(function (sceneId) {
        var scene = viewer.getConfig(sceneId);
        if (scene.panorama && !preloadedImages[scene.panorama]) {
          var img = new Image();
          img.crossOrigin = "anonymous";
          img.src = scene.panorama;
          preloadedImages[scene.panorama] = img;
        }
      });

      // Tap anywhere to log yaw/pitch
      viewer.on("mousedown", function (e) {
        var coords = viewer.mouseEventToCoords(e);
        var msg = JSON.stringify({
          type: "coords",
          yaw: coords[1],
          pitch: coords[0],
        });
        if (
          window.ReactNativeWebView &&
          window.ReactNativeWebView.postMessage
        ) {
          window.ReactNativeWebView.postMessage(msg);
        } else {
          console.log(msg);
        }
      });
    </script>
  </body>
</html>
  `;
};