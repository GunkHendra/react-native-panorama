import CustomButton from '@/components/Button';
import InputField from '@/components/InputField';
import CustomText from '@/components/Text';
import { SCENE_TYPES } from '@/constants/scene';
import { PlayerScene } from '@/interfaces/vtour';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const SceneEditor = ({ tourId, activeScene }: { tourId: string, activeScene: PlayerScene | null }) => {
    return (
        <View>
            <View className="gap-2 mb-4">
                <CustomText text="Scene Title" />
                <InputField
                    value={activeScene?.title || ''}
                    placeholder="Enter Title"
                    onChangeText={() => { }}
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
                    value={activeScene?.type}
                    onChange={() => { }}
                />
            </View>

            <View className="gap-2 mb-4">
                <CustomText text="Upload Image" />
                <CustomButton
                    text="Upload a file"
                    variant="light"
                    onPress={() => console.log('upload image')}
                    hasIcon
                    icon="upload"
                />
            </View>
            <CustomButton
                text="Save"
                variant="dark"
                isCenter={true}
                onPress={() => { }}
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