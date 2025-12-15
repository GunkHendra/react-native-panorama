import CustomButton from "@/components/Button";
import InputField from "@/components/InputField";
import CustomText from "@/components/Text";
import { useAllVtour, useCreateVtour } from "@/hooks/useVtour";
import { useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, TouchableOpacity, View } from "react-native";
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

const index = () => {
    const router = useRouter();
    const USER_ID = 4818;
    const { data: allVtourData, isLoading, isError, error } = useAllVtour();
    const userVtours = (allVtourData ?? []).filter(v => v.user_id === USER_ID);
    const [showCreateModal, setShowCreateModal] = React.useState(false);
    const [newVtourTitle, setNewVtourTitle] = React.useState("");
    const createVtour = useCreateVtour();


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

    if (!userVtours.length) {
        return (
            <View className="flex-1 justify-center items-center bg-background">
                <CustomText text="No panorama data found in your account." />
            </View>
        );
    }

    const handleTourPress = (TOUR_ID: string) => {
        router.push({
            pathname: "/(vtour)/Vtour",
            params: { TOUR_ID: TOUR_ID, USER_ID: USER_ID },
        });
    }


    const handleCreateVtour = async () => {
        if (!newVtourTitle.trim()) return;
        try {
            await createVtour.mutateAsync(newVtourTitle.trim());
            setNewVtourTitle("");
            setShowCreateModal(false);
        } catch (e) {
            console.warn("Create failed", e);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['bottom', 'left', 'right']}>
            <ScrollView>
                {userVtours.map(tour => (
                    <Pressable key={tour.id} className="p-4 border-b border-border" onPress={() => handleTourPress(String(tour.id))}>
                        <CustomText text={tour.title ?? `Tour ${tour.id}`} size="h3" />
                        <CustomText text={`ID: ${tour.id}`} isDimmed />
                    </Pressable>
                ))}
            </ScrollView>
            <View className="p-4">
                <CustomButton
                    text={createVtour.isPending ? "Creating..." : "Create a New Virtual Tour"}
                    variant="dark"
                    isCenter
                    onPress={() => setShowCreateModal(true)}
                />
            </View>
            <Modal
                transparent
                animationType="fade"
                visible={showCreateModal}
                onRequestClose={() => setShowCreateModal(false)}
            >
                <View className="flex-1 bg-black/50 justify-center items-center px-6">
                    <View className="w-full rounded-2xl bg-white p-5">
                        <CustomText text="Create Virtual Tour" size="h2" classname="mb-3" />
                        <InputField
                            className="border border-border rounded-xl px-4 py-3 text-textPrimary bg-background"
                            placeholder="Enter tour title"
                            placeholderTextColor="rgba(1,15,28,0.4)"
                            value={newVtourTitle}
                            onChangeText={setNewVtourTitle}
                        />
                        <View className="flex-row justify-end gap-3 mt-4">
                            <TouchableOpacity
                                className="px-4 py-2 rounded-lg bg-border"
                                onPress={() => setShowCreateModal(false)}
                            >
                                <CustomText text="Cancel" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="px-4 py-2 rounded-lg bg-primary"
                                onPress={handleCreateVtour}
                                disabled={createVtour.isPending}
                            >
                                <CustomText text={createVtour.isPending ? "Creating..." : "Create"} classname="text-white" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

export default index;


