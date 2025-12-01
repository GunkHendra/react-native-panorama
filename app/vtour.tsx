import CustomText from "@/components/Text";
import { PlayerConfig } from "@/interfaces/vtour";
import { generateVtourHTML } from "@/utils/vtourHTMLGenerator";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

const { width } = Dimensions.get("window");

const html = ``;

const Vtour = ({ vtour, BASE_IMG_URL }: { vtour: Partial<PlayerConfig>, BASE_IMG_URL: string }) => {

  const html = generateVtourHTML(vtour, BASE_IMG_URL);

  if (!vtour.scenes) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <CustomText text="There are no scenes yet." />
      </View>
    );
  }

  return (
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
  )
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  viewer: { width, height: 230 },
});

export default Vtour;