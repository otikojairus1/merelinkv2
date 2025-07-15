import { ASYNCKEYS, BASE_URI } from "@/BASE_URI";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Link } from "expo-router";
import { MotiText, MotiView } from "moti";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Easing } from "react-native-reanimated";

const OrganizationInviteScreen = () => {
  AsyncStorage.getItem(ASYNCKEYS.CURRENT_ORGANIZATION).then((val) => {
    setOrgid(JSON.parse(val).id);
  });
  const { colorScheme } = useColorScheme();
  const [email, setEmail] = useState("");
  const [orgid, setOrgid] = useState(null);
  const [role, setRole] = useState("member");
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "searching" | "inviting" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");

  const textColor = colorScheme === "dark" ? "text-white" : "text-black";
  const cardBg = colorScheme === "dark" ? "bg-gray-800" : "bg-white";
  const inputBg = colorScheme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const buttonBg = colorScheme === "dark" ? "bg-blue-600" : "bg-blue-500";
  const dropdownBg = colorScheme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const dropdownBorder =
    colorScheme === "dark" ? "border-gray-600" : "border-gray-300";

  const handleSendInvite = async () => {
    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }

    setStatus("inviting");
    try {
      const token = await AsyncStorage.getItem(ASYNCKEYS.ACCESS_TOKEN);
      if (!token) throw new Error("No access token found");

      const response = await axios.post(
        `${BASE_URI}/api/organizations/${orgid}/invite`,
        { email, role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        setStatus("success");
      } else {
        throw new Error(response.data?.message || "Failed to send invitation");
      }
    } catch (err: any) {
      console.error("Error sending invitation:", err);
      setStatus("error");
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to send invitation"
      );
    }
  };

  const resetFlow = () => {
    setEmail("");
    setRole("member");
    setError("");
    setStatus("idle");
  };

  const roles = [
    { value: "member", label: "Member" },
    { value: "admin", label: "Admin" },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 pt-10 px-6 bg-gray-50 dark:bg-gray-900"
    >
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 400 }}
      >
        <Text className={`text-2xl font-bold mb-2 ${textColor}`}>
          Invite to Organization
        </Text>
        <Text className={`text-gray-500 dark:text-gray-400 mb-6`}>
          Send an invitation to join your organization
        </Text>
      </MotiView>

      {status === "success" ? (
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring" }}
          className="flex-1 items-center justify-center"
        >
          <MotiView
            animate={{
              scale: [1, 1.1, 1],
              rotate: ["0deg", "5deg", "0deg", "-5deg", "0deg"],
            }}
            transition={{
              type: "spring",
              loop: false,
              duration: 600,
            }}
          >
            <MaterialCommunityIcons
              name="check-circle"
              size={80}
              color="#10B981"
            />
          </MotiView>

          <MotiText
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 200 }}
            className={`text-xl font-bold mt-4 ${textColor}`}
          >
            Invitation Sent!
          </MotiText>

          <MotiText
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 300 }}
            className="text-gray-500 dark:text-gray-400 mt-2 text-center"
          >
            An invitation has been sent to {email} as{" "}
            {role === "admin" ? "an admin" : "a member"}
          </MotiText>

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 500 }}
            className="mt-8 w-full"
          >
            <TouchableOpacity
              onPress={resetFlow}
              className={`py-3 px-6 rounded-lg ${buttonBg} items-center`}
            >
              <Text className="text-white font-medium">
                Invite Another User
              </Text>
            </TouchableOpacity>

            <Link href="/" asChild>
              <TouchableOpacity className="py-3 px-6 rounded-lg mt-3 border border-gray-200 dark:border-gray-700 items-center">
                <Text className={`${textColor} font-medium`}>
                  Back to Dashboard
                </Text>
              </TouchableOpacity>
            </Link>
          </MotiView>
        </MotiView>
      ) : (
        <>
          {/* Email Input */}
          <MotiView>
            <Text className={`text-sm font-medium mb-2 ${textColor}`}>
              User Email
            </Text>
            <View
              className={`flex-row items-center ${inputBg} rounded-lg px-4 py-3 mb-4`}
            >
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
              />
              <TextInput
                placeholder="Enter user's email"
                placeholderTextColor={
                  colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                }
                className={`flex-1 ml-2 ${textColor}`}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setError("");
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={status !== "inviting"}
              />
            </View>

            {/* Role Dropdown */}
            <Text className={`text-sm font-medium mb-2 ${textColor}`}>
              Assign Role
            </Text>
            <View className="mb-6">
              <Pressable
                onPress={() => setShowRoleDropdown(!showRoleDropdown)}
                className={`flex-row items-center justify-between ${inputBg} rounded-lg px-4 py-3 border ${dropdownBorder}`}
              >
                <Text className={textColor}>
                  {role === "admin" ? "Admin" : "Member"}
                </Text>
                <MaterialCommunityIcons
                  name={showRoleDropdown ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
                />
              </Pressable>

              {showRoleDropdown && (
                <View
                  className={`mt-1 ${dropdownBg} rounded-lg border ${dropdownBorder} overflow-hidden`}
                >
                  {roles.map((r) => (
                    <Pressable
                      key={r.value}
                      onPress={() => {
                        setRole(r.value);
                        setShowRoleDropdown(false);
                      }}
                      className={`px-4 py-3 ${role === r.value ? "bg-blue-100 dark:bg-blue-900/30" : ""}`}
                    >
                      <Text
                        className={`${textColor} ${
                          role === r.value ? "font-medium" : ""
                        }`}
                      >
                        {r.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* Error Message */}
            {(error || status === "error") && (
              <MotiView
                from={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-100 dark:bg-red-900/20 p-3 rounded-lg mb-4"
              >
                <Text className="text-red-600 dark:text-red-400">
                  {error || "Failed to send invitation"}
                </Text>
              </MotiView>
            )}

            {/* Submit Button */}
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
            >
              <TouchableOpacity
                onPress={handleSendInvite}
                disabled={status === "inviting" || !email.includes("@")}
                className={`py-3 rounded-lg ${buttonBg} items-center justify-center ${
                  status === "inviting" || !email.includes("@")
                    ? "opacity-70"
                    : ""
                }`}
              >
                {status === "inviting" ? (
                  <MotiView
                    animate={{ rotate: "360deg" }}
                    transition={{
                      repeatReverse: false,
                      repeat: Infinity,
                      duration: 1000,
                      easing: Easing.linear,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="loading"
                      size={20}
                      color="white"
                    />
                  </MotiView>
                ) : (
                  <Text className="text-white font-medium">
                    Send Invitation
                  </Text>
                )}
              </TouchableOpacity>
            </MotiView>
          </MotiView>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

export default OrganizationInviteScreen;
