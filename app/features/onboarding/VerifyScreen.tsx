import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { useColorScheme } from "nativewind";
import { Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { ASYNCKEYS } from "../../../BASE_URI";

export default function VerifyEmailScreen() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();

  const OutlinedEmail = () => (
    <Svg width={120} height={120} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        stroke={colorScheme === "dark" ? "#60A5FA" : "#3B82F6"}
        strokeWidth={2}
      />
      <Path
        d="M22 6l-10 7L2 6"
        stroke={colorScheme === "dark" ? "#60A5FA" : "#3B82F6"}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );

  const handleContinue = async () => {
    await AsyncStorage.setItem(ASYNCKEYS.ONBOARDING_STEP, "COMPLETED");
    router.replace("/features/onboarding/Login");
  };

  const handleResend = () => {
    console.log("Resend verification email");
  };

  return (
    <View className="flex-1 px-8 pt-24 bg-white dark:bg-gray-900">
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 500 }}
        className="items-center mb-12"
      >
        <MotiView
          from={{ scale: 0.8, rotate: "-10deg" }}
          animate={{ scale: 1, rotate: "0deg" }}
          transition={{ type: "spring", delay: 100 }}
          className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full mb-6"
        >
          <OutlinedEmail />
        </MotiView>
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "timing", delay: 200 }}
        >
          <Text className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-2">
            Verify Your Email
          </Text>
          <Text className="text-lg text-gray-500 dark:text-gray-400 text-center">
            We've sent a verification link to your email
          </Text>
        </MotiView>
      </MotiView>

      {/* Content */}
      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", delay: 300 }}
        className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 shadow-lg shadow-black/10 dark:shadow-black/20"
      >
        {/* Step 1 */}
        <MotiView
          from={{ opacity: 0, translateX: -10 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: "timing", delay: 400 }}
          className="flex-row items-start mb-6"
        >
          <MaterialCommunityIcons
            name="numeric-1-circle-outline"
            size={24}
            color={colorScheme === "dark" ? "#60A5FA" : "#3B82F6"}
            className="mr-3 mt-1"
          />
          <View className="flex-1">
            <Text className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              Check your inbox
            </Text>
            <Text className="text-gray-500 dark:text-gray-400">
              Look for an email from merelink@example.com
            </Text>
          </View>
        </MotiView>

        {/* Step 2 */}
        <MotiView
          from={{ opacity: 0, translateX: -10 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: "timing", delay: 500 }}
          className="flex-row items-start mb-8"
        >
          <MaterialCommunityIcons
            name="numeric-2-circle-outline"
            size={24}
            color={colorScheme === "dark" ? "#60A5FA" : "#3B82F6"}
            className="mr-3 mt-1"
          />
          <View className="flex-1">
            <Text className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              Click the verification link
            </Text>
            <Text className="text-gray-500 dark:text-gray-400">
              This will confirm your email address
            </Text>
          </View>
        </MotiView>

        {/* Continue Button */}
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", delay: 600 }}
        >
          <TouchableOpacity
            onPress={handleContinue}
            className="bg-blue-600 dark:bg-blue-500 py-4 rounded-xl shadow-md shadow-blue-500/20 dark:shadow-blue-900/30"
          >
            <Text className="text-white text-center font-bold text-lg">
              Continue to App
            </Text>
          </TouchableOpacity>
        </MotiView>

        {/* Resend Link */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "timing", delay: 700 }}
          className="flex-row justify-center mt-6"
        >
          <Text className="text-gray-500 dark:text-gray-400 mr-1">
            Didn't receive email?
          </Text>
          <TouchableOpacity onPress={handleResend}>
            <Text className="text-blue-600 dark:text-blue-400 font-medium">
              Resend
            </Text>
          </TouchableOpacity>
        </MotiView>
      </MotiView>
    </View>
  );
}
