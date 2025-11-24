import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

const { width } = Dimensions.get("window");

const html = `
<!doctype html>

<html>

  <head>

    <meta charset="utf-8" />

    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <style>

      body,

      html {

        margin: 0;

        padding: 0;

        height: 100%;

        overflow: hidden;

      }

      #panorama {

        width: 100%;

        height: 100vh;

      }

    </style>

    <link

      rel="stylesheet"

      href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"

    />

  </head>

  <body>

    <div id="panorama"></div>



    <script

      type="text/javascript"

      src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"

    ></script>



    <script>

      // --- 1. DATA DARI API KAMU (Paste JSON 'code' di sini) ---

      // Pastikan format string JSON di-escape dengan benar jika ditaruh di string JS

      const apiResponseCode = {

        scenes: {

          scene1: {

            type: "sphere",

            image:

              "upload/1/128/250226-128-1-360-Video-Featured-StudioBinder-Compressed.jpg",

            yaw: 251.8354,

            pitch: -10.2782,

            title: "Reception",

            hotSpots: [

              {

                title: "Tes hotspot",

                yaw: 211.337,

                pitch: -6.113,

                sceneId: "scene2",

              },

            ],

          },

          scene2: {

            type: "sphere",

            image: "upload/1/128/250226-128-1-banner-search-space.jpg",

            title: "Scene Kedua",

          },

        },

      };



      // --- PENTING: GANTI INI DENGAN DOMAIN ASLI KAMU ---

      // Karena gambar di JSON cuma "upload/...", WebView butuh alamat lengkap "https://..."

      const DOMAIN_URL = "https://virtuard.com/uploads/ipanoramaBuilder/";



      // --- 2. LOGIKA KONVERSI DATA ---

      function initPanorama() {

        try {

          const iPanoramaScenes = apiResponseCode.scenes;

          const pannellumScenes = {};

          let firstSceneId = null;



          // Loop semua scene

          for (const [key, sceneData] of Object.entries(iPanoramaScenes)) {

            if (!firstSceneId) firstSceneId = key; // Set scene pertama



            // Siapkan array hotspot untuk Pannellum

            let convertedHotspots = [];



            if (sceneData.hotSpots && Array.isArray(sceneData.hotSpots)) {

              sceneData.hotSpots.forEach((spot) => {

                convertedHotspots.push({

                  pitch: spot.pitch,

                  yaw: spot.yaw,

                  type: spot.sceneId ? "scene" : "info", // Kalau ada sceneId, berarti navigasi

                  text: spot.title,

                  sceneId: spot.sceneId, // ID tujuan saat diklik

                });

              });

            }



            // Masukkan ke format config Pannellum

            pannellumScenes[key] = {

              title: sceneData.title || key,

              type: "equirectangular",

              panorama: DOMAIN_URL + sceneData.image,

              yaw: sceneData.yaw || 0,

              pitch: sceneData.pitch || 0,

              hotSpots: convertedHotspots,

              crossOrigin: "anonymous",

            };

          }



          // --- 3. RENDER PANNELLUM ---

          pannellum.viewer("panorama", {

            default: {

              firstScene: firstSceneId,

              sceneFadeDuration: 1000,

              autoLoad: true,

              orientationOnByDefault: false, // Set true jika ingin gerak pakai sensor HP (gyroscope)

            },

            scenes: pannellumScenes,

          });

        } catch (error) {

          console.error("Error parsing config:", error);

          document.getElementById("panorama").innerHTML =

            "<h3 style='text-align:center; margin-top:50%'>Gagal memuat data panorama</h3>";

        }

      }



      // Jalankan

      initPanorama();

    </script>

  </body>

</html>
`;

const Panorama = () => (
  <View style={styles.container}>
    <WebView
      originWhitelist={["*"]}
      source={{
        html: html,
        baseUrl: "https://virtuard.com/"
      }}
      style={styles.viewer}
      javaScriptEnabled
      domStorageEnabled
      cacheEnabled={true}
      cacheMode="LOAD_CACHE_ELSE_NETWORK"
      allowFileAccess={true}
      allowUniversalAccessFromFileURLs={true}
      allowFileAccessFromFileURLs={true}
      onMessage={(e) => {
        console.log("Pannellum:", e.nativeEvent.data);
      }}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  viewer: { width, height: 230 },
});

export default Panorama;