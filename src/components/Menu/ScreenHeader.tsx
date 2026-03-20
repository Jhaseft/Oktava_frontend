import { Stack } from "expo-router";
import HeaderTitle from "./HeaderTitle";

type TitlePart = {
  text: string;
  color: string;
};

type Props = {
  title?: string;
  showBackButton?: boolean;
  backgroundColor?: string;
  titleParts?: TitlePart[];
};

export default function ScreenHeader({
  title,
  showBackButton = false,
  backgroundColor = "black",
  titleParts,
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
            titleParts={titleParts}
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