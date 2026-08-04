import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ButtonProps = TouchableOpacityProps & {
  label: string;
  variant?: Variant;
  loading?: boolean;
};

const base = 'flex-row items-center justify-center rounded-xl px-4 py-3';

const variants: Record<Variant, string> = {
  primary: 'bg-brand-red',
  secondary: 'bg-white border border-brand-border',
  ghost: 'bg-transparent',
  danger: 'bg-white border border-brand-red',
};

const textVariants: Record<Variant, string> = {
  primary: 'text-white font-lemon-bold text-base',
  secondary: 'text-brand-black font-lemon-bold text-base',
  ghost: 'text-brand-red font-lemon-bold text-base',
  danger: 'text-brand-red font-lemon-bold text-base',
};

export function Button({ label, variant = 'primary', loading, disabled, className, ...props }: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      className={`${base} ${variants[variant]} ${isDisabled ? 'opacity-50' : ''} ${className ?? ''}`}
      disabled={isDisabled}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text className={textVariants[variant]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}
