// ...existing code...
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

const { width } = Dimensions.get("window");

// Define your tour scenes (add as many as you need)
const scenes = {
    spotA: {
        title: "Spot A",
        type: "equirectangular",
        panorama: "https://raw.githubusercontent.com/GunkHendra/tes/refs/heads/master/assets/panorama.jpg?token=GHSAT0AAAAAADNM7FMU6M5FXR4R3BVP6Z5C2IZWBQA",
        crossOrigin: "anonymous",
        yaw: 0,
        pitch: 0,
        hfov: 100,
        hotSpots: [
            {
                // Position of the clickable point (adjust using the yaw/pitch logger below)
                pitch: 2,
                yaw: 90,
                type: "scene",
                text: "Go to Spot B",
                sceneId: "spotB",
                targetYaw: 0,
                targetPitch: 0
            }
        ]
    },
    spotB: {
        title: "Spot B",
        type: "equirectangular",
        panorama: "https://raw.githubusercontent.com/GunkHendra/tes/refs/heads/master/assets/panorama-2.jpg?token=GHSAT0AAAAAADNM7FMV4JCXNMRBF3XYDCKI2IZWCHA",
        crossOrigin: "anonymous",
        yaw: 180,
        pitch: 0,
        hfov: 100,
        hotSpots: [
            {
                pitch: 0,
                yaw: -90,
                type: "scene",
                text: "Back to Spot A",
                sceneId: "spotA",
                targetYaw: 0,
                targetPitch: 0
            }
        ]
    }
};

const html = `<!doctype html>
<html>
<head>
<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"/>
<script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"></script>
<style>html,body,#panorama{height:100%;margin:0;background:#000}</style>
</head>
<body>
<div id="panorama"></div>
<script>
  var viewer = pannellum.viewer('panorama', {
    default: {
      firstScene: 'spotA',
      autoLoad: true,
      showZoomCtrl: true
    },
    scenes: ${JSON.stringify(scenes)}
  });

  // Preload all scene images on startup
  var preloadedImages = {};
  Object.keys(viewer.getConfig().scenes).forEach(function(sceneId) {
    var scene = viewer.getConfig(sceneId);
    if (scene.panorama && !preloadedImages[scene.panorama]) {
      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = scene.panorama;
      preloadedImages[scene.panorama] = img;
    }
  });

  // Tap anywhere to log yaw/pitch so you can place hotspots precisely
  viewer.on('mousedown', function(e) {
    var coords = viewer.mouseEventToCoords(e);
    var msg = JSON.stringify({ type: 'coords', yaw: coords[1], pitch: coords[0] });
    if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
      window.ReactNativeWebView.postMessage(msg);
    } else {
      console.log(msg);
    }
  });
</script>
</body>
</html>`;

const Panorama = () => (
    <View style={styles.container}>
        <WebView
            originWhitelist={["*"]}
            source={{ html }}
            style={styles.viewer}
            javaScriptEnabled
            domStorageEnabled
            cacheEnabled={true}
            cacheMode="LOAD_CACHE_ELSE_NETWORK"
            onMessage={(e) => {
                // See yaw/pitch in Metro console to place hotspots:
                // Example output: {"type":"coords","yaw":123.4,"pitch":-5.6}
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
// ...existing code...