import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { Text, TouchableOpacity, View } from "react-native";
import Svg, { Path } from "react-native-svg";

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
  const OutlinedEnvelope = () => (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
    >
      <Path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        strokeWidth={2}
      />
      <Path d="M22 6l-10 7L2 6" strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );

  return (
    <View className="flex-1 px-8 pt-24 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="items-center mb-12">
        <View className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-full mb-6">
          <OutlinedEmail />
        </View>
        <Text className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-2">
          Verify Your Email
        </Text>
        <Text className="text-lg text-gray-500 dark:text-gray-400 text-center">
          We've sent a verification link to your email
        </Text>
      </View>

      {/* Content */}
      <View className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 shadow-lg shadow-black/10 dark:shadow-black/20">
        <View className="flex-row items-start mb-6">
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
        </View>

        <View className="flex-row items-start mb-8">
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
        </View>

        <TouchableOpacity
          onPress={() => router.push("/(tabs)")}
          className="bg-blue-600 dark:bg-blue-500 py-4 rounded-xl shadow-md shadow-blue-500/20 dark:shadow-blue-900/30"
        >
          <Text className="text-white text-center font-bold text-lg">
            Continue to App
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-500 dark:text-gray-400 mr-1">
            Didn't receive email?
          </Text>
          <TouchableOpacity>
            <Text className="text-blue-600 dark:text-blue-400 font-medium">
              Resend
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
