import { ASYNCKEYS, BASE_URI } from "@/BASE_URI";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ProjectsSection from "../onboarding/components/ProjectSectionHomescreen";

interface Organization {
  id: number;
  name: string;
  description: string;
  owner_id: number;
  created_at: string;
  updated_at: string;
  role?: string;
  pivot?: {
    user_id: number;
    organization_id: number;
    role: string;
    invited_at: string;
    joined_at: string | null;
    invitation_token: string;
    created_at: string;
    updated_at: string;
  };
}

interface Project {
  id: string;
  name: string;
  progress: number;
  lastUpdated: string;
}

interface Submission {
  id: string;
  project: string;
  user: string;
  time: string;
  status: "Complete" | "Partial";
}

export default function HomeScreen() {
  const { colorScheme } = useColorScheme();
  const [currentOrg, setCurrentOrg] = useState<Organization | null>(null);
  const [showOrgSwitcher, setShowOrgSwitcher] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Sample data
  const recentProjects: Project[] = [
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

  const recentSubmissions: Submission[] = [
    // {
    //   id: "1",
    //   project: "Customer Feedback",
    //   user: "John D.",
    //   time: "10:42 AM",
    //   status: "Complete",
    // },
    // {
    //   id: "2",
    //   project: "Product Survey",
    //   user: "Sarah K.",
    //   time: "Yesterday",
    //   status: "Partial",
    // },
    // {
    //   id: "3",
    //   project: "Market Research",
    //   user: "Alex M.",
    //   time: "2 days ago",
    //   status: "Complete",
    // },
  ];

  const fetchOrganizations = async () => {
    let token = await AsyncStorage.getItem(ASYNCKEYS.ACCESS_TOKEN);
    try {
      const response = await axios.get(`${BASE_URI}/api/organizations`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (response.status !== 200) {
        throw new Error("Failed to fetch organizations");
      }

      const data = response.data;

      const allOrgs: Organization[] = [
        ...data.owned_organizations.map((org: Organization) => ({
          ...org,
          role: "owner",
        })),
        ...data.member_organizations.map((org: Organization) => ({
          ...org,
          role: org.pivot?.role || "member",
        })),
      ];

      setOrganizations(allOrgs);

      // if (allOrgs.length === 0) {
      //   router.replace("/features/onboarding/createOrganization");
      //   return;
      // }

      // Set the first organization as current if available
      if (allOrgs.length > 0 && !currentOrg) {
        setCurrentOrg(allOrgs[0]);
      }

      setError(null);
    } catch (err) {
      if (err.message === "Request failed with status code 401") {
        router.replace("/features/onboarding/Login");
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrganizations();
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
        <ActivityIndicator
          size="large"
          color={colorScheme === "dark" ? "#ffffff" : "#000000"}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Text className="text-red-500 dark:text-red-400 mb-4">{error}</Text>
        <TouchableOpacity
          onPress={fetchOrganizations}
          className="px-4 py-2 bg-blue-500 rounded-lg"
        >
          <Text className="text-white">Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
              onPress={() =>
                organizations.length > 0 && setShowOrgSwitcher(!showOrgSwitcher)
              }
              className="flex-row items-center"
            >
              <Text className="text-xl font-bold text-gray-900 dark:text-white mr-2">
                {currentOrg?.name || "No organization selected"}
              </Text>
              {organizations.length > 0 && (
                <MaterialCommunityIcons
                  name={showOrgSwitcher ? "chevron-up" : "chevron-down"}
                  size={24}
                  color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
                />
              )}
            </TouchableOpacity>
          </View>
          <View className="flex-row gap-5">
            <TouchableOpacity
              onPress={() =>
                router.push("/features/onboarding/screens/OrganizationInvites")
              }
            >
              <AntDesign
                name="bells"
                size={20}
                color={colorScheme === "dark" ? "#FBBF24" : "#6B7280"}
              />
            </TouchableOpacity>

            {/* <TouchableOpacity
              onPress={
                () => {}
                // router.push("/features/onboarding/screens/Profile")
              }
            >
              <AntDesign
                name="user"
                size={20}
                color={colorScheme === "dark" ? "#FBBF24" : "#6B7280"}
              />
            </TouchableOpacity> */}
          </View>
        </View>

        {/* Organization Switcher */}
        {showOrgSwitcher && (
          <View className="mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <Text className="font-medium text-gray-900 dark:text-white mb-2">
              Your Organizations
            </Text>

            {organizations.length === 0 ? (
              <Text className="text-gray-500 dark:text-gray-400 py-3">
                You don't belong to any organizations yet
              </Text>
            ) : (
              organizations.map((org) => (
                <TouchableOpacity
                  key={org.id}
                  onPress={() => {
                    setCurrentOrg(org);
                    AsyncStorage.setItem(
                      ASYNCKEYS.CURRENT_ORGANIZATION,
                      JSON.stringify(org)
                    );
                    setShowOrgSwitcher(false);
                  }}
                  className={`py-3 px-2 rounded-md ${currentOrg?.id === org.id ? "bg-blue-100 dark:bg-blue-900/30" : ""}`}
                >
                  <View className="flex-row justify-between items-center">
                    <Text
                      className={`font-medium ${currentOrg?.id === org.id ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"}`}
                    >
                      {org.name}
                    </Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400">
                      {org.role === "owner" ? "Owner" : org.role}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}

            <TouchableOpacity
              onPress={() =>
                router.push("/features/onboarding/createOrganization")
              }
              className="flex-row items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-600"
            >
              <MaterialCommunityIcons
                name="plus-circle-outline"
                size={20}
                color={colorScheme === "dark" ? "#60A5FA" : "#3B82F6"}
              />
              <Text className="ml-2 text-blue-600 dark:text-blue-400 font-medium">
                Create New Organization
              </Text>
            </TouchableOpacity>

            {currentOrg && (
              <TouchableOpacity
                onPress={() =>
                  router.push("/features/onboarding/OrganizationInvite")
                }
                className="flex-row items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-600"
              >
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color={colorScheme === "dark" ? "#60A5FA" : "#3B82F6"}
                />
                <Text className="ml-2 text-blue-600 dark:text-blue-400 font-medium">
                  Invite Team Members
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Main Content */}
      <ScrollView
        className="flex-1 px-6 pt-6"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            // colors={[colorScheme === "dark" ? "#ffffff" : "#000000"]}
          />
        }
      >
        {/* Quick Actions */}
        <View className="flex-row justify-between mb-8">
          <TouchableOpacity
            className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm w-[48%] items-center"
            onPress={() =>
              router.push("/features/onboarding/screens/AddProjects")
            }
          >
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
            onPress={() => router.push("/features/onboarding/screens/ProjectDistribution")}
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
              Add Distribution
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
              onPress={() => router.push("/features/Home/ProjectList")}
            >
              <Text className="text-blue-600 dark:text-blue-400">View All</Text>
            </TouchableOpacity>
          </View>
          <ProjectsSection refreshSync={refreshing} />
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
            {/* <FlatList
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
            /> */}
            {recentSubmissions.length > 0 ? (
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
            ) : (
              <View className="py-8 px-4 items-center justify-center">
                <View className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-3">
                  <FontAwesome5
                    name="wpforms"
                    size={24}
                    color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
                  />
                </View>
                <Text className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-1">
                  No Submissions Yet
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
                  When students submit their work, it will appear here
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Team Activity Section */}
        {currentOrg && (
          <View className="mb-8">
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Team Activity
            </Text>

            {/* <View className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
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
            </View> */}
            <View className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
              <View className="flex items-center justify-center py-8">
                <View className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
                  <MaterialCommunityIcons
                    name="bell-outline"
                    size={24}
                    color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
                  />
                </View>
                <Text className="font-medium text-gray-900 dark:text-white text-center mb-1">
                  No notifications yet
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  When you get notifications, they'll appear here
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
