import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Link, useRouter } from "expo-router";
import { MotiView } from "moti";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { ASYNCKEYS, BASE_URI } from "../../../BASE_URI";

export default function LoginScreen() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleLogin = async () => {
    // Validate form
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(`${BASE_URI}/api/login`, {
        email: formData.email,
        password: formData.password,
      });
      await AsyncStorage.setItem(
        ASYNCKEYS.USER,
        JSON.stringify(response.data.user)
      );
      await AsyncStorage.setItem(
        ASYNCKEYS.ACCESS_TOKEN,
        response.data.access_token
      );
      await AsyncStorage.setItem(ASYNCKEYS.ONBOARDING_STEP, "COMPLETED");

      ToastAndroid.show("Login successful", ToastAndroid.SHORT);
      router.replace("/");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
      ToastAndroid.show("Login failed. Please try again.", ToastAndroid.LONG);
    } finally {
      setIsLoading(false);
    }
  };

  const OutlinedEmail = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
        stroke={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
        strokeWidth={2}
      />
      <Path
        d="M22 6l-10 7L2 6"
        stroke={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );

  const OutlinedLock = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z"
        stroke={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
        strokeWidth={2}
      />
      <Path
        d="M7 11V7a5 5 0 0 1 10 0v4"
        stroke={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500 }}
          className="flex-1 px-8 pt-16 bg-white dark:bg-gray-900 pb-10"
        >
          {/* Header */}
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", delay: 100 }}
            className="items-center mb-10"
          >
            <MotiView
              from={{ rotate: "-10deg", scale: 0.8 }}
              animate={{ rotate: "0deg", scale: 1 }}
              transition={{ type: "spring", delay: 200 }}
              className="bg-blue-100 dark:bg-blue-900/30 p-5 rounded-full mb-4"
            >
              <MaterialCommunityIcons
                name="login-variant"
                size={40}
                color={colorScheme === "dark" ? "#60A5FA" : "#3B82F6"}
              />
            </MotiView>
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: "timing", delay: 200 }}
            >
              <Text className="text-3xl font-bold text-gray-900 dark:text-white text-center">
                Welcome Back
              </Text>
              <Text className="text-lg text-gray-500 dark:text-gray-400 mt-2 text-center">
                Sign in to continue data collection
              </Text>
            </MotiView>
          </MotiView>

          {/* Error Message */}
          {error && (
            <MotiView
              from={{ opacity: 0, translateY: -10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "timing" }}
              className="mb-4 p-3 w-fit rounded-lg"
            >
              <Text className="text-red-600 dark:text-red-400 text-center">
                {error}
              </Text>
            </MotiView>
          )}

          {/* Form */}
          <MotiView
            from={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", delay: 300 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 shadow-lg shadow-black/10 dark:shadow-black/20"
          >
            {/* Email Field */}
            <MotiView
              from={{ opacity: 0, translateX: -10 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: "timing", delay: 400 }}
              className="mb-6"
            >
              <View className="flex-row items-center border-b border-gray-200 dark:border-gray-600 pb-2">
                <View className="mr-3">
                  <OutlinedEmail />
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
                  returnKeyType="next"
                  // onSubmitEditing={() => {
                  //   // Focus next input (password)
                  //   this.passwordInput.focus();
                  // }}
                />
              </View>
            </MotiView>

            {/* Password Field */}
            <MotiView
              from={{ opacity: 0, translateX: -10 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: "timing", delay: 450 }}
              className="mb-8"
            >
              <View className="flex-row items-center border-b border-gray-200 dark:border-gray-600 pb-2">
                <View className="mr-3">
                  <OutlinedLock />
                </View>
                <TextInput
                  // ref={(input) => {
                  //   this.passwordInput = input;
                  // }}
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
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
                  />
                </TouchableOpacity>
              </View>
            </MotiView>

            {/* Forgot Password Link */}
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: "timing", delay: 500 }}
              className="self-end mb-6"
            >
              <Link
                href="/features/onboarding/ResetPassword"
                className="text-blue-600 dark:text-blue-400 text-sm font-medium"
              >
                Forgot Password?
              </Link>
            </MotiView>

            {/* Login Button */}
            <MotiView
              from={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", delay: 550 }}
            >
              <TouchableOpacity
                onPress={handleLogin}
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
                      Signing In...
                    </Text>
                  </>
                ) : (
                  <Text className="text-white text-center font-bold text-lg">
                    Sign In
                  </Text>
                )}
              </TouchableOpacity>
            </MotiView>

            {/* Sign Up Link - Only show when keyboard is not visible */}
            {!keyboardVisible && (
              <MotiView
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: "timing", delay: 600 }}
                className="flex-row justify-center mt-6"
              >
                <Text className="text-gray-500 dark:text-gray-400">
                  Don't have an account?{" "}
                </Text>
                <Link
                  href="/features/onboarding/Signup"
                  className="text-blue-600 dark:text-blue-400 font-medium"
                >
                  Sign Up
                </Link>
              </MotiView>
            )}
          </MotiView>
        </MotiView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
