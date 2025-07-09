import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { Link, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import BASE_URI from "../../../BASE_URI"; // Adjust the import path as necessary

export default function SignupScreen() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    // Validate form
    if (!formData.fullname || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    setError("");

    ToastAndroid.show("Creating account...", ToastAndroid.SHORT);

    try {
      const response = await axios.post(`${BASE_URI}/api/register`, {
        fullname: formData.fullname,
        email: formData.email,
        password: formData.password,
      });
      router.replace("/features/onboarding/VerifyScreen");
    } catch (err: any) {
      ToastAndroid.show(
        "Registration failed. Please try again.",
        ToastAndroid.LONG
      );
      setError(
        err.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Custom outlined icons as components
  const OutlinedUser = () => (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
    >
      <Path
        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
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

  const OutlinedLock = () => (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      stroke={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
    >
      <Path
        d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z"
        strokeWidth={2}
      />
      <Path
        d="M7 11V7a5 5 0 0 1 10 0v4"
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <View className="flex-1 px-8 pt-16 bg-white dark:bg-gray-900">
        {/* Decorative Header */}
        <View className="items-center mb-10">
          <View className="bg-blue-100 dark:bg-blue-900/30 p-5 rounded-full mb-4">
            <MaterialCommunityIcons
              name="chart-box-outline"
              size={40}
              color={colorScheme === "dark" ? "#60A5FA" : "#3B82F6"}
            />
          </View>
          <Text className="text-4xl font-bold text-gray-900 dark:text-white text-center">
            Join Merelink
          </Text>
          <Text className="text-lg text-gray-500 dark:text-gray-400 mt-2 text-center">
            Your gateway to powerful data collection
          </Text>
        </View>

        {/* Error Message */}
        {error ? (
          <View className="mb-4 p-3 w-fit rounded-lg">
            <Text className="text-red-600 dark:text-red-400 text-center">
              {error}
            </Text>
          </View>
        ) : null}

        {/* Floating Form Container */}
        <View className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 shadow-lg shadow-black/10 dark:shadow-black/20">
          {/* Name Field */}
          <View className="mb-6">
            <View className="flex-row items-center border-b border-gray-200 dark:border-gray-600 pb-2">
              <View className="mr-3">
                <OutlinedUser />
              </View>
              <TextInput
                placeholder="Full Name"
                placeholderTextColor={
                  colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                }
                className="flex-1 text-gray-900 dark:text-white text-lg"
                value={formData.fullname}
                onChangeText={(text) =>
                  setFormData({ ...formData, fullname: text })
                }
              />
            </View>
          </View>

          {/* Email Field */}
          <View className="mb-6">
            <View className="flex-row items-center border-b border-gray-200 dark:border-gray-600 pb-2">
              <View className="mr-3">
                <OutlinedEnvelope />
              </View>
              <TextInput
                placeholder="Email Address"
                placeholderTextColor={
                  colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                }
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 text-gray-900 dark:text-white text-lg"
                value={formData.email}
                onChangeText={(text) =>
                  setFormData({ ...formData, email: text })
                }
              />
            </View>
          </View>

          {/* Password Field */}
          <View className="mb-8">
            <View className="flex-row items-center border-b border-gray-200 dark:border-gray-600 pb-2">
              <View className="mr-3">
                <OutlinedLock />
              </View>
              <TextInput
                placeholder="Password"
                placeholderTextColor={
                  colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                }
                secureTextEntry={!showPassword}
                className="flex-1 text-gray-900 dark:text-white text-lg"
                value={formData.password}
                onChangeText={(text) =>
                  setFormData({ ...formData, password: text })
                }
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <MaterialCommunityIcons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={22}
                  color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Signup Button */}
          <TouchableOpacity
            onPress={handleSignup}
            disabled={isLoading}
            className="bg-blue-600 dark:bg-blue-500 py-4 rounded-xl shadow-md shadow-blue-500/20 dark:shadow-blue-900/30 flex-row justify-center items-center"
          >
            {isLoading ? (
              <>
                <ActivityIndicator
                  color="#ffffff"
                  size="small"
                  className="mr-2"
                />
                <Text className="text-white text-center font-bold text-lg">
                  Creating Account...
                </Text>
              </>
            ) : (
              <Text className="text-white text-center font-bold text-lg">
                Create Account
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-500 dark:text-gray-400">
            Already registered?{" "}
          </Text>
          <Link
            href="/features/onboarding/Login"
            className="text-blue-600 dark:text-blue-400 font-medium"
          >
            Sign In
          </Link>
        </View>

        {/* Decorative Bottom Element */}
        <View className="absolute pointer-events-none bottom-0 left-0 right-0 items-center opacity-20 dark:opacity-30">
          <Svg width={799.258} height={645.667} viewBox="0 0 799.258 645.667">
            {/* ... (keep your existing SVG code) ... */}
          </Svg>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
