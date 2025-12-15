export interface InputFieldProps {
    classname?: string;
    placeholder: string;
    value?: string;
    onChangeText?: (text: string) => void;
}

export type TextSize = 'h1' | 'h2' | 'h3' | 'normal' | 'small';

export interface TextProps {
    size?: TextSize;
    classname?: string;
    isDimmed?: boolean;
    text: string;
    variant?: 'light' | 'dark';
}

export type ButtonVariant = 'dark' | 'light' | 'lightPrimary';

export interface ButtonProps {
    variant?: ButtonVariant;
    classname?: string;
    text?: string;
    isCenter?: boolean;
    icon?: any;
    onPress?: () => void;
}