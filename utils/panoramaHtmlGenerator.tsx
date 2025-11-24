// utils/htmlGenerator.ts

interface SceneConfig {
  scenes: Record<string, any>;
  [key: string]: any;
}

export const generatePanoramaHtml = (
  apiData: SceneConfig, 
  baseUrl: string
): string => {
  
  // Kita ubah object data menjadi string JSON agar bisa "ditanam" di dalam script HTML
  const rawDataString = JSON.stringify(apiData);

  return `
<!doctype html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css" />
    <script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"></script>
    <style>
      html, body, #panorama {
        height: 100%;
        margin: 0;
        background: #000;
      }

      /* --- CSS CUSTOM LOADER KAMU (PRESERVED) --- */
      #customLoader {
        display: none;
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0, 0, 0, 0.65);
        backdrop-filter: blur(4px);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      }

      #loadingScreen {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
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
        width: 50px;
        height: 50px;
        border: 6px solid rgba(255, 255, 255, 0.2);
        border-top: 6px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to { transform: rotate(360deg); }
      }

      /* Sembunyikan loader bawaan Pannellum agar tidak bentrok */
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
      <div style="font-size: 14px">Memuat data...</div>
    </div>

    <div id="customLoader" style="display:none;">
      <div class="spinner"></div>
    </div>

    <div id="panorama"></div>

    <script>
      // --- BAGIAN DINAMIS ---
      
      // 1. Terima data dari React Native
      const rawApiData = ${rawDataString};
      const DOMAIN_URL = "${baseUrl}";

      // 2. Fungsi untuk memproses data API menjadi Format Pannellum
      function processScenes(apiData) {
        const processedScenes = {};
        const sourceScenes = apiData.scenes || {};
        let firstSceneId = null;

        Object.keys(sourceScenes).forEach(key => {
          if (!firstSceneId) firstSceneId = key;
          
          const scene = sourceScenes[key];
          
          // Logic URL Gambar
          let imageUrl = scene.image;
          if (imageUrl && !imageUrl.startsWith('http')) {
             // Membersihkan slash ganda jika ada
             const cleanBase = DOMAIN_URL.replace(/\\/$/, ""); 
             const cleanPath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
             imageUrl = cleanBase + '/' + cleanPath;
          }

          // Logic Hotspots
          const processedHotspots = [];
          if (scene.hotSpots && Array.isArray(scene.hotSpots)) {
            scene.hotSpots.forEach(spot => {
              processedHotspots.push({
                pitch: spot.pitch,
                yaw: spot.yaw,
                type: spot.sceneId ? "scene" : "info", // Auto-detect tipe
                text: spot.title,
                sceneId: spot.sceneId,
                // Opsi tambahan jika ingin target view spesifik
                targetYaw: spot.targetYaw || 0,
                targetPitch: spot.targetPitch || 0
              });
            });
          }

          processedScenes[key] = {
            title: scene.title || key,
            type: "equirectangular",
            panorama: imageUrl,
            yaw: scene.yaw || 0,
            pitch: scene.pitch || 0,
            hotSpots: processedHotspots,
            crossOrigin: "anonymous" // PENTING UNTUK CORS
          };
        });

        return { scenes: processedScenes, firstSceneId };
      }

      // 3. Eksekusi Proses Data
      try {
        const data = processScenes(rawApiData);
        
        // --- INISIALISASI PANNELLUM DENGAN DATA DINAMIS ---
        var viewer = pannellum.viewer("panorama", {
          default: {
            firstScene: data.firstSceneId,
            autoLoad: true, // Biarkan true agar event 'load' terpanggil
            showControls: false, // Sesuai settingan kamu
            showLoader: false,   // Kita pakai loader custom
            sceneFadeDuration: 2000,
            orientationOnByDefault: false
          },
          scenes: data.scenes
        });

        // --- LOGIC CUSTOM LOADER KAMU (DIINTEGRASIKAN) ---
        
        const loadingScreen = document.getElementById("loadingScreen");
        const transitionLoader = document.getElementById("customLoader");

        // Event: Saat scene mulai berpindah/loading
        viewer.on("scenechange", function () {
          transitionLoader.style.display = "flex";
        });

        // Event: Saat scene selesai dimuat (gambar muncul)
        viewer.on("load", function () {
          // Hilangkan loader awal (hanya sekali)
          if (loadingScreen) loadingScreen.style.display = "none";
          
          // Hilangkan loader transisi
          transitionLoader.style.display = "none";
        });

        // Error Handling sederhana
        viewer.on("error", function(e) {
           console.error("Pannellum Error:", e);
           // Bisa update UI loadingScreen jadi pesan error jika mau
        });

        // --- LOGIC PRELOADER (Optional tapi Bagus) ---
        // Kita preload gambar agar transisi lebih mulus
        setTimeout(() => {
            const allScenes = viewer.getConfig().scenes;
            Object.keys(allScenes).forEach(function (sceneId) {
                var s = allScenes[sceneId];
                if (s.panorama) {
                    var img = new Image();
                    img.crossOrigin = "anonymous";
                    img.src = s.panorama;
                }
            });
        }, 3000); // Delay dikit biar gak berat di awal

        // --- CLICK LISTENER UTK DEBUGGING (Tetap dipertahankan) ---
        viewer.on("mousedown", function (e) {
          var coords = viewer.mouseEventToCoords(e);
          var msg = JSON.stringify({
            type: "coords",
            yaw: coords[1],
            pitch: coords[0],
          });
          if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
            window.ReactNativeWebView.postMessage(msg);
          } else {
            console.log(msg);
          }
        });

      } catch (err) {
        console.error("Gagal inisialisasi:", err);
        document.getElementById("loadingScreen").innerHTML = "Error loading tour data.";
      }

    </script>
  </body>
</html>
  `;
};