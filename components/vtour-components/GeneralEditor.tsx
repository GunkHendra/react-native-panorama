import { colors } from '@/constants/color'
import { useAddNewImage, useGetFiles } from '@/hooks/useVtour'
import { PlayerConfig } from '@/interfaces/vtour'
import { Checkbox } from 'expo-checkbox'
import * as ImagePicker from 'expo-image-picker'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Switch, View } from 'react-native'
import CustomButton from '../Button'
import InputField from '../InputField'
import CustomText from '../Text'

interface GeneralEditorProps {
    TOUR_ID: string;
    USER_ID: string;
    vtourState: Partial<PlayerConfig>;
    onChangeVtourConfig: (newConfig: any) => void;
}

const GeneralEditor = ({ TOUR_ID, USER_ID, vtourState, onChangeVtourConfig }: GeneralEditorProps) => {
    // Local states
    // Image preview
    const [imagePreview, setImagePreview] = useState("");

    // Auto Rotate
    const [isAutoRotateEnabled, setIsAutoRotateEnabled] = useState(false);
    const [autoRotateSpeed, setAutoRotateSpeed] = useState("");
    const [autoRotateInactivityDelay, setAutoRotateInactivityDelay] = useState("");
    const [isAutoRotateControlEnabled, setIsAutoRotateControlEnabled] = useState(false);

    // Scene fade duration
    const [sceneFadeDuration, setSceneFadeDuration] = useState("");

    // Background load
    const [isBackgroundLoadEnabled, setIsBackgroundLoadEnabled] = useState(false);

    // Thumb slider
    const [isThumbSliderEnabled, setIsThumbSliderEnabled] = useState(false);

    // Next/Prev control
    const [isNextPrevEnabled, setIsNextPrevEnabled] = useState(false);
    const [isLoopScenes, setIsLoopScenes] = useState(false);

    // Share control
    const [isShareEnabled, setIsShareEnabled] = useState(false);

    // Zoom control
    const [isZoomEnabled, setIsZoomEnabled] = useState(false);

    // Full screen control
    const [isFullScreenEnabled, setIsFullScreenEnabled] = useState(false);

    // Compass    
    const [isCompassEnabled, setIsCompassEnabled] = useState(false);

    // Title
    const [isTitleEnabled, setIsTitleEnabled] = useState(false);

    useEffect(() => {
        if (!vtourState) return;
        setImagePreview(vtourState.imagePreview || "");
        setIsAutoRotateEnabled(!!vtourState.autoRotate);
        setIsAutoRotateControlEnabled(!!vtourState.autoRotateControl);
        setSceneFadeDuration(vtourState.sceneFadeDuration?.toString() || "");
        setIsBackgroundLoadEnabled(!!vtourState.sceneBackgroundLoad);
        setIsThumbSliderEnabled(!!vtourState.showSceneThumbsCtrl);
        setIsNextPrevEnabled(!!vtourState.showSceneNextPrevCtrl);
        setIsLoopScenes(!!vtourState.sceneNextPrevLoop);
        setIsShareEnabled(!!vtourState.showShareCtrl);
        setIsZoomEnabled(!!vtourState.showZoomCtrl);
        setIsFullScreenEnabled(!!vtourState.showFullscreenCtrl);
        setIsCompassEnabled(!!vtourState.compass);
        setIsTitleEnabled(!!vtourState.title);
    }, [vtourState]);

    // Debounce Auto Rotate Inactivity Delay
    useEffect(() => {
        if (vtourState?.autoRotateInactivityDelay === Number(autoRotateInactivityDelay)) return;

        const timeout = setTimeout(() => {
            onChangeVtourConfig({ autoRotateInactivityDelay: Number(autoRotateInactivityDelay) });
        }, 500);
        return () => clearTimeout(timeout);
    }, [autoRotateInactivityDelay]);

    // Debounce Auto Rotate Speed
    useEffect(() => {
        if (vtourState?.autoRotateSpeed === Number(autoRotateSpeed)) return;

        const timeout = setTimeout(() => {
            onChangeVtourConfig({ autoRotateSpeed: Number(autoRotateSpeed) });
        }, 500);
        return () => clearTimeout(timeout);
    }, [autoRotateSpeed]);

    // Debounce Scene Fade Duration
    useEffect(() => {
        if (vtourState?.sceneFadeDuration === Number(sceneFadeDuration)) return;

        const timeout = setTimeout(() => {
            onChangeVtourConfig({ sceneFadeDuration: Number(sceneFadeDuration) });
        }, 500);
        return () => clearTimeout(timeout);
    }, [sceneFadeDuration]);

    // Functions
    const toggleSwitch = (Opt: string) => {
        switch (Opt) {
            case 'AutoRotate':
                setIsAutoRotateEnabled(previousState => !previousState);
                onChangeVtourConfig({ autoRotate: !isAutoRotateEnabled });
                break;
            case 'BackgroundLoad':
                setIsBackgroundLoadEnabled(previousState => !previousState);
                onChangeVtourConfig({ sceneBackgroundLoad: !isBackgroundLoadEnabled });
                break;
            case 'ThumbSlider':
                setIsThumbSliderEnabled(previousState => !previousState);
                onChangeVtourConfig({ showSceneThumbsCtrl: !isThumbSliderEnabled });
                break;
            case 'NextPrev':
                setIsNextPrevEnabled(previousState => !previousState);
                onChangeVtourConfig({ showSceneNextPrevCtrl: !isNextPrevEnabled });
                break;
            case 'Share':
                setIsShareEnabled(previousState => !previousState);
                onChangeVtourConfig({ showShareCtrl: !isShareEnabled });
                break;
            case 'Zoom':
                setIsZoomEnabled(previousState => !previousState);
                onChangeVtourConfig({ showZoomCtrl: !isZoomEnabled });
                break;
            case 'FullScreen':
                setIsFullScreenEnabled(previousState => !previousState);
                onChangeVtourConfig({ showFullscreenCtrl: !isFullScreenEnabled });
                break;
            case 'AutoRotateControl':
                setIsAutoRotateControlEnabled(previousState => !previousState);
                onChangeVtourConfig({ autoRotateControl: !isAutoRotateControlEnabled });
                break;
            case 'Compass':
                setIsCompassEnabled(previousState => !previousState);
                onChangeVtourConfig({ compass: !isCompassEnabled });
                break;
            case 'Title':
                setIsTitleEnabled(previousState => !previousState);
                onChangeVtourConfig({ title: !isTitleEnabled });
                break;
            default:
                break;
        }
    };

    // Api hooks
    const addNewImage = useAddNewImage();
    const { refetch: refetchFiles } = useGetFiles(USER_ID);

    const handlePreviewImage = async () => {
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

            setImagePreview(newImagePath);
            onChangeVtourConfig({ imagePreview: newImagePath });
        } catch (e) {
            console.warn('Upload failed', e);
        }
    };

    return (
        <View>
            <View className="gap-2">
                <CustomText text="Upload Preview Image" />
                <CustomButton
                    text={addNewImage.isPending ? 'Uploading...' : 'Upload a file'}
                    variant="light"
                    onPress={handlePreviewImage}
                    icon="upload"
                />
                {imagePreview ? (
                    <CustomText text={`Selected: ${imagePreview}`} size="small" isDimmed />
                ) : null}
            </View>
            <View>
                <View className="flex-row items-center justify-between">
                    <CustomText text="Auto Rotate" />
                    <Switch
                        trackColor={{ false: colors.secondary, true: colors.primary }}
                        thumbColor={isAutoRotateEnabled ? colors.background : colors.neutral[200]}
                        ios_backgroundColor={colors.border}
                        onValueChange={() => toggleSwitch('AutoRotate')}
                        value={isAutoRotateEnabled}
                    />
                </View>
                {isAutoRotateEnabled &&
                    <View className="gap-2">
                        <InputField
                            value={autoRotateSpeed}
                            placeholder="Speed"
                            onChangeText={(text) => setAutoRotateSpeed(text)}
                        />
                        <InputField
                            value={autoRotateInactivityDelay}
                            placeholder="Inactivity Delay (ms)"
                            onChangeText={(text) => setAutoRotateInactivityDelay(text)}
                        />
                    </View>
                }
            </View>
            <View className="gap-2">
                <CustomText text="Scene Fade Duration" />
                <InputField
                    value={sceneFadeDuration}
                    placeholder="Duration in ms"
                    onChangeText={(text) => setSceneFadeDuration(text)}
                />
            </View>

            <View className="flex-row items-center justify-between">
                <CustomText text="Scene Images Background Load" />
                <Switch
                    trackColor={{ false: colors.secondary, true: colors.primary }}
                    thumbColor={isBackgroundLoadEnabled ? colors.background : colors.neutral[200]}
                    ios_backgroundColor={colors.border}
                    onValueChange={() => toggleSwitch('BackgroundLoad')}
                    value={isBackgroundLoadEnabled}
                />
            </View>
            <View className="flex-row items-center justify-between">
                <CustomText text="Thumbnail Slider" />
                <Switch
                    trackColor={{ false: colors.secondary, true: colors.primary }}
                    thumbColor={isThumbSliderEnabled ? colors.background : colors.neutral[200]}
                    ios_backgroundColor={colors.border}
                    onValueChange={() => toggleSwitch('ThumbSlider')}
                    value={isThumbSliderEnabled}
                />
            </View>
            <View>
                <View className="flex-row items-center justify-between">
                    <CustomText text="Scene Next/Previous Control" />
                    <Switch
                        trackColor={{ false: colors.secondary, true: colors.primary }}
                        thumbColor={isNextPrevEnabled ? colors.background : colors.neutral[200]}
                        ios_backgroundColor={colors.border}
                        onValueChange={() => toggleSwitch('NextPrev')}
                        value={isNextPrevEnabled}
                    />

                </View>
                {isNextPrevEnabled &&
                    <View className="gap-2 flex-row items-center">
                        <Checkbox
                            style={styles.checkbox}
                            value={isLoopScenes}
                            onValueChange={
                                (value) => {
                                    setIsLoopScenes(value);
                                    onChangeVtourConfig({ sceneNextPrevLoop: value });
                                }
                            }
                            color={isLoopScenes ? '#4630EB' : undefined}
                        />
                        <CustomText text="Loop Scenes" />
                    </View>
                }
            </View>
            <View className="flex-row items-center justify-between">
                <CustomText text="Share Control" />
                <Switch
                    trackColor={{ false: colors.secondary, true: colors.primary }}
                    thumbColor={isShareEnabled ? colors.background : colors.neutral[200]}
                    ios_backgroundColor={colors.border}
                    onValueChange={() => toggleSwitch('Share')}
                    value={isShareEnabled}
                />
            </View>
            <View className="flex-row items-center justify-between">
                <CustomText text="Zoom Control" />
                <Switch
                    trackColor={{ false: colors.secondary, true: colors.primary }}
                    thumbColor={isZoomEnabled ? colors.background : colors.neutral[200]}
                    ios_backgroundColor={colors.border}
                    onValueChange={() => toggleSwitch('Zoom')}
                    value={isZoomEnabled}
                />
            </View>
            <View className="flex-row items-center justify-between">
                <CustomText text="Full Screen Control" />
                <Switch
                    trackColor={{ false: colors.secondary, true: colors.primary }}
                    thumbColor={isFullScreenEnabled ? colors.background : colors.neutral[200]}
                    ios_backgroundColor={colors.border}
                    onValueChange={() => toggleSwitch('FullScreen')}
                    value={isFullScreenEnabled}
                />
            </View>
            <View className="flex-row items-center justify-between">
                <CustomText text="Auto Rotate Control" />
                <Switch
                    trackColor={{ false: colors.secondary, true: colors.primary }}
                    thumbColor={isAutoRotateControlEnabled ? colors.background : colors.neutral[200]}
                    ios_backgroundColor={colors.border}
                    onValueChange={() => toggleSwitch('AutoRotateControl')}
                    value={isAutoRotateControlEnabled}
                />
            </View>
            <View className="flex-row items-center justify-between">
                <CustomText text="Compass" />
                <Switch
                    trackColor={{ false: colors.secondary, true: colors.primary }}
                    thumbColor={isCompassEnabled ? colors.background : colors.neutral[200]}
                    ios_backgroundColor={colors.border}
                    onValueChange={() => toggleSwitch('Compass')}
                    value={isCompassEnabled}
                />
            </View>
            <View className="flex-row items-center justify-between">
                <CustomText text="Title" />
                <Switch
                    trackColor={{ false: colors.secondary, true: colors.primary }}
                    thumbColor={isTitleEnabled ? colors.background : colors.neutral[200]}
                    ios_backgroundColor={colors.border}
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
