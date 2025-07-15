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
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="features/onboarding/Signup" />
      <Stack.Screen name="index" />
      <Stack.Screen name="features/onboarding/screens/SubmitForm" />
      <Stack.Screen name="features/onboarding/screens/AddForm" />
      <Stack.Screen name="features/onboarding/screens/ManageUsers" />
      <Stack.Screen name="features/onboarding/screens/Profile" />
      <Stack.Screen name="features/onboarding/screens/AddProjects" />
      <Stack.Screen name="features/onboarding/createOrganization" />
      <Stack.Screen name="features/onboarding/VerifyScreen" />
      <Stack.Screen name="features/onboarding/Login" />
      <Stack.Screen name="features/onboarding/ResetPassword" />
      <Stack.Screen name="features/onboarding/OrganizationInvite" />
      <Stack.Screen name="features/Home/Analytics" />
      <Stack.Screen name="features/Home/ProjectList" />
      <Stack.Screen name="/features/onboarding/screens/ProjectLeader" />
      <Stack.Screen name="/features/onboarding/screens/EditProject" />
    </Stack>
  );
}
