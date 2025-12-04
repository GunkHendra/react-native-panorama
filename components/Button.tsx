import { ButtonProps, ButtonVariant } from '@/interfaces/component';
import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

const CustomButton = ({ variant = "dark", classname, text, onPress, hasIcon, icon, isCenter, ...rest }: ButtonProps) => {

    const variants: Record<ButtonVariant, string> = {
        dark: 'bg-primary',
        light: 'bg-background border border-border',
        lightPrimary: 'bg-background border border-border',
    }


    return (
        <Pressable className={`${variants[variant]} p-4 rounded-full h-14 ${classname} ${isCenter ? 'items-center' : ''}`} onPress={onPress}>
            <View className='flex-1 flex-row justify-between'>
                <Text className={`${variant === 'dark' ? "text-background" : (variant === 'light' ? "text-secondary" : "text-primary")} text-md`}>{text}</Text>
                {hasIcon &&
                    <AntDesign
                        name={icon}
                        size={20}
                        color={variant === 'dark' ? '#FEFEFE' : 'rgba(1, 15, 28, 0.40)'}
                    />
                }
            </View>
        </Pressable>
    )
}

const CustomFloatingButton = ({ onPress, classname, icon }: { onPress?: () => void, classname?: string, icon: any }) => {
    return (
        <Pressable className={`bg-primary p-4 rounded-full h-14 w-14 justify-center items-center ${classname}`} onPress={onPress}>
            <AntDesign
                name={icon}
                size={22}
                color={'#FEFEFE'}
            />
        </Pressable>
    )
}

const CustomArrowButton = ({ onPress, classname, icon1, icon2, text }: { onPress?: () => void, classname?: string, icon1: any, icon2: any, text: string }) => {
    return (
        <Pressable className={`bg-primary p-3 rounded-full h-12 justify-center items-center gap-2 flex-row ${classname}`} onPress={onPress}>
            <AntDesign
                name={icon1}
                size={18}
                color={'#FEFEFE'}
            />
            <Text className={`text-background text-md ${classname}`}>{text}</Text>
            <AntDesign
                name={icon2}
                size={18}
                color={'#FEFEFE'}
            />
        </Pressable>
    )
}

export default CustomButton;
export { CustomArrowButton, CustomFloatingButton };

