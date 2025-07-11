import { ASYNCKEYS, BASE_URI } from "@/BASE_URI";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

export default function CreateOrganizationScreen() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);

  const handleCreateOrganization = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Organization name is required");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem(ASYNCKEYS.ACCESS_TOKEN);
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await axios.post(
        `${BASE_URI}/api/organizations`,
        {
          name: formData.name,
          description: formData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Organization created successfully");
        router.replace("/"); // Replace with your home screen route
      } else {
        throw new Error("Failed to create organization");
      }
    } catch (error) {
      console.error("Error creating organization:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to create organization"
      );
    } finally {
      setLoading(false);
    }
  };

  const OutlinedOrganization = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"
        stroke={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
        strokeWidth={2}
      />
      <Path
        d="M3 9h18M9 21V9"
        stroke={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );

  const OutlinedDescription = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
        stroke={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
        stroke={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  return (
    <View className="flex-1 px-8 pt-16 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="items-center mb-10">
        <View className="bg-blue-100 dark:bg-blue-900/30 p-5 rounded-full mb-4">
          <MaterialCommunityIcons
            name="office-building"
            size={40}
            color={colorScheme === "dark" ? "#60A5FA" : "#3B82F6"}
          />
        </View>
        <Text className="text-3xl font-bold text-gray-900 dark:text-white text-center">
          Create Organization
        </Text>
        <Text className="text-lg text-gray-500 dark:text-gray-400 mt-2 text-center">
          Set up your organization to start collecting data
        </Text>
      </View>

      {/* Form */}
      <View className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 shadow-lg shadow-black/10 dark:shadow-black/20">
        {/* Name Field */}
        <View className="mb-6">
          <View className="flex-row items-center border-b border-gray-200 dark:border-gray-600 pb-2">
            <View className="mr-3">
              <OutlinedOrganization />
            </View>
            <TextInput
              placeholder="Organization Name"
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="flex-1 text-gray-900 dark:text-white text-lg"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>
        </View>

        {/* Description Field */}
        <View className="mb-8">
          <View className="flex-row items-center border-b border-gray-200 dark:border-gray-600 pb-2">
            <View className="mr-3">
              <OutlinedDescription />
            </View>
            <TextInput
              placeholder="Description (Optional)"
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              multiline
              numberOfLines={3}
              className="flex-1 text-gray-900 dark:text-white text-lg"
              value={formData.description}
              onChangeText={(text) =>
                setFormData({ ...formData, description: text })
              }
            />
          </View>
        </View>

        {/* Create Button */}
        <TouchableOpacity
          onPress={handleCreateOrganization}
          disabled={loading}
          className={`bg-blue-600 dark:bg-blue-500 py-4 rounded-xl shadow-md shadow-blue-500/20 dark:shadow-blue-900/30 mb-6 ${
            loading ? "opacity-70" : ""
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">
              Create Organization
            </Text>
          )}
        </TouchableOpacity>

        {/* Back Link */}
        <View className="flex-row justify-center">
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-blue-600 dark:text-blue-400 font-medium">
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Decorative Bottom Element */}
      <View className="absolute pointer-events-none bottom-[-21%] left-0 items-center opacity-20 dark:opacity-30">
        {/* Keep your existing SVG decoration */}
      </View>
    </View>
  );
}
