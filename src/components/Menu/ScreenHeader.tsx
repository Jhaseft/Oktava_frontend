import { Stack } from "expo-router";
import HeaderTitle from "./HeaderTitle";

type Props = {
  title: string;
  showBackButton?: boolean;

  backgroundColor?: string;
};

export default function ScreenHeader({
  title,
  showBackButton = false,
  backgroundColor = "black",
}: Props) {
  return (
    <Stack.Screen
      options={{
        headerShown: true,
        headerBackVisible: showBackButton,
        headerTitleAlign: "left",

        headerTitle: () => (
          <HeaderTitle
            title={title}
          />
        ),

        headerStyle: {
          backgroundColor,
        },

        headerShadowVisible: false,
      }}
    />
  );
}