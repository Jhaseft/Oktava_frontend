import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { router } from "expo-router";

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email.trim());
}

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const emailIsValid = useMemo(() => isValidEmail(email), [email]);
  const showError = touched && email.length > 0 && !emailIsValid;
  const handleContinue = () => {
    setTouched(true);

    if (!emailIsValid) return;
    router.push({
      pathname: "/verify-code",
      params: { email: email.trim() },
    });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-black"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="flex-1 justify-center px-7 gap-10">
        <View>
          <Text className="mb-5 text-center text-5xl font-extrabold text-[#E10600]">
            OK<Text className="text-white">TA</Text>VA
          </Text>

          <Text className="mb-9 text-center text-lg font-medium leading-5 text-white">
            CREA UNA CUENTA CON TU CORREO ELECTRÓNICO
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-base text-white">
            Dirección de correo electrónico *
          </Text>

          <TextInput
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (!touched) setTouched(true);
            }}
            placeholder="Ingresa tu correo"
            placeholderTextColor="#737373"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            className={`h-12 border bg-black px-3 text-white ${
              showError ? "border-red-500" : "border-[#3A3A3A]"
            }`}
          />

          {showError && (
            <Text className="text-red-500">
              Por favor, ingresa un correo electrónico válido.
            </Text>
          )}

          <Text className="mt-1 text-base leading-4 text-[#B3B3B3]">
            Al restrarse o iniciar sesión, aceptas nuestras Politicas de
            privacidad y Terminos y condiciones de uso.
          </Text>
        </View>

        <View className="mt-5 gap-7">
          <Pressable
            onPress={handleContinue}
            disabled={!emailIsValid}
            className={`mt-5 h-12 w-auto items-center justify-center rounded-full ${
              emailIsValid ? "bg-[#E10600]" : "bg-[#5C1414]"
            }`}
          >
            <Text className="text-base font-medium text-white">
              CONTINUAR
            </Text>
          </Pressable>

          <Pressable onPress={() => router.push("/login")}>
            <Text className="text-base font-medium text-[#E10600] text-center">
              ¿Ya tienes cuenta? Inicia sesion
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
