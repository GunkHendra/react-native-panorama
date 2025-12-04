import { CustomFloatingButton } from "@/components/Button";
import CustomText from "@/components/Text";
import { useVtour } from "@/hooks/useVtour";
import { PlayerHotspot } from "@/interfaces/vtour";
import { AntDesign } from '@expo/vector-icons';
import React, { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HotspotsEditor from "./HotspotsEditor";
import SceneEditor from "./SceneEditor";
import Vtour from "./Vtour";

/**
 * @description
 * Main page for managing 360-degree scenes and hotspots.
 * 
 * Features:
 * Scene Management:
 * - Scene title input
 * - Scene type selection via dropdown
 * - Upload button for 360 images
 * 
 * Hotspot Management:
 * - Add multiple hotspots
 * - Each hotspot includes title, target scene, and URL inputs
 */

const index = () => {
    const [activeTab, setActiveTab] = useState<'scenes' | 'hotspots'>('scenes');

    const [activeSceneId, setActiveSceneId] = useState<string | null>(null);
    const [hotspots, setHotspots] = useState<PlayerHotspot[]>([]);

    const addHotspot = () => {
        const newHotspot: PlayerHotspot = {
            title: "Hotspot " + (hotspots.length + 1),
            yaw: 0,
            pitch: 0,
            sceneId: "",
            imageUrl: null,
            imageWidth: null,
            imageHeight: null,
            link: null,
            linkNewWindow: false,
            popoverHtml: true,
            popoverContent: null,
            popoverSelector: null,
            popoverLazyload: true,
            popoverShow: false,
        };
        setHotspots([...hotspots, newHotspot]);
    }

    // const route = useRoute();
    // const { tourId } = route.params as { id: string };
    const tourId = "228";
    const BASE_IMG_URL = "https://virtuard.com/uploads/ipanoramaBuilder/";
    const { data: vtourData, isLoading, isError, error } = useVtour(tourId);

    const sceneIds = Object.keys(vtourData?.code.scenes || {});
    React.useEffect(() => {
        if (!vtourData?.code.scenes) return;
        if (sceneIds.length === 0) return;

        const firstScene = sceneIds[0];
        setActiveSceneId(firstScene);

        const initialHotspots = vtourData?.code.scenes[firstScene]?.hotSpots || [];
        setHotspots(initialHotspots);
    }, [vtourData?.code.scenes]);

    const goPrevScene = () => {
        if (!activeSceneId) return;

        const index = sceneIds.indexOf(activeSceneId);
        const prevIndex = (index - 1 + sceneIds.length) % sceneIds.length;
        const newSceneId = sceneIds[prevIndex];

        setActiveSceneId(newSceneId);
        setHotspots(scenes[newSceneId]?.hotSpots || []);
    };

    const goNextScene = () => {
        if (!activeSceneId) return;

        const index = sceneIds.indexOf(activeSceneId);
        const nextIndex = (index + 1) % sceneIds.length;
        const newSceneId = sceneIds[nextIndex];

        setActiveSceneId(newSceneId);
        setHotspots(scenes[newSceneId]?.hotSpots || []);
    };


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

    if (!vtourData || !vtourData.code || !vtourData.json_data) {
        return (
            <View className="flex-1 justify-center items-center bg-background">
                <CustomText text="No panorama data found." />
            </View>
        );
    }

    const vtour = vtourData?.code;
    const scenes = vtour?.scenes || {};

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['bottom', 'left', 'right']}>
            <View className="h-1/2 relative">
                <CustomFloatingButton icon='plus' onPress={() => addHotspot()} classname="absolute top-4 right-4 z-50" />
                <Vtour vtour={vtour} BASE_IMG_URL={BASE_IMG_URL} activeSceneId={activeSceneId ? activeSceneId : ""} onSceneChange={(newSceneId) => setActiveSceneId(newSceneId)} />
                <View className="items-center">
                    <View className="absolute bottom-4 z-50">
                        <View className={`bg-primary p-3 rounded-full h-12 justify-center items-center gap-2 flex-row`}>
                            <Pressable onPress={goPrevScene}>
                                <AntDesign
                                    name={"caret-left"}
                                    size={18}
                                    color={'#FEFEFE'}
                                />
                            </Pressable>
                            <CustomText text={activeSceneId && scenes[activeSceneId].title ? scenes[activeSceneId].title : `Untitled Scene`} size="normal" variant="light" />
                            <Pressable onPress={goNextScene}>
                                <AntDesign
                                    name={"caret-right"}
                                    size={18}
                                    color={'#FEFEFE'}
                                />
                            </Pressable>

                        </View>
                    </View>
                </View>
            </View>

            <ScrollView className="p-4" contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
                <View className="flex-row justify-between mb-4 border-b border-border">
                    <Pressable onPress={() => setActiveTab("scenes")} className="flex-1">
                        <CustomText text="Scenes" classname={`${activeTab === "scenes" ? "border-b border-primary transition-all duration-200" : "transition-all duration-200"} pb-2 text-center`} />
                    </Pressable>
                    <Pressable onPress={() => setActiveTab("hotspots")} className="flex-1">
                        <CustomText text="Hotspots" classname={`${activeTab === "hotspots" ? "border-b border-primary transition-all duration-200" : "transition-all duration-200"} pb-2 text-center`} />
                    </Pressable>
                </View>

                {activeTab === 'scenes' &&
                    <SceneEditor tourId={tourId} activeScene={activeSceneId ? scenes[activeSceneId] : null} />
                }
                {activeTab === 'hotspots' && (
                    hotspots.length === 0 ? (
                        <View className="flex-1 justify-center items-center">
                            <CustomText text={"No hotspots added yet. Tap the + button on the 360° viewer to add hotspots."} isDimmed={true} classname="text-center" />
                        </View>

                    ) : (
                        <HotspotsEditor hotspots={hotspots} apiScenes={scenes} />
                    )
                )
                }
            </ScrollView>
        </SafeAreaView>
    );
}

export default index;

const styles = StyleSheet.create({
    container: {
        borderRadius: 12,
        marginTop: 8,
        borderWidth: 1,
        borderColor: 'rgba(1, 15, 28, 0.12)',
        shadowColor: 'transparent',
        elevation: 0,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
    },
    dropdown: {
        borderColor: 'rgba(1, 15, 28, 0.12)',
        borderWidth: 1,
        borderRadius: 9999,
        padding: 16,
        fontSize: 14,
        height: 50,
        backgroundColor: '#FEFEFE',
    },
    placeholderStyle: {
        fontSize: 14,
        color: 'rgba(1, 15, 28, 0.40)',
    },
    selectedTextStyle: {
        fontSize: 14,
        color: 'rgba(1, 15, 28, 1)',
    },
});


