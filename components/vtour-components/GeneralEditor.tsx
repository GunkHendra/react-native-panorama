import { useAddNewImage, useGetFiles } from '@/hooks/useVtour'
import * as ImagePicker from 'expo-image-picker'
import React, { useState } from 'react'
import { View } from 'react-native'
import CustomButton from '../Button'
import CustomText from '../Text'

interface GeneralEditorProps {
    TOUR_ID: string;
    USER_ID: string;
}

const GeneralEditor = ({ TOUR_ID, USER_ID }: GeneralEditorProps) => {
    // Local states
    const [image, setImage] = useState("");


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
        } catch (e) {
            console.warn('Upload failed', e);
        }
    };

    return (
        <View>
            <View className="gap-2 mb-4">
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
        </View>
    )
}

export default GeneralEditor