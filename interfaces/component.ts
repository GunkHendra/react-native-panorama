export interface InputFieldProps {
    classname?: string;
    placeholder: string;
    value?: string;
    onChangeText?: (text: string) => void;
}

export type TextVariant = 'h1' | 'h2' | 'h3' | 'normal' | 'small';

export interface TextProps {
    variant?: TextVariant;
    classname?: string;
    isDimmed?: boolean;
    text: string;
}

export type ButtonVariant = 'dark' | 'light';

export interface ButtonProps {
    variant?: ButtonVariant;
    classname?: string;
    text: string;
    isCenter?: boolean;
    hasIcon?: boolean;
    icon?: any;
    onPress?: () => void;
}