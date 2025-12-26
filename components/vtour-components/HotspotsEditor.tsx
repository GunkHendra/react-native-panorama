import { PlayerHotspot, PlayerScene } from '@/interfaces/vtour';
import React, { useMemo } from 'react';
import { View } from 'react-native';
import HotspotItem from './HotspotItem';

interface HotspotsEditorProps {
    hotspots: PlayerHotspot[];
    scenes: Record<string, PlayerScene>;
    onChangeHotspots: (hotspots: PlayerHotspot[]) => void;
}

const HotspotsEditor = ({ hotspots, scenes, onChangeHotspots }: HotspotsEditorProps) => {
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
                <HotspotItem
                    key={index}
                    hotspot={hotspot}
                    index={index}
                    scenesArray={scenesArray}
                    onChange={handleHotspotsChange}
                    onDelete={handleHotspotsDelete}
                />
            ))}
        </View>
    )
}

export default HotspotsEditor