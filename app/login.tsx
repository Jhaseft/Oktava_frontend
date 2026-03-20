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

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const emailIsValid = useMemo(() => isValidEmail(email), [email]);
  const passwordIsValid = useMemo(() => password.trim().length >= 6, [password]);
  const canSubmit = emailIsValid && passwordIsValid;

  const showEmailError = emailTouched && email.length > 0 && !emailIsValid;
  const showPasswordError =
    passwordTouched && password.length > 0 && !passwordIsValid;

  const handleContinue = () => {
    setEmailTouched(true);
    setPasswordTouched(true);

    if (!canSubmit) return;

    router.push({
      pathname: "/home",
      params: { email: email.trim() },
    });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-black"
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View className="flex-1 justify-center gap-10 px-7">
        <View>
          <Text className="mb-5 text-center text-5xl font-extrabold text-[#E10600]">
            OK<Text className="text-white">TA</Text>VA
          </Text>

          <Text className="mb-9 text-center text-lg font-medium leading-5 text-white">
            INICIA SESION CON TU CORREO ELECTRONICO Y CONTRASENA
          </Text>
        </View>

        <View className="gap-3">
          <Text className="text-base text-white">
            Direccion de correo electronico *
          </Text>
          <TextInput
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (!emailTouched) setEmailTouched(true);
            }}
            placeholder="Ingresa tu correo"
            placeholderTextColor="#737373"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            className={`h-12 border bg-black px-3 text-white ${
              showEmailError ? "border-red-500" : "border-[#3A3A3A]"
            }`}
          />

          <Text className="text-base text-white">Contraseña *</Text>
          <TextInput
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (!passwordTouched) setPasswordTouched(true);
            }}
            placeholder="Ingresa tu contraseña"
            placeholderTextColor="#737373"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
            autoComplete="password"
            textContentType="password"
            onSubmitEditing={handleContinue}
            className={`h-12 border bg-black px-3 text-white ${
              showPasswordError ? "border-red-500" : "border-[#3A3A3A]"
            }`}
          />

          {showEmailError && (
            <Text className="text-red-500">
              Por favor, ingresa un correo electronico valido.
            </Text>
          )}

          {showPasswordError && (
            <Text className="text-red-500">
              La contrasena debe tener al menos 6 caracteres.
            </Text>
          )}
        </View>

        <View className="mt-5 gap-7">
          <Pressable
            onPress={handleContinue}
            disabled={!canSubmit}
            className={`mt-5 h-12 w-auto items-center justify-center rounded-full ${
              canSubmit ? "bg-[#E10600]" : "bg-[#5C1414]"
            }`}
          >
            <Text className="text-base font-medium text-white">INICIAR SESION</Text>
          </Pressable>

          <Pressable onPress={() => router.push("/register")}>
            <Text className="text-center text-base font-medium text-[#E10600]">
              ¿No tienes cuenta? Registrate
            </Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
