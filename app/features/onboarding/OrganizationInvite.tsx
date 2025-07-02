import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { MotiText, MotiView } from "moti";
import { useColorScheme } from "nativewind";
import { useState } from "react";

import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";

import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Easing } from "react-native-reanimated";

const OrganizationInviteScreen = () => {
  const { colorScheme } = useColorScheme();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [status, setStatus] = useState("idle"); // 'idle' | 'searching' | 'found' | 'inviting' | 'success'
  const [user, setUser] = useState(null);

  const textColor = colorScheme === "dark" ? "text-white" : "text-black";
  const cardBg = colorScheme === "dark" ? "bg-gray-800" : "bg-white";
  const inputBg = colorScheme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const buttonBg = colorScheme === "dark" ? "bg-blue-600" : "bg-blue-500";

  const handleSearch = async () => {
    setStatus("searching");
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock response
    const mockUser = {
      id: "123",
      name: "John Doe",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      currentOrgs: ["Acme Inc"],
    };

    setUser(mockUser);
    setStatus("found");
  };

  const handleSendInvite = async () => {
    setStatus("inviting");
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setStatus("success");
  };

  const resetFlow = () => {
    setEmail("");
    setUser(null);
    setStatus("idle");
  };

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
          Add existing users to your organization
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
            {user.name} has been invited to join as{" "}
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

            <Link href="/(tabs)" asChild>
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
          {/* Search Phase */}
          <MotiView
            animate={{
              opacity: status === "found" ? 0 : 1,
              height: status === "found" ? 0 : "auto",
              translateY: status === "found" ? -20 : 0,
            }}
            transition={{ type: "timing", duration: 400 }}
          >
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
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={status === "idle"}
              />
              {status === "searching" && (
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
                    color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
                  />
                </MotiView>
              )}
            </View>

            {status === "idle" && (
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
              >
                <TouchableOpacity
                  onPress={handleSearch}
                  disabled={!email.includes("@")}
                  className={`py-3 rounded-lg ${buttonBg} items-center justify-center opacity-${!email.includes("@") ? "50" : "100"}`}
                >
                  <Text className="text-white font-medium">Find User</Text>
                </TouchableOpacity>
              </MotiView>
            )}
          </MotiView>

          {/* User Found Phase */}
          {status === "found" && user && (
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: "spring" }}
              className={`p-4 rounded-xl ${cardBg} shadow-sm border ${colorScheme === "dark" ? "border-gray-700" : "border-gray-200"} mb-6`}
            >
              <View className="flex-row items-center mb-4">
                <View className="w-12 h-12 rounded-full bg-gray-300 mr-3 overflow-hidden">
                  {/* User avatar would go here */}
                </View>
                <View>
                  <Text className={`text-lg font-bold ${textColor}`}>
                    {user.name}
                  </Text>
                  <Text className="text-gray-500 dark:text-gray-400 text-sm">
                    {email}
                  </Text>
                </View>
              </View>

              <Text className={`text-sm font-medium mb-2 ${textColor}`}>
                Current Organizations
              </Text>
              <View className="flex-row flex-wrap mb-4">
                {user.currentOrgs.map((org, index) => (
                  <View
                    key={index}
                    className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full mr-2 mb-2"
                  >
                    <Text className="text-xs text-gray-800 dark:text-gray-200">
                      {org}
                    </Text>
                  </View>
                ))}
              </View>

              <Text className={`text-sm font-medium mb-2 ${textColor}`}>
                Assign Role
              </Text>
              <View className="flex-row border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden mb-6">
                {["member", "admin"].map((r) => (
                  <TouchableOpacity
                    key={r}
                    onPress={() => setRole(r)}
                    className={`flex-1 py-2 items-center ${role === r ? "bg-blue-100 dark:bg-blue-900/30" : ""}`}
                  >
                    <Text
                      className={`text-sm ${role === r ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"}`}
                    >
                      {r === "admin" ? "Admin" : "Member"}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => {
                    setUser(null);
                    setStatus("idle");
                  }}
                  className="flex-1 py-2 px-4 rounded-lg border border-gray-200 dark:border-gray-700 mr-2 items-center"
                >
                  <Text className={`${textColor} font-medium`}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSendInvite}
                  className={`flex-1 py-2 px-4 rounded-lg ${buttonBg} items-center`}
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
                    <Text className="text-white font-medium">Send Invite</Text>
                  )}
                </TouchableOpacity>
              </View>
            </MotiView>
          )}
        </>
      )}

    </KeyboardAvoidingView>
  );
};

export default OrganizationInviteScreen;
