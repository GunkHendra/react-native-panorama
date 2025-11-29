import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton, { CustomFloatingButton } from "@/components/Button";
import InputField from "@/components/InputField";
import CustomText from "@/components/Text";
import Vtour from "./vtour";
import { Dropdown } from "react-native-element-dropdown";

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
    const [value, setValue] = useState(null);

    const scene_type = [
        { label: 'Sphere', value: 'sphere' },
        { label: 'Cube', value: 'cube' },
        { label: 'Cylinder', value: 'cylinder' },
    ];

    const scene_data = [
        { label: 'Scene 1 Front', value: '1' },
        { label: 'Scene 2 Bedroom', value: '2' },
        { label: 'Scene 3 Indoor', value: '3' },
    ];

    const [hotspots, setHotspots] = useState<{ title: string, targetScene?: string, url?: string }[]>([]);

    const addHotspot = () => {
        const newHotspot = {
            title: `Hotspot ${hotspots.length + 1}`,
            targetScene: '',
            url: '',
        };
        setHotspots([...hotspots, newHotspot]);
    }

    return (
        <SafeAreaView className="flex-1 bg-background" edges={['bottom', 'left', 'right']}>
            <View className="h-1/2 relative">
                <CustomFloatingButton icon='plus' onPress={() => addHotspot()} classname="absolute top-4 right-4 z-50" />
                <Vtour />
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
                    <View>
                        <View className="gap-2 mb-4">
                            <CustomText text="Scene Title" />
                            <InputField placeholder="Enter Title" />
                        </View>

                        <View className="gap-2 mb-4">
                            <CustomText text="Scene Type" />
                            <Dropdown
                                style={styles.dropdown}
                                containerStyle={styles.container}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                itemTextStyle={styles.selectedTextStyle}
                                data={scene_type}
                                labelField="label"
                                valueField="value"
                                placeholder='Select Type'
                                value={value}
                                onChange={item => {
                                    setValue(item.value);
                                }}
                            />
                        </View>

                        <View className="gap-2 mb-4">
                            <CustomText text="Upload Image" />
                            <CustomButton text={"Upload a file"} variant="light" onPress={() => console.log('pressed')} hasIcon={true} icon='upload' />
                        </View>

                        <CustomButton text={"Save"} variant="dark" isCenter={true} onPress={() => console.log('pressed')} />
                    </View>
                }
                {activeTab === 'hotspots' && (
                    hotspots.length === 0 ? (
                        <View className="flex-1 justify-center items-center">
                            <CustomText text={"No hotspots added yet. Tap the + button on the 360° viewer to add hotspots."} isDimmed={true} classname="text-center" />
                        </View>

                    ) : (
                        <View className="flex-1">
                            {hotspots.map((hotspot, index) => (
                                <View key={index}>
                                    <CustomText text={hotspot.title} variant="h3" classname="mb-2 font-semibold" />
                                    <View className="gap-2 mb-4">
                                        <CustomText text="Hotspot Title" />
                                        <InputField placeholder="Enter Title" />
                                        <Dropdown
                                            style={styles.dropdown}
                                            containerStyle={styles.container}
                                            placeholderStyle={styles.placeholderStyle}
                                            selectedTextStyle={styles.selectedTextStyle}
                                            itemTextStyle={styles.selectedTextStyle}
                                            data={scene_data}
                                            labelField="label"
                                            valueField="value"
                                            placeholder='Go to the Scene'
                                            value={value}
                                            onChange={item => {
                                                setValue(item.value);
                                            }}
                                        />
                                    </View>
                                    <View className="gap-2 mb-4">
                                        <CustomText text="URL" />
                                        <InputField placeholder="Enter URL" />
                                    </View>
                                </View>
                            ))}
                            <CustomButton text={"Save"} variant="dark" isCenter={true} onPress={() => console.log('pressed')} />
                        </View>
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


