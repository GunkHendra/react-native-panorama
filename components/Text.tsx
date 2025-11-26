import { TextProps, TextVariant } from '@/interfaces/component'
import React from 'react'
import { Text } from 'react-native'

const CustomText = ({ variant = "normal", classname, isDimmed, text }: TextProps) => {

  const variants: Record<TextVariant, string> = {
    h1: 'text-3xl',
    h2: 'text-xl',
    h3: 'text-lg',
    normal: 'text-md',
    small: 'text-xs',
  }


  return (
    <Text className={`${variants[variant]} font-plusJakartaSans ${isDimmed ? "text-textSecondary" : "text-textPrimary"} ${classname}`}>{text}</Text>
  )
}

export default CustomText