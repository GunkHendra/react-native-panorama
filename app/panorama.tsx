// ...existing code...
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

const { width } = Dimensions.get("window");
const panoUrl =
    // "https://raw.githubusercontent.com/googlevr/gvr-android-sdk/master/assets/panoramas/testRoom1_2kMono.jpg";
    "https://ibb.co.com/JRh7KNwS";

const html =
    `<!doctype html>
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
  pannellum.viewer('panorama', {
    type: 'equirectangular',
    panorama: '${panoUrl}',
    autoLoad: true,
    showZoomCtrl: true
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
        />
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1 },
    viewer: { width, height: 230 },
});

export default Panorama;