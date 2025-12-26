import CustomButton, { CustomFloatingButton } from "@/components/Button";
import InputField from "@/components/InputField";
import CustomText from "@/components/Text";
import GeneralEditor from "@/components/vtour-components/GeneralEditor";
import HotspotsEditor from "@/components/vtour-components/HotspotsEditor";
import PreviewVtour from "@/components/vtour-components/PreviewVtour";
import SceneEditor from "@/components/vtour-components/SceneEditor";
import VtourDisplayer from "@/components/vtour-components/VtourDisplayer";
import { defaultBlankVtourHotspot, defaultBlankVtourScene } from "@/constants/vtour";
import { useUpdateVtour, useVtour } from "@/hooks/useVtour";
import { PlayerConfig, PlayerHotspot, PlayerScene, VTour, VtourParams } from "@/interfaces/vtour";
import { AntDesign } from '@expo/vector-icons';
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

const Vtour = () => {
    // Fetch vtour data
    const params = useLocalSearchParams<VtourParams>();
    const { TOUR_ID, USER_ID } = params;
    const { data: vtourData, isLoading, isError, error } = useVtour(TOUR_ID);
    const [vtourTitle, setVtourTitle] = useState("");

    // Local menu states
    const [activeTab, setActiveTab] = useState<'general' | 'scenes' | 'hotspots'>('general');
    const [hasMoreScenes, setHasMoreScenes] = useState(false);
    const [hotspotPickingState, setHotspotPickingState] = useState(false);
    const [previewTourId, setPreviewTourId] = useState<string | null>(null);

    // Scene and hotspots that is active in the editor
    const [activeSceneId, setActiveSceneId] = useState("");
    const [activeHotspots, setActiveHotspots] = useState<PlayerHotspot[]>([]);

    // Vtour state (single source of truth for the whole vtour data (general, scene, hotspot))
    const [vtourState, setVtourState] = useState<Partial<PlayerConfig>>({});

    // Api hook
    const updateVtour = useUpdateVtour();

    // Scene IDs for navigation (since scenesState is a dictionary, so we need an array of keys)
    const sceneIds = useMemo(() => {
        return Object.keys(vtourState.scenes || {});
    }, [vtourState.scenes]);

    useEffect(() => {
        if (!vtourData) return;
        setVtourTitle(vtourData.title || "");

        if (!vtourData.code || !vtourData.code.scenes) {
            setVtourState({
                ...vtourData.code,
                scenes: {
                    scene_1: defaultBlankVtourScene,
                },
            });
            return;
        } else {
            setVtourState(vtourData.code);
        }
    }, [vtourData]);

    useEffect(() => {
        if (sceneIds.length === 0) return;

        if (!activeSceneId) {
            const firstScene = sceneIds[0];
            setActiveSceneId(firstScene);
            const firstHotspots = vtourState.scenes?.[firstScene]?.hotSpots || [];
            setActiveHotspots(firstHotspots);
        }

        if (sceneIds.length > 1) {
            setHasMoreScenes(true);
        } else {
            setHasMoreScenes(false);
        }
    }, [sceneIds]);

    const handleAddNewScene = () => {
        const nextIndex = Object.keys(vtourState.scenes || {}).length + 1;
        const newId = `scene_${nextIndex}`;
        setVtourState((prev) => ({
            ...prev,
            scenes: {
                ...prev.scenes,
                [newId]: { ...defaultBlankVtourScene },
            },
        }));
        setActiveSceneId(newId);
    };

    const handleAddNewHotspot = (yaw: number, pitch: number) => {
        const newHotspot = { ...defaultBlankVtourHotspot(activeHotspots.length, yaw, pitch) };
        const nextHotspots = [...activeHotspots, newHotspot];

        setActiveHotspots(nextHotspots);
        setVtourState((prev) => ({
            ...prev,
            scenes: {
                ...prev.scenes,
                [activeSceneId]: {
                    ...(prev.scenes?.[activeSceneId] || defaultBlankVtourScene),
                    hotSpots: nextHotspots,
                },
            },
        }));
        setHotspotPickingState(false);
    }

    // const handleSceneChange = (sceneId: string, patch: Partial<PlayerScene>) => {
    const handleSceneChange = (patch: Partial<PlayerScene>) => {
        setVtourState((prev) => ({
            ...prev,
            scenes: {
                ...prev.scenes,
                [activeSceneId]: {
                    ...(prev.scenes?.[activeSceneId] || defaultBlankVtourScene),
                    ...patch,
                },
            },
        }));
    };

    const handleHotspotsChange = (newHotspots: PlayerHotspot[]) => {
        setVtourState((prev) => ({
            ...prev,
            scenes: {
                ...prev.scenes,
                [activeSceneId]: {
                    ...(prev.scenes?.[activeSceneId] || defaultBlankVtourScene),
                    hotSpots: newHotspots,
                },
            },
        }));
        setActiveHotspots(newHotspots);
    };

    const handleVtourConfigChange = (newConfig: Partial<PlayerConfig>) => {
        setVtourState((prev) => ({
            ...prev,
            ...newConfig,
        }));
    }

    const handleDeleteScene = (sceneId: string) => {
        const updatedScenes = { ...vtourState.scenes };
        delete updatedScenes[sceneId];
        setVtourState((prev) => ({
            ...prev,
            scenes: updatedScenes,
        }));
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
            code: vtourState as PlayerConfig,
        };
        await updateVtour.mutateAsync({ id: TOUR_ID, data: payload });
    };


    const goNextScene = () => {
        const currentIndex = sceneIds.indexOf(activeSceneId || sceneIds[0]);
        const nextIndex = (currentIndex + 1) % sceneIds.length;
        const nextSceneId = sceneIds[nextIndex];
        setActiveSceneId(nextSceneId);
        setActiveHotspots(vtourState.scenes?.[nextSceneId]?.hotSpots || []);
    };

    const goPrevScene = () => {
        const currentIndex = sceneIds.indexOf(activeSceneId || sceneIds[0]);
        const prevIndex = (currentIndex - 1 + sceneIds.length) % sceneIds.length;
        const prevSceneId = sceneIds[prevIndex];
        setActiveSceneId(prevSceneId);
        setActiveHotspots(vtourState.scenes?.[prevSceneId]?.hotSpots || []);
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
            <View className="p-4 flex-row w-full justify-between gap-2">
                <InputField
                    value={vtourTitle}
                    placeholder="Enter Title"
                    onChangeText={setVtourTitle}
                    classname="flex-1"
                />
                <Pressable
                    className="px-5 items-center justify-center rounded-full bg-blue-400"
                    onPress={() => { setPreviewTourId(TOUR_ID); }}
                >
                    <CustomText text="Preview" variant="light" />
                </Pressable>
            </View>
            <View className={`h-1/2 relative`}>
                {activeTab === 'scenes' &&
                    <View className="absolute top-4 right-4 z-50">
                        <CustomFloatingButton text='Add New Scene' icon='plus' onPress={handleAddNewScene} />
                    </View>
                }
                {activeTab === 'hotspots' &&
                    <View className="absolute top-4 right-4 z-50">
                        {hotspotPickingState ? (
                            <CustomFloatingButton icon='close' onPress={() => setHotspotPickingState(false)} />
                        ) : (
                            <CustomFloatingButton text='Add New Hotspot' icon='plus' onPress={() => setHotspotPickingState(true)} />
                        )}
                    </View>
                }
                <VtourDisplayer
                    vtourState={vtourState}
                    activeSceneId={activeSceneId}
                    onSceneChange={(newSceneId) => {
                        setActiveSceneId(newSceneId);
                        setActiveHotspots(vtourState.scenes?.[newSceneId]?.hotSpots || []);
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
                            <CustomText text={vtourState.scenes?.[activeSceneId]?.title ? vtourState.scenes?.[activeSceneId].title : `Untitled Scene`} size="normal" variant="light" />
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
                    <Pressable onPress={() => setActiveTab("general")} className="flex-1">
                        <CustomText text="General" classname={`${activeTab === "general" ? "border-b border-primary transition-all duration-200" : "transition-all duration-200"} pb-2 text-center`} />
                    </Pressable>
                    <Pressable onPress={() => setActiveTab("scenes")} className="flex-1">
                        <CustomText text="Scenes" classname={`${activeTab === "scenes" ? "border-b border-primary transition-all duration-200" : "transition-all duration-200"} pb-2 text-center`} />
                    </Pressable>
                    <Pressable onPress={() => setActiveTab("hotspots")} className="flex-1">
                        <CustomText text="Hotspots" classname={`${activeTab === "hotspots" ? "border-b border-primary transition-all duration-200" : "transition-all duration-200"} pb-2 text-center`} />
                    </Pressable>
                </View>

                {activeTab === 'general' &&
                    <GeneralEditor TOUR_ID={TOUR_ID} USER_ID={USER_ID} vtourState={vtourState} onChangeVtourConfig={handleVtourConfigChange} />
                }
                {activeTab === 'scenes' &&
                    <SceneEditor TOUR_ID={TOUR_ID} USER_ID={USER_ID} activeScene={vtourState.scenes?.[activeSceneId] || null} activeSceneId={activeSceneId} onChangeScene={handleSceneChange} onDeleteScene={handleDeleteScene} />
                }
                {activeTab === 'hotspots' && (
                    activeHotspots.length === 0 ? (
                        <View className="flex-1 justify-center items-center">
                            <CustomText text={"No hotspots added yet. Tap the + button on the 360° viewer to add hotspots."} isDimmed={true} classname="text-center" />
                        </View>

                    ) : (
                        <HotspotsEditor hotspots={activeHotspots} scenes={vtourState.scenes || {}} onChangeHotspots={handleHotspotsChange} />
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
            <Modal
                visible={!!previewTourId}
                transparent
                animationType="fade"
                onRequestClose={() => setPreviewTourId(null)}
            >
                <PreviewVtour
                    TOUR_ID={previewTourId}
                    onClose={() => setPreviewTourId(null)}
                />
            </Modal>
        </SafeAreaView>
    );
}

export default Vtour;



