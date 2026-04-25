import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Eye, EyeOff } from "lucide-react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "@/src/context/AuthContext";
import { authApi, ApiError } from "@/src/services/authApi";

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email.trim());
}

function isStrongPassword(password: string) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/`~;']/.test(password)
  );
}

function field(hasError: boolean) {
  return {
    backgroundColor: "#000",
    borderWidth: 1,
    borderColor: hasError ? "#ef4444" : "#374151",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#d1d5db",
    fontSize: 16,
  };
}

export default function RegisterScreen() {
  const { signIn } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [firstNameTouched, setFirstNameTouched] = useState(false);
  const [lastNameTouched, setLastNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [termsTouched, setTermsTouched] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const firstNameIsValid = useMemo(() => firstName.trim().length > 0, [firstName]);
  const lastNameIsValid = useMemo(() => lastName.trim().length > 0, [lastName]);
  const emailIsValid = useMemo(() => isValidEmail(email), [email]);
  const phoneIsValid = useMemo(() => phone.trim().length >= 8, [phone]);
  const passwordIsValid = useMemo(() => isStrongPassword(password), [password]);
  const confirmIsValid = useMemo(
    () => confirmPassword.length > 0 && confirmPassword === password,
    [confirmPassword, password],
  );

  const canSubmit =
    firstNameIsValid &&
    lastNameIsValid &&
    emailIsValid &&
    phoneIsValid &&
    passwordIsValid &&
    confirmIsValid &&
    acceptedTerms;

  const showFirstNameError = firstNameTouched && !firstNameIsValid;
  const showLastNameError = lastNameTouched && !lastNameIsValid;
  const showEmailError = emailTouched && email.length > 0 && !emailIsValid;
  const showPhoneError = phoneTouched && phone.length > 0 && !phoneIsValid;
  const showPasswordError = passwordTouched && password.length > 0 && !passwordIsValid;
  const showConfirmError = confirmTouched && confirmPassword.length > 0 && !confirmIsValid;
  const showTermsError = termsTouched && !acceptedTerms;

  const handleRegister = async () => {
    setFirstNameTouched(true);
    setLastNameTouched(true);
    setEmailTouched(true);
    setPhoneTouched(true);
    setPasswordTouched(true);
    setConfirmTouched(true);
    setTermsTouched(true);
    setError(null);

    if (!canSubmit) return;

    setIsLoading(true);
    try {
      const { accessToken, user } = await authApi.signUp({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });

      await signIn(accessToken, user);
      router.replace("/(cliente)/");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(
          err.statusCode === 409
            ? "Este email ya tiene una cuenta. Inicia sesion."
            : err.message,
        );
      } else {
        setError("Sin conexion. Verifica tu internet.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={["#450a0a", "#000000"]} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 items-center justify-center gap-8 px-5 py-10">
            <View className="w-full items-center gap-3">
              <View className="flex-row items-center gap-2">
                <Text className="text-5xl font-extrabold text-red-500">OK</Text>
                <Text className="text-5xl font-extrabold text-white">TA</Text>
                <Text className="text-5xl font-extrabold text-red-500">VA</Text>
              </View>
              <Text className="text-4xl font-bold text-white">Crea tu cuenta gratis</Text>
              <Text className="text-gray-400 text-center">
                Crea tu cuenta y comienza a disfrutar de Oktava
              </Text>
            </View>

            <View className="w-full gap-5">
              {error && (
                <View className="rounded-lg border border-red-500/50 bg-red-500/10 px-4 py-3">
                  <Text className="text-sm text-white">{error}</Text>
                </View>
              )}

              <Text className="text-center text-3xl font-bold text-white">Crear Cuenta</Text>

              <View className="flex-row gap-3">
                <View className="flex-1 gap-2">
                  <Text className="text-sm font-medium text-gray-400">Nombre</Text>
                  <TextInput
                    value={firstName}
                    onChangeText={(text) => {
                      setFirstName(text);
                      setError(null);
                      if (!firstNameTouched) setFirstNameTouched(true);
                    }}
                    placeholder="Tu nombre"
                    placeholderTextColor="#4b5563"
                    editable={!isLoading}
                    maxLength={100}
                    style={field(showFirstNameError)}
                  />
                  {showFirstNameError && <Text className="text-sm text-red-500">Requerido.</Text>}
                </View>
                <View className="flex-1 gap-2">
                  <Text className="text-sm font-medium text-gray-400">Apellido</Text>
                  <TextInput
                    value={lastName}
                    onChangeText={(text) => {
                      setLastName(text);
                      setError(null);
                      if (!lastNameTouched) setLastNameTouched(true);
                    }}
                    placeholder="Tu apellido"
                    placeholderTextColor="#4b5563"
                    editable={!isLoading}
                    maxLength={100}
                    style={field(showLastNameError)}
                  />
                  {showLastNameError && <Text className="text-sm text-red-500">Requerido.</Text>}
                </View>
              </View>

              <View className="gap-2">
                <Text className="text-sm font-medium text-gray-400">Correo electronico</Text>
                <TextInput
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setError(null);
                    if (!emailTouched) setEmailTouched(true);
                  }}
                  placeholder="tu@ejemplo.com"
                  placeholderTextColor="#4b5563"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  textContentType="emailAddress"
                  editable={!isLoading}
                  maxLength={254}
                  style={field(showEmailError)}
                />
                {showEmailError && (
                  <Text className="text-sm text-red-500">Ingresa un correo electronico valido.</Text>
                )}
              </View>

              <View className="gap-2">
                <Text className="text-sm font-medium text-gray-400">Numero de telefono</Text>
                <TextInput
                  value={phone}
                  onChangeText={(text) => {
                    setPhone(text.replace(/[^0-9]/g, ""));
                    setError(null);
                    if (!phoneTouched) setPhoneTouched(true);
                  }}
                  placeholder="Ej: 3001234567"
                  placeholderTextColor="#4b5563"
                  keyboardType="phone-pad"
                  editable={!isLoading}
                  maxLength={15}
                  style={field(showPhoneError)}
                />
                {showPhoneError && (
                  <Text className="text-sm text-red-500">
                    Ingresa un numero valido (min. 8 digitos).
                  </Text>
                )}
              </View>

              <View className="gap-2">
                <Text className="text-sm font-medium text-gray-400">Contrasena</Text>
                <View style={{ position: "relative" }}>
                  <TextInput
                    value={password}
                    onChangeText={(text) => {
                      setPassword(text);
                      setError(null);
                      if (!passwordTouched) setPasswordTouched(true);
                    }}
                    placeholder="**********"
                    placeholderTextColor="#4b5563"
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="password-new"
                    textContentType="newPassword"
                    editable={!isLoading}
                    maxLength={128}
                    style={[field(showPasswordError), { paddingRight: 48 }]}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((v) => !v)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: 0,
                      bottom: 0,
                      justifyContent: "center",
                    }}
                  >
                    {showPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                  </TouchableOpacity>
                </View>
                {showPasswordError && (
                  <Text className="text-sm text-red-500">
                    Usa 8+ caracteres con mayuscula, minuscula, numero y simbolo.
                  </Text>
                )}
              </View>

              <View className="gap-2">
                <Text className="text-sm font-medium text-gray-400">Confirmar contrasena</Text>
                <View style={{ position: "relative" }}>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={(text) => {
                      setConfirmPassword(text);
                      setError(null);
                      if (!confirmTouched) setConfirmTouched(true);
                    }}
                    placeholder="**********"
                    placeholderTextColor="#4b5563"
                    secureTextEntry={!showConfirm}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="password-new"
                    textContentType="newPassword"
                    editable={!isLoading}
                    maxLength={128}
                    style={[field(showConfirmError), { paddingRight: 48 }]}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirm((v) => !v)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: 0,
                      bottom: 0,
                      justifyContent: "center",
                    }}
                  >
                    {showConfirm ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                  </TouchableOpacity>
                </View>
                {showConfirmError && (
                  <Text className="text-sm text-red-500">Las contrasenas no coinciden.</Text>
                )}
              </View>

              <Pressable
                onPress={() => {
                  setAcceptedTerms((prev) => !prev);
                  setTermsTouched(true);
                  setError(null);
                }}
                disabled={isLoading}
                className="flex-row items-start gap-3"
              >
                <View
                  style={{
                    marginTop: 2,
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    borderWidth: 1,
                    borderColor: acceptedTerms ? "#ef4444" : "#6b7280",
                    backgroundColor: acceptedTerms ? "#ef4444" : "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {acceptedTerms ? (
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        backgroundColor: "white",
                      }}
                    />
                  ) : null}
                </View>
                <Text className="flex-1 text-sm text-gray-400">
                  Acepto los terminos y condiciones y las politicas de privacidad.
                </Text>
              </Pressable>
              {showTermsError && (
                <Text className="text-sm text-red-500">Debes aceptar los terminos para continuar.</Text>
              )}

              <Pressable
                onPress={handleRegister}
                disabled={!canSubmit || isLoading}
                style={{
                  backgroundColor: canSubmit && !isLoading ? "#b91c1c" : "#7f1d1d",
                  borderRadius: 8,
                  height: 48,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-base font-semibold text-white">Crear cuenta</Text>
                )}
              </Pressable>

              <View className="relative my-2">
                <View className="absolute inset-0 flex-row items-center">
                  <View className="flex-1 border-t border-[#4b5563]" />
                </View>
                <View className="items-center">
                  <Text className="px-2 text-sm text-gray-400" style={{ backgroundColor: "transparent" }}>
                    O continua con
                  </Text>
                </View>
              </View>

              <Pressable
                disabled={isLoading}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  borderWidth: 1,
                  borderColor: "#374151",
                  borderRadius: 8,
                  height: 48,
                  backgroundColor: "transparent",
                  opacity: isLoading ? 0.5 : 1,
                }}
              >
                <FontAwesome name="google" size={20} color="white" />
                <Text className="text-base font-medium text-white">Continuar con Google</Text>
              </Pressable>

              <Pressable onPress={() => router.push("/login")} disabled={isLoading}>
                <Text className="text-center text-sm text-gray-400">
                  Ya tienes cuenta? <Text className="text-red-400">Inicia sesion</Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
