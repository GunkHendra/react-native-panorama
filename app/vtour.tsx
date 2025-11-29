import CustomText from "@/components/Text";
import { useVtour } from "@/hooks/useVtour";
import { generateVtourHTML } from "@/utils/vtourHTMLGenerator";
import React from "react";
import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";
import WebView from "react-native-webview";

const { width } = Dimensions.get("window");

const html = ``;

const Vtour = () => {
  // const route = useRoute();
  // const { tourId } = route.params as { id: string };
  const tourId = "128";
  const BASE_IMG_URL = "https://virtuard.com/uploads/ipanoramaBuilder/";

  const { data: vtourData, isLoading, isError, error } = useVtour(tourId);
  console.log("VTour Data:", vtourData);
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color="#010F1C" />
        <CustomText text="Loading Experience..." classname="text-primary mt-4 font-medium" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center bg-background px-4">
        <CustomText text="Failed to load." classname="text-primary text-lg font-bold mb-2" />
        <CustomText text={`${error instanceof Error ? error.message : "Unknown error"}`} classname="text-secondary text-center"></CustomText>
      </View>
    );
  }

  if (!vtourData || !vtourData.playerConfig) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <CustomText text="No panorama data found." classname="text-primary font-medium" />
      </View>
    );
  }

  const html = generateVtourHTML(vtourData?.playerConfig, BASE_IMG_URL);
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