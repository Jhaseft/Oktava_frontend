import { Stack } from "expo-router";
import HeaderTitle from "./HeaderTitle";

type Props = {
  showBackButton?: boolean;
  backgroundColor?: string;
};

export default function ScreenHeader({
  showBackButton = false,
  backgroundColor = "black",
}: Props) {
  return (
    <Stack.Screen
      options={{
        headerShown: true,
        headerBackVisible: showBackButton,
        headerTitleAlign: "left",
        headerTitle: () => <HeaderTitle />,
        headerStyle: { backgroundColor },
        headerShadowVisible: false,
      }}
    />
  );
}