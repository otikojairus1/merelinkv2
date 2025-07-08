import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

export default function RootLayout() {
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(true);
  const [fontsLoaded] = useFonts({
    // "Inter-Bold": require("../assets/fonts/Inter-Bold.ttf"),
  });
  // useEffect(() => {
  //   const checkOnboardingStatus = async () => {
  //     const completed = await AsyncStorage.getItem("@onboarding_completed");
  //     setShowOnboarding(completed === "true");
  //   };
  //   checkOnboardingStatus();
  // }, []);

  if (!fontsLoaded || showOnboarding === null) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack>
      <Stack.Screen
        name="features/onboarding/screens/AddProjects"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="features/onboarding/createOrganization"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="features/onboarding/Signup"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="features/onboarding/VerifyScreen"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="features/onboarding/Login"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="features/onboarding/ResetPassword"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="features/onboarding/OrganizationInvite"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="features/Home/Analytics"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="features/Home/ProjectList"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
