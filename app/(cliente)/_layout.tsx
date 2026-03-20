import { Stack } from "expo-router";

export default function ClienteLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#111" },
        headerTintColor: "white",
        headerTitleStyle: { fontWeight: "900" },
        headerTitle: "Carrito",
      }}
    />
  );
}
