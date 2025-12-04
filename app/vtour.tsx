import { PlayerConfig } from "@/interfaces/vtour";
import { generateVtourHTML } from "@/utils/vtourHTMLGenerator";
import React, { useEffect, useRef } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

const { width } = Dimensions.get("window");

const Vtour = ({ vtour, BASE_IMG_URL, activeSceneId, onSceneChange }: { vtour: Partial<PlayerConfig>, BASE_IMG_URL: string, activeSceneId: string, onSceneChange: (id: string) => void }) => {
  const webViewRef = useRef<WebView>(null);
  const htmlContent = React.useMemo(() => {
    return generateVtourHTML(vtour, BASE_IMG_URL, activeSceneId);
  }, [vtour, BASE_IMG_URL]);

  useEffect(() => {
    if (webViewRef.current && activeSceneId) {
      const script = `
        if (window.viewer && typeof window.viewer.getScene === 'function') {
           if (window.viewer.getScene() !== "${activeSceneId}") {
             window.viewer.loadScene("${activeSceneId}");
           }
        }
      `;
      webViewRef.current.injectJavaScript(script);
    }
  }, [activeSceneId]);

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === "sceneChange") {
        if (data.sceneId !== activeSceneId) {
          onSceneChange(data.sceneId);
        }
      }

      if (data.type === "coords") {
        console.log("Pannellum Coords:", data);
      }
    } catch (e) {
      console.error("JSON Parse error", e);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{
          html: htmlContent,
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
        onMessage={handleMessage}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  viewer: { width, height: 230 },
});

export default Vtour;