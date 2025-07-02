// app/_layout.tsx
import { Stack } from "expo-router";
// import { OnboardingScreen } from "../features/onboarding";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function RootLayout() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  // Load fonts (optional)
  const [fontsLoaded] = useFonts({
    // "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
  });

  // Check if onboarding is completed
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const completed = await AsyncStorage.getItem("@onboarding_completed");
      setShowOnboarding(completed === "true");
    };
    checkOnboardingStatus();
  }, []);

  if (!fontsLoaded || showOnboarding === null) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack>
      {showOnboarding ? (
        <Stack.Screen
          name="index" // Renders the onboardgit branch -M maining screen first
          options={{ headerShown: false }}
        />
      ) : (
        <Stack.Screen
          name="(tabs)" // Your main app tabs/screens
          options={{ headerShown: false }}
        />
      )}
    </Stack>
  );
}
