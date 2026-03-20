import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";

export default function CompleteProfileScreen() {
  const params = useLocalSearchParams<{ email?: string }>();
  const email = typeof params.email === "string" ? params.email : "";

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullNameTouched, setFullNameTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const fullNameIsValid = useMemo(() => fullName.trim().length > 0, [fullName]);
  const phoneIsValid = useMemo(() => phone.trim().length >= 8, [phone]);
  const passwordIsValid = useMemo(() => password.trim().length >= 6, [password]);
  const confirmPasswordIsValid = useMemo(() => {
    return confirmPassword.trim().length > 0 && confirmPassword === password;
  }, [confirmPassword, password]);

  const canContinue = useMemo(() => {
    return (
      fullNameIsValid &&
      phoneIsValid &&
      passwordIsValid &&
      confirmPasswordIsValid
    );
  }, [fullNameIsValid, phoneIsValid, passwordIsValid, confirmPasswordIsValid]);

  const handleFinish = () => {
    setFullNameTouched(true);
    setPhoneTouched(true);
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);

    if (!canContinue) return;

    router.replace({
      pathname: "/home",
      params: { email },
    });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-black"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="flex-1 px-7 py-6">
        <Pressable onPress={() => router.back()}>
          <Text className="text-[14px] font-medium text-white">← Volver</Text>
        </Pressable>

        <View className="mt-12">
          <Text className="mb-3 text-[30px] font-extrabold text-white">
            Completa tu perfil
          </Text>

          <Text className="mb-8 text-[14px] leading-6 text-[#B3B3B3]">
            Solo necesitamos algunos datos para terminar tu registro.
          </Text>

          <View className="gap-4">
            <View>
              <Text className="mb-2 text-[13px] text-white">
                Nombre completo *
              </Text>
              <TextInput
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (!fullNameTouched) setFullNameTouched(true);
                }}
                placeholder="Ingresa tu nombre completo"
                placeholderTextColor="#737373"
                className="h-12 border border-[#3A3A3A] bg-black px-3 text-white"
              />
              {fullNameTouched && !fullNameIsValid && (
                <Text className="mt-2 text-red-500">
                  Ingresa tu nombre completo.
                </Text>
              )}
            </View>

            <View>
              <Text className="mb-2 text-[13px] text-white">
                Número de celular *
              </Text>
              <TextInput
                value={phone}
                onChangeText={(text) => {
                  setPhone(text.replace(/[^0-9]/g, ""));
                  if (!phoneTouched) setPhoneTouched(true);
                }}
                placeholder="Ingresa tu número"
                placeholderTextColor="#737373"
                keyboardType="phone-pad"
                className="h-12 border border-[#3A3A3A] bg-black px-3 text-white"
              />
              {phoneTouched && !phoneIsValid && (
                <Text className="mt-2 text-red-500">
                  El celular debe tener al menos 8 dígitos.
                </Text>
              )}
            </View>

            <View>
              <Text className="mb-2 text-[13px] text-white">Contraseña *</Text>
              <TextInput
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (!passwordTouched) setPasswordTouched(true);
                }}
                placeholder="Crea una contraseña"
                placeholderTextColor="#737373"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password-new"
                textContentType="newPassword"
                className="h-12 border border-[#3A3A3A] bg-black px-3 text-white"
              />
              {passwordTouched && !passwordIsValid && (
                <Text className="mt-2 text-red-500">
                  La contraseña debe tener al menos 6 caracteres.
                </Text>
              )}
            </View>

            <View>
              <Text className="mb-2 text-[13px] text-white">
                Confirmar contraseña *
              </Text>
              <TextInput
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (!confirmPasswordTouched) setConfirmPasswordTouched(true);
                }}
                placeholder="Repite tu contraseña"
                placeholderTextColor="#737373"
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="password-new"
                textContentType="newPassword"
                className="h-12 border border-[#3A3A3A] bg-black px-3 text-white"
              />
              {confirmPasswordTouched && !confirmPasswordIsValid && (
                <Text className="mt-2 text-red-500">
                  Las contraseñas no coinciden.
                </Text>
              )}
            </View>

            <Pressable
              onPress={handleFinish}
              disabled={!canContinue}
              className={`mt-5 h-12 items-center justify-center rounded-full ${
                canContinue ? "bg-[#E10600]" : "bg-[#5C1414]"
              }`}
            >
              <Text className="text-[13px] font-bold text-white">
                COMPLETAR REGISTRO
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
