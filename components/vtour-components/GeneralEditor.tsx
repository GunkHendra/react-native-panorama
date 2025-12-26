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
    const [isBackgroundLoadEnabled, setIsBackgroundLoadEnabled] = useState(false);
    const [isThumbSliderEnabled, setIsThumbSliderEnabled] = useState(false);
    const [isNextPrevEnabled, setIsNextPrevEnabled] = useState(false);
    const [isShareEnabled, setIsShareEnabled] = useState(false);
    const [isZoomEnabled, setIsZoomEnabled] = useState(false);
    const [isFullScreenEnabled, setIsFullScreenEnabled] = useState(false);
    const [isAutoRotateControlEnabled, setIsAutoRotateControlEnabled] = useState(false);
    const [isCompassEnabled, setIsCompassEnabled] = useState(false);
    const [isTitleEnabled, setIsTitleEnabled] = useState(false);
    const [isChecked, setChecked] = useState(false);

    // Functions
    const toggleSwitch = (Opt: string) => {
        switch (Opt) {
            case 'AutoRotate':
                setIsAutoRotateEnabled(previousState => !previousState);
                break;
            case 'BackgroundLoad':
                setIsBackgroundLoadEnabled(previousState => !previousState);
                break;
            case 'ThumbSlider':
                setIsThumbSliderEnabled(previousState => !previousState);
                break;
            case 'NextPrev':
                setIsNextPrevEnabled(previousState => !previousState);
                break;
            case 'Share':
                setIsShareEnabled(previousState => !previousState);
                break;
            case 'Zoom':
                setIsZoomEnabled(previousState => !previousState);
                break;
            case 'FullScreen':
                setIsFullScreenEnabled(previousState => !previousState);
                break;
            case 'AutoRotateControl':
                setIsAutoRotateControlEnabled(previousState => !previousState);
                break;
            case 'Compass':
                setIsCompassEnabled(previousState => !previousState);
                break;
            case 'Title':
                setIsTitleEnabled(previousState => !previousState);
                break;
            default:
                break;
        }
    };

    // Api hooks
    const addNewImage = useAddNewImage();
    const { refetch: refetchFiles } = useGetFiles(USER_ID);

    const handleThumbImage = async () => {
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

            const dir = freshFiles?.find((d: any) => d.name === TOUR_ID);
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
                    onPress={handleThumbImage}
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
                        onValueChange={() => toggleSwitch('AutoRotate')}
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
                    thumbColor={isBackgroundLoadEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => toggleSwitch('BackgroundLoad')}
                    value={isBackgroundLoadEnabled}
                />
            </View>
            <View className="flex-row items-center justify-between">
                <CustomText text="Thumbnail Slider" />
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isThumbSliderEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => toggleSwitch('ThumbSlider')}
                    value={isThumbSliderEnabled}
                />
            </View>
            <View>
                <View className="flex-row items-center justify-between">
                    <CustomText text="Scene Next/Previous Control" />
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={isNextPrevEnabled ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => toggleSwitch('NextPrev')}
                        value={isNextPrevEnabled}
                    />

                </View>
                {isNextPrevEnabled &&
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
                    thumbColor={isShareEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => toggleSwitch('Share')}
                    value={isShareEnabled}
                />
            </View>
            <View className="flex-row items-center justify-between">
                <CustomText text="Zoom Control" />
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isZoomEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => toggleSwitch('Zoom')}
                    value={isZoomEnabled}
                />
            </View>
            <View className="flex-row items-center justify-between">
                <CustomText text="Full Screen Control" />
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isFullScreenEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => toggleSwitch('FullScreen')}
                    value={isFullScreenEnabled}
                />
            </View>
            <View className="flex-row items-center justify-between">
                <CustomText text="Auto Rotate Control" />
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isAutoRotateControlEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => toggleSwitch('AutoRotateControl')}
                    value={isAutoRotateControlEnabled}
                />
            </View>
            <View className="flex-row items-center justify-between">
                <CustomText text="Compass" />
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isCompassEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => toggleSwitch('Compass')}
                    value={isCompassEnabled}
                />
            </View>
            <View className="flex-row items-center justify-between">
                <CustomText text="Title" />
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isTitleEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => toggleSwitch('Title')}
                    value={isTitleEnabled}
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
