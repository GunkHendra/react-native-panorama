import InputField from '@/components/InputField';
import CustomText from '@/components/Text';
import { PlayerHotspot, PlayerScene } from '@/interfaces/vtour';
import { AntDesign } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const HotspotsEditor = ({ hotspots, scenes, onChangeHotspots }: { hotspots: PlayerHotspot[], scenes: Record<string, PlayerScene>, onChangeHotspots: (hotspots: PlayerHotspot[]) => void }) => {

    const scenesArray = useMemo(() => {
        return Object.entries(scenes).map(([id, scene]) => ({
            label: scene?.title ?? id,
            value: id,
        }));
    }, [scenes]);

    const handleHotspotsChange = (index: number, patch: Partial<PlayerHotspot>) => {
        const updatedHotspots = hotspots.map((hotspot, i) => i === index ? { ...hotspot, ...patch } : hotspot);
        onChangeHotspots(updatedHotspots);
    };

    const handleHotspotsDelete = (index: number) => {
        const updatedHotspots = hotspots.filter((_, i) => i !== index);
        onChangeHotspots(updatedHotspots);
    }

    return (
        <View className="flex-1">
            {hotspots.map((hotspot, index) => (
                <View key={index}>
                    <View className='flex-row justify-between items-center'>
                        <View className='mb-2'>
                            <CustomText text={`Hotspot ${index + 1}`} size="h3" classname="mb-2 font-semibold" />
                            <CustomText text="Hotspot Title" />
                        </View>
                        <Pressable className="p-2" onPress={() => { handleHotspotsDelete(index); }}>
                            <AntDesign
                                name="delete"
                                size={20}
                                color="rgba(1, 15, 28, 0.40)"
                            />
                        </Pressable>
                    </View>
                    <View className="gap-2 mb-4">
                        <InputField value={hotspot.title} placeholder="Enter Title" onChangeText={(text) => handleHotspotsChange(index, { ...hotspot, title: text })} />
                        <Dropdown
                            style={styles.dropdown}
                            containerStyle={styles.container}
                            placeholderStyle={styles.placeholderStyle}
                            selectedTextStyle={styles.selectedTextStyle}
                            itemTextStyle={styles.selectedTextStyle}
                            data={scenesArray}
                            labelField="label"
                            valueField="value"
                            placeholder='Go to the Scene'
                            value={hotspot.sceneId}
                            onChange={(item: any) => {
                                handleHotspotsChange(index, { ...hotspot, sceneId: item.value })
                            }}
                        />
                    </View>
                    {/* <View className="gap-2 mb-4">
                        <CustomText text="URL" />
                        <InputField placeholder="Enter URL" />
                    </View> */}
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