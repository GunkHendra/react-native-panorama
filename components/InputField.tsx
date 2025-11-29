import { InputFieldProps } from '@/interfaces/component'
import React from 'react'
import { TextInput, TextInputProps } from 'react-native'

const InputField = ({ classname, placeholder, value, onChangeText, ...rest }: InputFieldProps & TextInputProps) => {
  return (
    <TextInput className={`bg-background text-primary border border-border p-4 rounded-full text-md ${classname}`} placeholder={placeholder} value={value} onChangeText={onChangeText} placeholderTextColor='rgba(1, 15, 28, 0.40)'></TextInput>
  )
}

export default InputField