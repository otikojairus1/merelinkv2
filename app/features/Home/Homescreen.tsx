import { MaterialCommunityIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link, router } from "expo-router";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();
  const [currentOrg, setCurrentOrg] = useState("Acme Corp");
  const [showOrgSwitcher, setShowOrgSwitcher] = useState(false);

  // Sample data
  const recentProjects = [
    {
      id: "1",
      name: "Customer Feedback Q3",
      progress: 78,
      lastUpdated: "2h ago",
    },
    {
      id: "2",
      name: "Product Usage Survey",
      progress: 45,
      lastUpdated: "1d ago",
    },
    {
      id: "3",
      name: "Employee Satisfaction",
      progress: 92,
      lastUpdated: "3d ago",
    },
  ];

  const recentSubmissions = [
    {
      id: "1",
      project: "Customer Feedback",
      user: "John D.",
      time: "10:42 AM",
      status: "Complete",
    },
    {
      id: "2",
      project: "Product Survey",
      user: "Sarah K.",
      time: "Yesterday",
      status: "Partial",
    },
    {
      id: "3",
      project: "Market Research",
      user: "Alex M.",
      time: "2 days ago",
      status: "Complete",
    },
  ];

  const organizations = [
    { id: "1", name: "Acme Corp", role: "Admin" },
    { id: "2", name: "Beta Analytics", role: "Member" },
    { id: "3", name: "Gamma Labs", role: "Viewer" },
  ];

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="px-6 pt-12 pb-4 bg-white dark:bg-gray-800 shadow-sm">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              Current Organization
            </Text>
            <TouchableOpacity
              onPress={() => setShowOrgSwitcher(!showOrgSwitcher)}
              className="flex-row items-center"
            >
              <Text className="text-xl font-bold text-gray-900 dark:text-white mr-2">
                {currentOrg}
              </Text>
              <MaterialCommunityIcons
                name={showOrgSwitcher ? "chevron-up" : "chevron-down"}
                size={24}
                color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => {}}>
            <AntDesign
              name="user"
              size={24}
              color={colorScheme === "dark" ? "#FBBF24" : "#6B7280"}
            />
          </TouchableOpacity>
        </View>

        {/* Organization Switcher */}
        {showOrgSwitcher && (
          <View className="mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <Text className="font-medium text-gray-900 dark:text-white mb-2">
              Your Organizations
            </Text>
            {organizations.map((org) => (
              <TouchableOpacity
                key={org.id}
                onPress={() => {
                  setCurrentOrg(org.name);
                  setShowOrgSwitcher(false);
                }}
                className={`py-3 px-2 rounded-md ${currentOrg === org.name ? "bg-blue-100 dark:bg-blue-900/30" : ""}`}
              >
                <View className="flex-row justify-between items-center">
                  <Text
                    className={`font-medium ${currentOrg === org.name ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}
                  >
                    {org.name}
                  </Text>
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    {org.role}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity className="flex-row items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
              <MaterialCommunityIcons
                name="plus-circle-outline"
                size={20}
                color={colorScheme === "dark" ? "#60A5FA" : "#3B82F6"}
              />
              <Text className="ml-2 text-blue-600 dark:text-blue-400 font-medium">
                Create New Organization
              </Text>
            </TouchableOpacity>

            <Link
              href="/features/onboarding/OrganizationInvite"
              className="flex-row items-center mt-2"
            >
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color={colorScheme === "dark" ? "#60A5FA" : "#3B82F6"}
              />
              <Text className="ml-2 text-blue-600 dark:text-blue-400 font-medium">
                Invite Team Members
              </Text>
            </Link>
          </View>
        )}
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 px-6 pt-6">
        {/* Quick Actions */}
        <View className="flex-row justify-between mb-8">
          <TouchableOpacity className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm w-[48%] items-center">
            <View className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mb-2">
              <MaterialCommunityIcons
                name="plus-circle"
                size={24}
                color={colorScheme === "dark" ? "#60A5FA" : "#3B82F6"}
              />
            </View>
            <Text className="font-medium text-gray-900 dark:text-white">
              New Project
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              router.push("/features/Home/Analytics");
            }}
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm w-[48%] items-center"
          >
            <View className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mb-2">
              <MaterialCommunityIcons
                name="chart-bar"
                size={24}
                color={colorScheme === "dark" ? "#34D399" : "#10B981"}
              />
            </View>
            <Text className="font-medium text-gray-900 dark:text-white">
              View Analytics
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Projects Section */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Projects
            </Text>
            <TouchableOpacity
              onPress={() => {
                router.push("/features/Home/ProjectList");
              }}
            >
              <Text className="text-blue-600 dark:text-blue-400">View All</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            {recentProjects.map((project) => (
              <TouchableOpacity
                onPress={() => {
                  // Navigate to project details
                  router.push(`/features/Home/Analytics`);
                }}
                key={project.id}
                className="py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
              >
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="font-medium text-gray-900 dark:text-white">
                    {project.name}
                  </Text>
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    {project.lastUpdated}
                  </Text>
                </View>
                <View className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mt-2">
                  <View
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  />
                </View>
                <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {project.progress}% complete
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Submissions Section */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Submissions
            </Text>
            <TouchableOpacity>
              <Text className="text-blue-600 dark:text-blue-400">View All</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
            <FlatList
              data={recentSubmissions}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <View className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex-row justify-between items-center">
                  <View>
                    <Text className="font-medium text-gray-900 dark:text-white">
                      {item.project}
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                      {item.user} • {item.time}
                    </Text>
                  </View>
                  <View
                    className={`px-2 py-1 rounded-full ${item.status === "Complete" ? "bg-green-100 dark:bg-green-900/30" : "bg-yellow-100 dark:bg-yellow-900/30"}`}
                  >
                    <Text
                      className={`text-xs font-medium ${item.status === "Complete" ? "text-green-800 dark:text-green-400" : "text-yellow-800 dark:text-yellow-400"}`}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>
              )}
            />
          </View>
        </View>

        {/* Team Activity Section */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Team Activity
          </Text>

          <View className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <View className="flex-row items-start mb-4">
              <View className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-full mr-3">
                <MaterialCommunityIcons
                  name="account-plus"
                  size={20}
                  color={colorScheme === "dark" ? "#A78BFA" : "#8B5CF6"}
                />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-gray-900 dark:text-white">
                  New member joined
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  Sarah K. accepted your invitation
                </Text>
                <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  3 hours ago
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                <MaterialCommunityIcons
                  name="file-export"
                  size={20}
                  color={colorScheme === "dark" ? "#60A5FA" : "#3B82F6"}
                />
              </View>
              <View className="flex-1">
                <Text className="font-medium text-gray-900 dark:text-white">
                  Data exported
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  Alex M. exported Customer Feedback results
                </Text>
                <Text className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  1 day ago
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
