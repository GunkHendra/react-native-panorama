import { useAddNewImage, useGetFiles } from '@/hooks/useVtour'
import { Checkbox } from 'expo-checkbox'
import * as ImagePicker from 'expo-image-picker'
import React, { useState } from 'react'
import { StyleSheet, Switch, View } from 'react-native'
import CustomButton from '../Button'
import InputField from '../InputField'
import CustomText from '../Text'

interface GeneralEditorProps {
    TOUR_ID: string;
    USER_ID: string;
}

const GeneralEditor = ({ TOUR_ID, USER_ID }: GeneralEditorProps) => {
    // Local states
    const [image, setImage] = useState("");
    const [isAutoRotateEnabled, setIsAutoRotateEnabled] = useState(false);
    const [isChecked, setChecked] = useState(false);

    // Functions
    const toggleSwitch = () => setIsAutoRotateEnabled(previousState => !previousState);

    // Api hooks
    const addNewImage = useAddNewImage();
    const { refetch: refetchFiles } = useGetFiles(USER_ID);

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
            // Notify parent component about the change if needed
        } catch (e) {
            console.warn('Upload failed', e);
        }
    };

    return (
        <View>
            <View className="gap-2">
                <CustomText text="Upload Thumbnail" />
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
            <View>
                <View className="flex-row items-center justify-between">
                    <CustomText text="Auto Rotate" />
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={isAutoRotateEnabled ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isAutoRotateEnabled}
                    />
                </View>
                {isAutoRotateEnabled &&
                    <View className="gap-2">
                        <InputField
                            value=""
                            placeholder="Speed"
                            onChangeText={(text) => { }}
                        />
                        <InputField
                            value=""
                            placeholder="Inactivity Delay (ms)"
                            onChangeText={(text) => { }}
                        />
                    </View>
                }
            </View>
            <View className="gap-2">
                <CustomText text="Scene Fade Duration" />
                <InputField
                    value=""
                    placeholder="Duration in ms"
                    onChangeText={(text) => { }}
                />
            </View>

            <View className="flex-row items-center justify-between">
                <CustomText text="Scene Images Background Load" />
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isAutoRotateEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isAutoRotateEnabled}
                />
            </View>
            <View className="flex-row items-center justify-between">
                <CustomText text="Thumbnail Slider" />
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isAutoRotateEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isAutoRotateEnabled}
                />
            </View>
            <View>
                <View className="flex-row items-center justify-between">
                    <CustomText text="Scene Next/Previous Control" />
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={isAutoRotateEnabled ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isAutoRotateEnabled}
                    />

                </View>
                {isAutoRotateEnabled &&
                    <View className="gap-2 flex-row items-center">
                        <Checkbox
                            style={styles.checkbox}
                            value={isChecked}
                            onValueChange={setChecked}
                            color={isChecked ? '#4630EB' : undefined}
                        />
                        <CustomText text="Loop Scenes" />
                    </View>
                }
            </View>
            <View className="flex-row items-center justify-between">
                <CustomText text="Share Control" />
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isAutoRotateEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isAutoRotateEnabled}
                />
            </View>
            <View className="flex-row items-center justify-between">
                <CustomText text="Zoom Control" />
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isAutoRotateEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isAutoRotateEnabled}
                />
            </View>
            <View className="flex-row items-center justify-between">
                <CustomText text="Full Screen Control" />
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isAutoRotateEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isAutoRotateEnabled}
                />
            </View>
            <View className="flex-row items-center justify-between">
                <CustomText text="Auto Rotate Control" />
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isAutoRotateEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isAutoRotateEnabled}
                />
            </View>
            <View className="flex-row items-center justify-between">
                <CustomText text="Compass" />
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isAutoRotateEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isAutoRotateEnabled}
                />
            </View>
            <View className="flex-row items-center justify-between">
                <CustomText text="Title" />
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isAutoRotateEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isAutoRotateEnabled}
                />
            </View>
        </View>
    )
}

export default GeneralEditor

const styles = StyleSheet.create({
    checkbox: {
        margin: 8,
    },
});
