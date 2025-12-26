import { PlayerConfig } from "@/interfaces/vtour";
import { generateVtourHTML } from "@/utils/vtourHTMLGenerator";
import React, { useEffect, useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

interface VtourDisplayerProps {
  vtourState: Partial<PlayerConfig>;
  activeSceneId?: string;
  onSceneChange?: (id: string) => void;
  hotspotPickingState?: boolean;
  onAddNewHotspot?: (yaw: number, pitch: number) => void;
}

const VtourDisplayer = ({ vtourState, activeSceneId, onSceneChange, hotspotPickingState, onAddNewHotspot }: VtourDisplayerProps) => {
  const webViewRef = useRef<WebView>(null);
  const renderCountRef = useRef(0);
  const htmlGenerationCountRef = useRef(0);

  renderCountRef.current += 1;

  // Generate HTML content for WebView
  const htmlContent = useMemo(() => {
    htmlGenerationCountRef.current += 1;
    if (Object.keys(vtourState.scenes || {}).length === 0) return "";
    return generateVtourHTML({ vtourState, activeSceneId });
  }, [JSON.stringify(vtourState)]);

  // Sync active scene changes from React Native to WebView
  useEffect(() => {
    if (webViewRef.current && activeSceneId) {
      const script = `
        if (window.viewer && typeof window.viewer.getScene === 'function') {
           if (window.viewer.getScene() !== "${activeSceneId}") {
             window.viewer.loadScene("${activeSceneId}");
           }
        };
      `;
      webViewRef.current.injectJavaScript(script);
    }
  }, [activeSceneId]);

  useEffect(() => {
    if (webViewRef.current) {
      const script = `
        if (${hotspotPickingState}) {
          window.enableHotspotPicking();
        } else {
          window.disableHotspotPicking();  
        }
      `;
      webViewRef.current.injectJavaScript(script);
    }
  }, [hotspotPickingState]);

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "sceneChange" && data.sceneId !== activeSceneId) {
        onSceneChange?.(data.sceneId);
      }
      if (data.type === "hotspotCoords") {
        const { yaw, pitch } = data;
        onAddNewHotspot?.(yaw, pitch);
      }
    } catch (e) {
      console.error("JSON Parse error", e);
    }
  };

  if (activeSceneId && !vtourState.scenes?.[activeSceneId].image) {
    return <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
      <View>
        <View style={{ width: 100, height: 100, borderRadius: 12, backgroundColor: '#ddd', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: '#bbb' }} />
        </View>
      </View>
    </View>;
  }

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
  viewer: { flex: 1 },
});

export default VtourDisplayer;