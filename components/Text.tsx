import { TextProps, TextSize } from '@/interfaces/component'
import React from 'react'
import { Text } from 'react-native'

const CustomText = ({ size = "normal", classname, isDimmed, text, variant = "dark" }: TextProps) => {

  const sizes: Record<TextSize, string> = {
    h1: 'text-3xl',
    h2: 'text-xl',
    h3: 'text-lg',
    normal: 'text-md',
    small: 'text-xs',
  }

  const variants: Record<string, string> = {
    light: 'text-background',
    dark: 'text-primary',
  }


  return (
    <Text className={`${sizes[size]} font-plusJakartaSans ${isDimmed ? "text-secondary" : variants[variant]} ${classname}`}>{text}</Text>
  )
}

export default CustomText