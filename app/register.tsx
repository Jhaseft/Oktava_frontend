import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
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
import { ChevronDown, Eye, EyeOff, Search } from "lucide-react-native";
import { FontAwesome } from "@expo/vector-icons";
import { authApi, ApiError, setPendingSignUp } from "@/src/services/authApi";

// ─── Códigos de país ──────────────────────────────────────────────────────────

type CountryCode = { flag: string; name: string; dial: string };

const COUNTRY_CODES: CountryCode[] = [
  { flag: "🇨🇴", name: "Colombia",          dial: "+57"  },
  { flag: "🇲🇽", name: "México",            dial: "+52"  },
  { flag: "🇦🇷", name: "Argentina",         dial: "+54"  },
  { flag: "🇨🇱", name: "Chile",             dial: "+56"  },
  { flag: "🇵🇪", name: "Perú",              dial: "+51"  },
  { flag: "🇻🇪", name: "Venezuela",         dial: "+58"  },
  { flag: "🇪🇨", name: "Ecuador",           dial: "+593" },
  { flag: "🇧🇴", name: "Bolivia",           dial: "+591" },
  { flag: "🇵🇾", name: "Paraguay",          dial: "+595" },
  { flag: "🇺🇾", name: "Uruguay",           dial: "+598" },
  { flag: "🇵🇦", name: "Panamá",            dial: "+507" },
  { flag: "🇨🇷", name: "Costa Rica",        dial: "+506" },
  { flag: "🇬🇹", name: "Guatemala",         dial: "+502" },
  { flag: "🇭🇳", name: "Honduras",          dial: "+504" },
  { flag: "🇸🇻", name: "El Salvador",       dial: "+503" },
  { flag: "🇳🇮", name: "Nicaragua",         dial: "+505" },
  { flag: "🇩🇴", name: "Rep. Dominicana",   dial: "+1"   },
  { flag: "🇺🇸", name: "Estados Unidos",    dial: "+1"   },
  { flag: "🇨🇦", name: "Canadá",            dial: "+1"   },
  { flag: "🇪🇸", name: "España",            dial: "+34"  },
  { flag: "🇧🇷", name: "Brasil",            dial: "+55"  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email.trim());
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

// ─── Componente ───────────────────────────────────────────────────────────────

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dialCode, setDialCode] = useState<CountryCode>(COUNTRY_CODES[0]);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");

  const [firstNameTouched, setFirstNameTouched] = useState(false);
  const [lastNameTouched, setLastNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [termsTouched, setTermsTouched] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredCountries = useMemo(
    () =>
      COUNTRY_CODES.filter(
        (c) =>
          c.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
          c.dial.includes(pickerSearch),
      ),
    [pickerSearch],
  );

  const firstNameIsValid = useMemo(() => firstName.trim().length > 0, [firstName]);
  const lastNameIsValid  = useMemo(() => lastName.trim().length > 0, [lastName]);
  const emailIsValid     = useMemo(() => isValidEmail(email), [email]);
  const phoneIsValid     = useMemo(() => phone.trim().length >= 7, [phone]);
  const passwordIsValid  = useMemo(() => password.length >= 8, [password]);
  const confirmIsValid   = useMemo(
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
  const showLastNameError  = lastNameTouched  && !lastNameIsValid;
  const showEmailError     = emailTouched     && email.length > 0    && !emailIsValid;
  const showPhoneError     = phoneTouched     && phone.length > 0    && !phoneIsValid;
  const showPasswordError  = passwordTouched  && password.length > 0 && !passwordIsValid;
  const showConfirmError   = confirmTouched   && confirmPassword.length > 0 && !confirmIsValid;
  const showTermsError     = termsTouched     && !acceptedTerms;

  const handleContinue = async () => {
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
      await authApi.sendVerification(email.trim());
      setPendingSignUp({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: `${dialCode.dial}${phone.trim()}`,
        password,
      });
      router.push("/verify-code");
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

              {/* Nombre / Apellido */}
              <View className="flex-row gap-3">
                <View className="flex-1 gap-2">
                  <Text className="text-sm font-medium text-gray-400">Nombre</Text>
                  <TextInput
                    value={firstName}
                    onChangeText={(t) => { setFirstName(t); setError(null); if (!firstNameTouched) setFirstNameTouched(true); }}
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
                    onChangeText={(t) => { setLastName(t); setError(null); if (!lastNameTouched) setLastNameTouched(true); }}
                    placeholder="Tu apellido"
                    placeholderTextColor="#4b5563"
                    editable={!isLoading}
                    maxLength={100}
                    style={field(showLastNameError)}
                  />
                  {showLastNameError && <Text className="text-sm text-red-500">Requerido.</Text>}
                </View>
              </View>

              {/* Email */}
              <View className="gap-2">
                <Text className="text-sm font-medium text-gray-400">Correo electronico</Text>
                <TextInput
                  value={email}
                  onChangeText={(t) => { setEmail(t); setError(null); if (!emailTouched) setEmailTouched(true); }}
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

              {/* Teléfono con selector de código */}
              <View className="gap-2">
                <Text className="text-sm font-medium text-gray-400">Numero de telefono</Text>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {/* Dial code picker */}
                  <Pressable
                    onPress={() => { setShowPicker(true); setPickerSearch(""); }}
                    disabled={isLoading}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                      backgroundColor: "#000",
                      borderWidth: 1,
                      borderColor: "#374151",
                      borderRadius: 8,
                      paddingHorizontal: 12,
                      paddingVertical: 12,
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>{dialCode.flag}</Text>
                    <Text style={{ color: "#d1d5db", fontSize: 15, marginLeft: 2 }}>{dialCode.dial}</Text>
                    <ChevronDown size={14} color="#6b7280" style={{ marginLeft: 2 }} />
                  </Pressable>

                  {/* Number input */}
                  <TextInput
                    value={phone}
                    onChangeText={(t) => {
                      setPhone(t.replaceAll(/\D/g, ""));
                      setError(null);
                      if (!phoneTouched) setPhoneTouched(true);
                    }}
                    placeholder="3001234567"
                    placeholderTextColor="#4b5563"
                    keyboardType="phone-pad"
                    editable={!isLoading}
                    maxLength={15}
                    style={[field(showPhoneError), { flex: 1 }]}
                  />
                </View>
                {showPhoneError && (
                  <Text className="text-sm text-red-500">
                    Ingresa un numero valido (min. 7 digitos).
                  </Text>
                )}
              </View>

              {/* Contraseña */}
              <View className="gap-2">
                <Text className="text-sm font-medium text-gray-400">Contrasena</Text>
                <View style={{ position: "relative" }}>
                  <TextInput
                    value={password}
                    onChangeText={(t) => { setPassword(t); setError(null); if (!passwordTouched) setPasswordTouched(true); }}
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
                    style={{ position: "absolute", right: 12, top: 0, bottom: 0, justifyContent: "center" }}
                  >
                    {showPassword ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                  </TouchableOpacity>
                </View>
                {showPasswordError && (
                  <Text className="text-sm text-red-500">Minimo 8 caracteres.</Text>
                )}
              </View>

              {/* Confirmar contraseña */}
              <View className="gap-2">
                <Text className="text-sm font-medium text-gray-400">Confirmar contrasena</Text>
                <View style={{ position: "relative" }}>
                  <TextInput
                    value={confirmPassword}
                    onChangeText={(t) => { setConfirmPassword(t); setError(null); if (!confirmTouched) setConfirmTouched(true); }}
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
                    style={{ position: "absolute", right: 12, top: 0, bottom: 0, justifyContent: "center" }}
                  >
                    {showConfirm ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
                  </TouchableOpacity>
                </View>
                {showConfirmError && (
                  <Text className="text-sm text-red-500">Las contrasenas no coinciden.</Text>
                )}
              </View>

              {/* Términos */}
              <Pressable
                onPress={() => { setAcceptedTerms((p) => !p); setTermsTouched(true); setError(null); }}
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
                  {acceptedTerms && (
                    <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: "white" }} />
                  )}
                </View>
                <Text className="flex-1 text-sm text-gray-400">
                  Acepto los terminos y condiciones y las politicas de privacidad.
                </Text>
              </Pressable>
              {showTermsError && (
                <Text className="text-sm text-red-500">Debes aceptar los terminos para continuar.</Text>
              )}

              {/* Continuar */}
              <Pressable
                onPress={handleContinue}
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
                  <Text className="text-base font-semibold text-white">Continuar</Text>
                )}
              </Pressable>

              {/* Divider */}
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

              {/* Google */}
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

              <Pressable
                onPress={() => router.replace("/(cliente)/")}
                disabled={isLoading}
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
              >
                <Text className="text-center text-sm text-gray-600  ">
                  Ver menú sin cuenta →
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── Modal selector de código de país ── */}
      <Modal visible={showPicker} animationType="slide" transparent>
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }}
          onPress={() => setShowPicker(false)}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "#111",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: "70%",
              paddingTop: 12,
            }}
          >
            {/* Handle */}
            <View style={{ alignItems: "center", marginBottom: 12 }}>
              <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: "#374151" }} />
            </View>

            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700", marginHorizontal: 16, marginBottom: 12 }}>
              Codigo de pais
            </Text>

            {/* Búsqueda */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 16,
                marginBottom: 8,
                backgroundColor: "#1f2937",
                borderRadius: 8,
                paddingHorizontal: 12,
                gap: 8,
              }}
            >
              <Search size={16} color="#6b7280" />
              <TextInput
                value={pickerSearch}
                onChangeText={setPickerSearch}
                placeholder="Buscar pais o codigo..."
                placeholderTextColor="#4b5563"
                style={{ flex: 1, color: "#d1d5db", fontSize: 14, paddingVertical: 10 }}
              />
            </View>

            {/* Lista */}
            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => `${item.name}-${item.dial}`}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => { setDialCode(item); setShowPicker(false); }}
                  style={({ pressed }) => {
                    let bg = "transparent";
                    if (pressed) bg = "#1f2937";
                    else if (item.name === dialCode.name) bg = "#1c1c1e";
                    return {
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      backgroundColor: bg,
                    };
                  }}
                >
                  <Text style={{ fontSize: 22 }}>{item.flag}</Text>
                  <Text style={{ flex: 1, color: "#d1d5db", fontSize: 15 }}>{item.name}</Text>
                  <Text style={{ color: "#6b7280", fontSize: 14 }}>{item.dial}</Text>
                  {item.name === dialCode.name && (
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#ef4444" }} />
                  )}
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </LinearGradient>
  );
}
