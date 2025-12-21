import CustomButton, { CustomFloatingButton } from "@/components/Button";
import InputField from "@/components/InputField";
import CustomText from "@/components/Text";
import { defaultBlankVtourHotspot, defaultBlankVtourScene } from "@/constants/vtour";
import { useUpdateVtour, useVtour } from "@/hooks/useVtour";
import { PlayerHotspot, PlayerScene, VTour } from "@/interfaces/vtour";
import { AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import HotspotsEditor from "./HotspotsEditor";
import SceneEditor from "./SceneEditor";
import VtourDisplayer from "./VtourDisplayer";

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

type VtourParams = {
    TOUR_ID: string;
    USER_ID: string;
};

const Vtour = () => {
    // Fetch vtour data
    const params = useLocalSearchParams<VtourParams>();
    const { TOUR_ID, USER_ID } = params;
    const { data: vtourData, isLoading, isError, error } = useVtour(TOUR_ID);
    const [vtourTitle, setVtourTitle] = useState("");

    // Local menu states
    const [activeTab, setActiveTab] = useState<'scenes' | 'hotspots'>('scenes');
    const [hasMoreScenes, setHasMoreScenes] = useState(false);
    const [hotspotPickingState, setHotspotPickingState] = useState(false);

    // Scene and hotspots that is active in the editor
    const [activeSceneId, setActiveSceneId] = useState("");
    const [activeHotspots, setActiveHotspots] = useState<PlayerHotspot[]>([]);

    // Vtour scenes state (single source of truth for scenes data)
    const [scenesState, setScenesState] = useState<Record<string, PlayerScene>>({});

    // Api hook
    const updateVtour = useUpdateVtour();

    // Scene IDs for navigation (since scenesState is a dictionary, so we need an array of keys)
    const sceneIds = useMemo(() => {
        return Object.keys(scenesState);
    }, [scenesState]);

    useEffect(() => {
        if (!vtourData) return;
        setVtourTitle(vtourData.title || "");

        if (!vtourData.code || !vtourData.code.scenes) {
            setScenesState({
                scene_1: defaultBlankVtourScene,
            });
            return;
        } else {
            setScenesState(vtourData.code.scenes);
        }
    }, [vtourData]);

    useEffect(() => {
        if (sceneIds.length === 0) return;

        if (!activeSceneId) {
            const firstScene = sceneIds[0];
            setActiveSceneId(firstScene);
            const firstHotspots = scenesState[firstScene]?.hotSpots || [];
            setActiveHotspots(firstHotspots);
        }

        if (sceneIds.length > 1) {
            setHasMoreScenes(true);
        } else {
            setHasMoreScenes(false);
        }
    }, [sceneIds]);

    const handleAddNewScene = () => {
        const newId = `scene${Object.keys(scenesState).length + 1}`;
        setScenesState((prev) => ({
            ...prev,
            [newId]: defaultBlankVtourScene,
        }));
        setActiveSceneId(newId);
    };

    const handleHotspotPickingMode = () => {
        setHotspotPickingState(true);
    }

    const handleAddNewHotspot = (yaw: number, pitch: number) => {
        const newHotspots = { ...defaultBlankVtourHotspot(activeHotspots.length, yaw, pitch) };
        setActiveHotspots([...activeHotspots, newHotspots]);
        setScenesState((prev) => ({
            ...prev,
            [activeSceneId]: { ...prev[activeSceneId], hotSpots: [...activeHotspots, newHotspots] },
        }));
        setHotspotPickingState(false);
    }

    // const handleSceneChange = (sceneId: string, patch: Partial<PlayerScene>) => {
    const handleSceneChange = (patch: Partial<PlayerScene>) => {
        setScenesState((prev) => ({
            ...prev,
            [activeSceneId]: { ...prev[activeSceneId], ...patch },
        }));
    };

    const handleHotspotsChange = (newHotspots: PlayerHotspot[]) => {
        setScenesState((prev) => ({
            ...prev,
            [activeSceneId]: { ...prev[activeSceneId], hotSpots: newHotspots },
        }));
        setActiveHotspots(newHotspots);
    };

    const handleDeleteScene = (sceneId: string) => {
        const updatedScenes = { ...scenesState };
        delete updatedScenes[sceneId];
        setScenesState(updatedScenes);
        // If the deleted scene was the active scene, switch to another scene
        if (activeSceneId === sceneId) {
            const remainingSceneIds = Object.keys(updatedScenes);
            if (remainingSceneIds.length > 0) {
                const newActiveSceneId = remainingSceneIds[0];
                setActiveSceneId(newActiveSceneId);
                setActiveHotspots(updatedScenes[newActiveSceneId]?.hotSpots || []);
            } else {
                setActiveSceneId("");
                setActiveHotspots([]);
            }
        }
    };

    const handleSave = async () => {
        const payload: Partial<VTour> = {
            title: vtourTitle,
            code: {
                ...vtourData?.code,
                scenes: { ...scenesState },
            },
        };
        await updateVtour.mutateAsync({ id: TOUR_ID, data: payload });
    };


    const goNextScene = () => {
        const currentIndex = sceneIds.indexOf(activeSceneId || sceneIds[0]);
        const nextIndex = (currentIndex + 1) % sceneIds.length;
        const nextSceneId = sceneIds[nextIndex];
        setActiveSceneId(nextSceneId);
        setActiveHotspots(scenesState[nextSceneId]?.hotSpots || []);
    };

    const goPrevScene = () => {
        const currentIndex = sceneIds.indexOf(activeSceneId || sceneIds[0]);
        const prevIndex = (currentIndex - 1 + sceneIds.length) % sceneIds.length;
        const prevSceneId = sceneIds[prevIndex];
        setActiveSceneId(prevSceneId);
        setActiveHotspots(scenesState[prevSceneId]?.hotSpots || []);
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

    if (!vtourData) {
        return (
            <View className="flex-1 justify-center items-center bg-background">
                <CustomText text="No panorama data found." />
            </View>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['bottom', 'left', 'right']}>
            <View className="p-4">
                <InputField
                    value={vtourTitle}
                    placeholder="Enter Title"
                    onChangeText={setVtourTitle}
                />
            </View>
            <View className={`h-1/2 relative`}>
                {activeTab === 'scenes' &&
                    <View className="absolute top-4 right-4 z-50">
                        <CustomFloatingButton text='Add New Scene' icon='plus' onPress={handleAddNewScene} />
                    </View>
                }
                {activeTab === 'hotspots' &&
                    <View className="absolute top-4 right-4 z-50">
                        <CustomFloatingButton text='Add New Hotspot' icon='plus' onPress={handleHotspotPickingMode} />
                    </View>
                }
                <VtourDisplayer
                    scenesState={scenesState}
                    activeSceneId={activeSceneId}
                    onSceneChange={(newSceneId) => {
                        setActiveSceneId(newSceneId);
                        setActiveHotspots(scenesState[newSceneId]?.hotSpots || []);
                    }}
                    hotspotPickingState={hotspotPickingState}
                    onAddNewHotspot={handleAddNewHotspot}
                />

                <View className="items-center">
                    <View className="absolute bottom-4 z-50">
                        <View className={`bg-primary py-3 rounded-full h-12 justify-center items-center gap-2 ${!hasMoreScenes ? "px-6" : "px-3"} flex-row`}>
                            {hasMoreScenes &&
                                <Pressable onPress={goPrevScene}>
                                    <AntDesign
                                        name={"caret-left"}
                                        size={18}
                                        color={'#FEFEFE'}
                                    />
                                </Pressable>
                            }
                            <CustomText text={scenesState[activeSceneId].title ? scenesState[activeSceneId].title : `Untitled Scene`} size="normal" variant="light" />
                            {hasMoreScenes &&
                                <Pressable onPress={goNextScene}>
                                    <AntDesign
                                        name={"caret-right"}
                                        size={18}
                                        color={'#FEFEFE'}
                                    />
                                </Pressable>
                            }
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
                    <SceneEditor TOUR_ID={TOUR_ID} USER_ID={USER_ID} activeScene={scenesState[activeSceneId]} activeSceneId={activeSceneId} onChangeScene={handleSceneChange} onDeleteScene={handleDeleteScene} />
                }
                {activeTab === 'hotspots' && (
                    activeHotspots.length === 0 ? (
                        <View className="flex-1 justify-center items-center">
                            <CustomText text={"No hotspots added yet. Tap the + button on the 360° viewer to add hotspots."} isDimmed={true} classname="text-center" />
                        </View>

                    ) : (
                        <HotspotsEditor hotspots={activeHotspots} scenes={scenesState} onChangeHotspots={handleHotspotsChange} />
                    )
                )
                }
            </ScrollView>
            <View className="p-4 bg-background">
                <CustomButton
                    text={updateVtour.isPending ? "Saving..." : "Save"}
                    variant="dark"
                    isCenter
                    onPress={handleSave}
                />
            </View>
        </SafeAreaView>
    );
}

export default Vtour;

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


