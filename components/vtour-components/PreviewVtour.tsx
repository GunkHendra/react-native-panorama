import CustomText from "@/components/Text";
import { useVtour } from "@/hooks/useVtour";
import { AntDesign } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, useWindowDimensions, View } from "react-native";
import VtourDisplayer from "./VtourDisplayer";

const PreviewVtour = ({ TOUR_ID, onClose, }: { TOUR_ID: string | null; onClose: () => void; }) => {
    // Fetch vtour data
    const { data: vtourData, isLoading, isError, error } = useVtour(TOUR_ID!);

    // Handle landscape and portrait modes
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    // Local states
    const [scenesState, setScenesState] = useState<Record<string, any>>({});

    useEffect(() => {
        // Allow both portrait & landscape while preview is open
        ScreenOrientation.unlockAsync();

        return () => {
            // Restore portrait-only when preview closes
            ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT
            );
        };
    }, []);


    useEffect(() => {
        if (!vtourData || !vtourData.code || !vtourData.code.scenes) return;
        setScenesState(vtourData.code.scenes);
    }, [vtourData]);

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-background">
                <ActivityIndicator size="large" color="#010F1C" />
                <CustomText text="Loading Experience..." size="h3" />
            </View>
        );
    }

    if (isError) {
        return (
            <View className="flex-1 justify-center items-center bg-background px-4">
                <CustomText text="Failed to load." classname="font-bold mb-2" />
                <CustomText text={`${error instanceof Error ? error.message : "Unknown error"}`} size="h3" isDimmed={true}></CustomText>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-black/80 justify-center">
            <Pressable
                onPress={onClose}
                className="absolute top-6 right-6 z-50 bg-black/60 p-3 rounded-full"
            >
                <AntDesign name="close" size={20} color="white" />
            </Pressable>

            <View
                style={{
                    width: "100%",
                    height: isLandscape ? "100%" : width * 0.6,
                    backgroundColor: "black",
                }}
            >
                <VtourDisplayer
                    scenesState={scenesState}
                />
            </View>

            {!isLandscape && (
                <View className="p-4 bg-background">
                    <CustomText
                        text="Rotate your device for full-screen preview"
                        isDimmed
                    />
                </View>
            )}
        </View>
    );
};

export default PreviewVtour;
