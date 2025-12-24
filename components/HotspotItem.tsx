import { PlayerHotspot } from '@/interfaces/vtour';
import { AntDesign } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import InputField from './InputField';
import CustomText from './Text';

const HotspotItem = ({
    hotspot,
    index,
    scenesArray,
    onChange,
    onDelete,
}: {
    hotspot: PlayerHotspot;
    index: number;
    scenesArray: { label: string; value: string }[];
    onChange: (index: number, patch: Partial<PlayerHotspot>) => void;
    onDelete: (index: number) => void;
}) => {
    const [title, setTitle] = useState(hotspot.title);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sync external changes
    useEffect(() => {
        setTitle(hotspot.title);
    }, [hotspot.title]);

    const handleTitleChange = (text: string) => {
        setTitle(text);

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            onChange(index, { title: text });
        }, 400); // ← debounce delay (ms)
    };

    return (
        <View>
            <View className="flex-row justify-between items-center">
                <View className="mb-2">
                    <CustomText text={`Hotspot ${index + 1}`} size="h3" classname="mb-2 font-semibold" />
                    <CustomText text="Hotspot Title" />
                </View>
                <Pressable className="p-2" onPress={() => onDelete(index)}>
                    <AntDesign name="delete" size={20} color="rgba(1, 15, 28, 0.40)" />
                </Pressable>
            </View>

            <View className="gap-2 mb-4">
                <InputField
                    value={title}
                    placeholder="Enter Title"
                    onChangeText={handleTitleChange}
                />

                <Dropdown
                    style={styles.dropdown}
                    containerStyle={styles.container}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    itemTextStyle={styles.selectedTextStyle}
                    data={scenesArray}
                    labelField="label"
                    valueField="value"
                    placeholder="Go to the Scene"
                    value={hotspot.sceneId}
                    onChange={(item: any) =>
                        onChange(index, { sceneId: item.value })
                    }
                />
            </View>
        </View>
    );
};


export default HotspotItem

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