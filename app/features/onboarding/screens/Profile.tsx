import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import {
  Image,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    weeklyReports: false,
    projectAlerts: true,
    budgetWarnings: true,
  });

  const toggleSwitch = (key: keyof typeof notifications) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
  };

  const user = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    role: "Project Manager",
    organization: "Green Earth Initiative",
    joinDate: "Joined March 2022",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  };

  const orgDetails = {
    name: "Green Earth Initiative",
    type: "Environmental Non-Profit",
    members: 24,
    projects: 8,
    location: "San Francisco, CA",
    website: "www.greenearth.org",
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="items-center pt-10 pb-6 bg-white dark:bg-gray-800 shadow-sm">
        <View className="relative mb-4">
          <Image
            source={{ uri: user.avatar }}
            className="w-24 h-24 rounded-full"
          />
          <TouchableOpacity className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full">
            <Feather name="edit-2" size={16} color="white" />
          </TouchableOpacity>
        </View>
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          {user.name}
        </Text>
        <Text className="text-gray-500 dark:text-gray-400">{user.role}</Text>
        <Text className="text-gray-500 dark:text-gray-400 mt-1">
          {user.organization}
        </Text>
      </View>

      {/* Organization Section */}
      <View className="mx-4 my-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <View className="flex-row items-center mb-4">
          <MaterialCommunityIcons
            name="office-building"
            size={24}
            color={colorScheme === "dark" ? "#60A5FA" : "#3B82F6"}
          />
          <Text className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
            Organization Information
          </Text>
        </View>

        <View className="space-y-8 gap-5">
          <View className="flex-row justify-between">
            <Text className="text-gray-500 dark:text-gray-400">Name</Text>
            <Text className="text-gray-900 dark:text-white">
              {orgDetails.name}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-500 dark:text-gray-400">Type</Text>
            <Text className="text-gray-900 dark:text-white">
              {orgDetails.type}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-500 dark:text-gray-400">Members</Text>
            <Text className="text-gray-900 dark:text-white">
              {orgDetails.members}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-500 dark:text-gray-400">
              Active Projects
            </Text>
            <Text className="text-gray-900 dark:text-white">
              {orgDetails.projects}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-500 dark:text-gray-400">Location</Text>
            <Text className="text-gray-900 dark:text-white">
              {orgDetails.location}
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-500 dark:text-gray-400">Website</Text>
            <Text className="text-blue-500 dark:text-blue-400">
              {orgDetails.website}
            </Text>
          </View>
        </View>
      </View>

      {/* Notification Preferences */}
      <View className="mx-4 my-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <View className="flex-row items-center mb-4">
          <Ionicons
            name="notifications-outline"
            size={24}
            color={colorScheme === "dark" ? "#60A5FA" : "#3B82F6"}
          />
          <Text className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
            Notification Preferences
          </Text>
        </View>

        <View className="space-y-6">
          {/* Email Notifications */}
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-gray-900 dark:text-white font-medium">
                Email Notifications
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                Receive updates via email
              </Text>
            </View>
            <Switch
              value={notifications.email}
              onValueChange={() => toggleSwitch("email")}
              trackColor={{ false: "#E5E7EB", true: "#3B82F6" }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Push Notifications */}
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-gray-900 dark:text-white font-medium">
                Push Notifications
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                Browser and mobile push notifications
              </Text>
            </View>
            <Switch
              value={notifications.push}
              onValueChange={() => toggleSwitch("push")}
              trackColor={{ false: "#E5E7EB", true: "#3B82F6" }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Weekly Reports */}
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-gray-900 dark:text-white font-medium">
                Weekly Reports
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                Automated weekly summary reports
              </Text>
            </View>
            <Switch
              value={notifications.weeklyReports}
              onValueChange={() => toggleSwitch("weeklyReports")}
              trackColor={{ false: "#E5E7EB", true: "#3B82F6" }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Project Alerts */}
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-gray-900 dark:text-white font-medium">
                Project Alerts
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                Important project updates and deadlines
              </Text>
            </View>
            <Switch
              value={notifications.projectAlerts}
              onValueChange={() => toggleSwitch("projectAlerts")}
              trackColor={{ false: "#E5E7EB", true: "#3B82F6" }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Budget Warnings */}
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-gray-900 dark:text-white font-medium">
                Budget Warnings
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                Alerts when approaching budget limits
              </Text>
            </View>
            <Switch
              value={notifications.budgetWarnings}
              onValueChange={() => toggleSwitch("budgetWarnings")}
              trackColor={{ false: "#E5E7EB", true: "#3B82F6" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="mx-4 my-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm mb-10">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </Text>

        <View className="space-y-4">
          <TouchableOpacity className="flex-row items-center py-3">
            <MaterialIcons
              name="people-outline"
              size={24}
              color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
            />
            <Text className="ml-3 text-gray-900 dark:text-white">
              Manage Users
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-3">
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
            />
            <Text className="ml-3 text-gray-900 dark:text-white">
              Notification Settings
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-3">
            <MaterialCommunityIcons
              name="translate"
              size={24}
              color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
            />
            <Text className="ml-3 text-gray-900 dark:text-white">
              Language & Region
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-3">
            <Feather
              name="smartphone"
              size={24}
              color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
            />
            <Text className="ml-3 text-gray-900 dark:text-white">
              Mobile Sync
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center py-3">
            <MaterialIcons
              name="logout"
              size={24}
              color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
            />
            <Text className="ml-3 text-gray-900 dark:text-white">Sign Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
