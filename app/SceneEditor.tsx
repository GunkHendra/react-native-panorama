import CustomButton from '@/components/Button';
import InputField from '@/components/InputField';
import CustomText from '@/components/Text';
import { SCENE_TYPES } from '@/constants/scene';
import { useUpdateVtour } from '@/hooks/useVtour';
import { PlayerConfig, PlayerScene } from '@/interfaces/vtour';
import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const SceneEditor = ({ tourId, apiScenes }: { tourId: string, apiScenes: Record<string, PlayerScene> }) => {
    const [value, setValue] = useState<string | null>(null);
    const [openSceneId, setOpenSceneId] = useState<string | null>(null);
    const originalScenesRef = useRef(apiScenes);

    const [scenes, setScenes] = useState(() => {
        return Object.entries(apiScenes).map(([key, scene]) => ({
            id: key,
            ...scene,
        }));
    });

    const convertArrayToRecord = (scenesArray: any) => {
        const record: Record<string, PlayerScene> = {};
        scenesArray.forEach((scene: any) => {
            record[scene.id] = {
                title: scene.title,
                type: scene.type,
                image: scene.image ?? null,
                cubeTextureCount: scene.cubeTextureCount ?? null,
                hotSpots: scene.hotSpots ?? [],
                pitch: scene.pitch ?? 0,
                yaw: scene.yaw ?? 0,
                sphereHeightSegments: scene.sphereHeightSegments ?? 32,
                sphereWidthSegments: scene.sphereWidthSegments ?? 64,
                thumb: scene.thumb ?? null,
                zoom: scene.zoom ?? 1,
                saveCamera: scene.saveCamera ?? false,
                titleHtml: scene.titleHtml ?? '',
                titleSelector: scene.titleSelector ?? '',
            };
        });
        return record;
    };

    const getChangedScenes = ({ original, updated }: any) => {
        const changed: Record<string, PlayerScene> = {};

        for (const key in updated) {
            const oldScene = original[key];
            const newScene = updated[key];

            if (!oldScene) {
                changed[key] = newScene;
                continue;
            }

            if (
                oldScene.title !== newScene.title ||
                oldScene.type !== newScene.type ||
                oldScene.image !== newScene.image
            ) {
                changed[key] = newScene;
            }
        }

        return changed;
    };

    const updateVtour = useUpdateVtour();

    const handleSave = () => {
        const updatedScenes = convertArrayToRecord(scenes);

        const changedScenes = getChangedScenes(
            { original: originalScenesRef.current, updated: updatedScenes }
        );

        updateVtour.mutate({
            id: tourId,
            data: {
                playerConfig: {
                    scenes: changedScenes
                } as Partial<PlayerConfig>,
            }
        });
        console.log("Changed Scenes:", changedScenes);
    };

    const toggleScene = (id: string) => {
        setOpenSceneId(openSceneId === id ? null : id);
    };

    return (
        <View className="gap-4">
            {scenes.map((scene) => (
                <View key={scene.id}>

                    <CustomButton
                        onPress={() => toggleScene(scene.id)}
                        hasIcon
                        icon={openSceneId === scene.id ? "caret-up" : "caret-down"}
                        variant="lightPrimary"
                        classname="w-full justify-between"
                        text={scene.title || "Untitled Scene"}
                    >
                    </CustomButton>

                    {openSceneId === scene.id && (
                        <View className="mt-4 border border-border p-4 rounded-xl">
                            <View className="gap-2 mb-4">
                                <CustomText text="Scene Title" />
                                <InputField
                                    value={scene.title || ''}
                                    placeholder="Enter Title"
                                    onChangeText={(text) => {
                                        setScenes((prev) =>
                                            prev.map((s) =>
                                                s.id === scene.id ? { ...s, title: text } : s
                                            )
                                        );
                                    }}
                                />
                            </View>

                            <View className="gap-2 mb-4">
                                <CustomText text="Scene Type" />
                                <Dropdown
                                    style={styles.dropdown}
                                    containerStyle={styles.container}
                                    placeholderStyle={styles.placeholderStyle}
                                    selectedTextStyle={styles.selectedTextStyle}
                                    itemTextStyle={styles.selectedTextStyle}
                                    data={SCENE_TYPES}
                                    labelField="label"
                                    valueField="value"
                                    placeholder='Select Type'
                                    value={scene.type}
                                    onChange={item => {
                                        setScenes(prev =>
                                            prev.map(s =>
                                                s.id === scene.id ? { ...s, type: item.value } : s
                                            )
                                        );
                                    }}
                                />
                            </View>

                            <View className="gap-2 mb-4">
                                <CustomText text="Upload Image" />
                                <CustomButton
                                    text="Upload a file"
                                    variant="light"
                                    onPress={() => console.log("upload for", scene.id)}
                                    hasIcon
                                    icon="upload"
                                />
                            </View>
                        </View>
                    )}
                </View>
            ))}
            <CustomButton
                text="Save"
                variant="dark"
                isCenter={true}
                onPress={() => handleSave()}
            />
        </View>
    )
}

export default SceneEditor

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