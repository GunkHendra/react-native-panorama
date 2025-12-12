import CustomText from "@/components/Text";
import { BASE_IMG_URL } from "@/constants/vtour";
import React, { useMemo } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

const { width } = Dimensions.get("window");

const SingleImageDisplayer = ({ imageUrl }: { imageUrl: string | null }) => {
  const fullUrl = useMemo(() => {
    if (!imageUrl) return null;
    if (imageUrl.startsWith("http")) return imageUrl;
    const cleanBase = BASE_IMG_URL.endsWith("/") ? BASE_IMG_URL : BASE_IMG_URL + "/";
    const cleanPath = imageUrl.startsWith("/") ? imageUrl.slice(1) : imageUrl;
    return cleanBase + cleanPath;
  }, [imageUrl]);

  const htmlContent = useMemo(() => {
    if (!fullUrl) return "";
    return `
<!DOCTYPE html>
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
    .pnlm-load-box { display: none !important; }
  </style>
</head>
<body>
  <div id="panorama"></div>
  <script>
    pannellum.viewer("panorama", {
      type: "equirectangular",
      panorama: "${fullUrl}",
      autoLoad: true,
      showControls: false,
      showFullscreenCtrl: false,
      showZoomCtrl: false,
      crossOrigin: "anonymous",
      hfov: 100,
    });
  </script>
</body>
</html>
    `;
  }, [fullUrl]);

  if (!fullUrl) {
    return (
      <View style={styles.placeholder}>
        <CustomText text="Upload an image to preview." isDimmed classname="text-center" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{
          html: htmlContent,
          baseUrl: "https://virtuard.com/"
        }}
        style={styles.viewer}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  viewer: { width, height: 230 },
  placeholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 16,
  },
});

export default SingleImageDisplayer;