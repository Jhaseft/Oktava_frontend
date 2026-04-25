import { TouchableOpacity, Text, ActivityIndicator, TouchableOpacityProps } from 'react-native';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

type ButtonProps = TouchableOpacityProps & {
  label: string;
  variant?: Variant;
  loading?: boolean;
};

const base = 'flex-row items-center justify-center rounded-xl px-4 py-3';

const variants: Record<Variant, string> = {
  primary: 'bg-red-500',
  secondary: 'bg-white/10 border border-white/20',
  ghost: 'bg-transparent',
  danger: 'bg-red-900/60 border border-red-700',
};

const textVariants: Record<Variant, string> = {
  primary: 'text-white font-semibold text-base',
  secondary: 'text-white font-semibold text-base',
  ghost: 'text-red-400 font-semibold text-base',
  danger: 'text-red-300 font-semibold text-base',
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
