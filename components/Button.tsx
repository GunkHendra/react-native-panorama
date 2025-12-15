import { ButtonProps, ButtonVariant } from '@/interfaces/component';
import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

const CustomButton = ({ variant = "dark", classname, text, onPress, icon = "", isCenter, ...rest }: ButtonProps) => {

    const variants: Record<ButtonVariant, string> = {
        dark: 'bg-primary',
        light: 'bg-background border border-border',
        lightPrimary: 'bg-background border border-border',
    }


    return (
        <Pressable className={`${variants[variant]} p-4 rounded-full h-14 flex-row  ${classname}`} onPress={onPress}>
            <View className={`${isCenter ? 'items-center justify-center' : 'justify-between'} flex-row flex-1`}>
                <Text className={`${variant === 'dark' ? "text-background" : (variant === 'light' ? "text-secondary" : "text-primary")} text-md`}>{text}</Text>
                {icon &&
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

const CustomFloatingButton = ({ onPress, classname, icon, text = "" }: Partial<ButtonProps>) => {
    return (
        <Pressable className={`bg-primary p-4 rounded-full ${text ? "flex-row gap-2" : "w-14"} h-14 justify-center items-center ${classname}`} onPress={onPress}>
            {text &&
                <Text className={`text-background text-md`}>{text}</Text>
            }
            <AntDesign
                name={icon}
                size={20}
                color={'#FEFEFE'}
            />
        </Pressable>
    )
}


export default CustomButton;
export { CustomFloatingButton };

