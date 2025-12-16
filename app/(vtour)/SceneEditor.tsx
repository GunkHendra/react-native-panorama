import CustomButton from '@/components/Button';
import InputField from '@/components/InputField';
import CustomText from '@/components/Text';
import { SCENE_TYPES } from '@/constants/vtour';
import { useAddNewImage, useGetFiles } from '@/hooks/useVtour';
import { PlayerScene } from '@/interfaces/vtour';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

interface SceneEditorProps {
    TOUR_ID: string;
    USER_ID: string;
    activeScene: PlayerScene;
    activeSceneId: string;
    // isEmptyScene?: boolean;
    // onChangeScene: (sceneId: string, patch: Partial<PlayerScene>) => void;
    onChangeScene: (patch: Partial<PlayerScene>) => void;
    // onNewImageUpload: (uri: string | null) => void;
}

// const SceneEditor = forwardRef(({ TOUR_ID, USER_ID, activeScene, activeSceneId, onChangeScene }: SceneEditorProps, ref) => {
const SceneEditor = ({ TOUR_ID, USER_ID, activeScene, activeSceneId, onChangeScene }: SceneEditorProps) => {
    // Local states
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [image, setImage] = useState("");

    // Api hooks
    const addNewImage = useAddNewImage();
    const { data: files, refetch: refetchFiles } = useGetFiles(USER_ID);

    // const [localScene, setLocalScene] = useState<PlayerScene>(defaultBlankVtourScene);

    useEffect(() => {
        // if (isEmptyScene) {
        //     setLocalScene(defaultBlankVtourScene);
        //     setTitle("");
        //     setType("");
        //     setImage("");
        // } else if (activeScene) {
        // setLocalScene(activeScene);
        if (activeScene) {
            setTitle(activeScene.title || "");
            setType(activeScene.type || "");
            setImage(activeScene.image || "");
        }
        // }
    }, [activeSceneId, activeScene]);

    // const updateLocalScene = (patch: Partial<PlayerScene>) => {
    //     setLocalScene(prev => ({ ...prev, ...patch }));
    // };

    const handlePickImage = async () => {
        const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!perm.granted) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            quality: 0.8,
            allowsMultipleSelection: false,
        });
        if (result.canceled) return;

        const asset = result.assets[0];
        if (!asset?.uri) return;

        const name = asset.fileName ?? `scene-${Date.now()}.${(asset.mimeType?.split('/')?.[1] || 'jpeg')}`;
        const type = asset.mimeType ?? 'image/jpeg';

        const formData = new FormData();
        formData.append('images', { uri: asset.uri, name, type } as any);

        try {
            await addNewImage.mutateAsync({ id: TOUR_ID, imageData: formData });
            await new Promise(resolve => setTimeout(resolve, 500));

            const refreshed = await refetchFiles();
            const freshFiles = refreshed.data;

            console.log("File name: ", name);
            const dir = freshFiles?.find((d: any) => d.name === TOUR_ID);
            console.log("Refreshed files: ", dir);
            const file = dir?.files?.find((f: any) => f.name.includes(name));
            const newImagePath = file ? `upload/${USER_ID}/${TOUR_ID}/` + file.name : null;


            if (!newImagePath) return;

            setImage(newImagePath);
            // onChangeScene(activeSceneId, { image: newImagePath });
            onChangeScene({ image: newImagePath });
            // onNewImageUpload(newImagePath);
            // if (isNewScene) updateLocalScene({ image: newImagePath });
            // else if (activeSceneId) onChangeScene(activeSceneId, { image: newImagePath });
        } catch (e) {
            console.warn('Upload failed', e);
        }
    };

    // useImperativeHandle(ref, () => ({
    //     getLocalScene: () => localScene,
    //     isNew: !activeSceneId
    // }));

    return (
        <View>
            <View className="gap-2 mb-4">
                <CustomText text="Scene Title" />
                <InputField
                    value={title}
                    placeholder="Enter Title"
                    onChangeText={(text) => {
                        setTitle(text);
                        // if (isNewScene) updateLocalScene({ title: text });
                        // else if (activeSceneId) onChangeScene(activeSceneId, { title: text });
                        // onChangeScene(activeSceneId, { title: text });
                        onChangeScene({ title: text });
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
                    value={type}
                    onChange={(text) => {
                        setType(text.value);
                        // if (isNewScene) updateLocalScene({ type: text.value });
                        // else if (activeSceneId) onChangeScene(activeSceneId, { type: text.value });
                        // onChangeScene(activeSceneId, { type: text.value });
                        onChangeScene({ type: text.value });
                    }}
                />
            </View>

            <View className="gap-2 mb-4">
                <CustomText text="Upload Image" />
                <CustomButton
                    text={addNewImage.isPending ? 'Uploading...' : 'Upload a file'}
                    variant="light"
                    onPress={handlePickImage}
                    icon="upload"
                />
                {image ? (
                    <CustomText text={`Selected: ${image}`} size="small" isDimmed />
                ) : null}
            </View>
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