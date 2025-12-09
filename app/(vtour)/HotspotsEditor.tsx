import InputField from '@/components/InputField';
import CustomText from '@/components/Text';
import { PlayerHotspot, PlayerScene } from '@/interfaces/vtour';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const HotspotsEditor = ({ hotspots, apiScenes, onChangeHotspots }: { hotspots: PlayerHotspot[], apiScenes: Record<string, PlayerScene>, onChangeHotspots: (hotspots: PlayerHotspot[]) => void }) => {
    const [value, setValue] = useState<string | null>(null);
    const [scenes, setScenes] = useState(() => {
        return Object.entries(apiScenes).map(([id, scene]) => ({
            label: scene?.title ?? id,
            value: id,
        }));
    });

    return (
        <View className="flex-1">
            {hotspots.map((hotspot, index) => (
                <View key={index}>
                    <CustomText text={hotspot.title} size="h3" classname="mb-2 font-semibold" />
                    <View className="gap-2 mb-4">
                        <CustomText text="Hotspot Title" />
                        <InputField placeholder="Enter Title" />
                        <Dropdown
                            style={styles.dropdown}
                            containerStyle={styles.container}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            itemTextStyle={styles.selectedTextStyle}
                            data={scenes}
                            labelField="label"
                            valueField="value"
                            placeholder='Go to the Scene'
                            value={hotspot.sceneId}
                            onChange={(item: any) => {
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
        </View>
    )
}

export default HotspotsEditor

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