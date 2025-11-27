import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

const { width } = Dimensions.get("window");

const html = ``;

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