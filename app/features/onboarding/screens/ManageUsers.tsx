import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  FlatList,
} from "react-native";
import {
  MaterialIcons,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { Link } from "expo-router";

const ManageUsersScreen = () => {
  const { colorScheme } = useColorScheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Sample user data
  const users = [
    {
      id: "1",
      name: "Alex Johnson",
      email: "alex.johnson@example.com",
      role: "Admin",
      status: "active",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      lastActive: "2 hours ago",
    },
    {
      id: "2",
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      role: "Project Manager",
      status: "active",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      lastActive: "1 day ago",
    },
    {
      id: "3",
      name: "Michael Chen",
      email: "michael.c@example.com",
      role: "Editor",
      status: "pending",
      avatar: "https://randomuser.me/api/portraits/men/67.jpg",
      lastActive: "Invitation sent",
    },
    {
      id: "4",
      name: "Emma Davis",
      email: "emma.d@example.com",
      role: "Viewer",
      status: "active",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      lastActive: "30 minutes ago",
    },
    {
      id: "5",
      name: "James Wilson",
      email: "james.w@example.com",
      role: "Editor",
      status: "inactive",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg",
      lastActive: "2 weeks ago",
    },
  ];

  // Filter users based on search and active tab
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || user.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const renderUserItem = ({ item }) => (
    <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-3 shadow-sm">
      <View className="flex-row items-center">
        <Image
          source={{ uri: item.avatar }}
          className="w-12 h-12 rounded-full mr-3"
        />
        <View className="flex-1">
          <View className="flex-row justify-between items-center">
            <Text className="font-medium text-gray-900 dark:text-white">
              {item.name}
            </Text>
            <View
              className={`px-2 py-1 rounded-full ${
                item.status === "active"
                  ? "bg-green-100 dark:bg-green-900/30"
                  : item.status === "pending"
                    ? "bg-yellow-100 dark:bg-yellow-900/30"
                    : "bg-gray-100 dark:bg-gray-700"
              }`}
            >
              <Text
                className={`text-xs ${
                  item.status === "active"
                    ? "text-green-800 dark:text-green-400"
                    : item.status === "pending"
                      ? "text-yellow-800 dark:text-yellow-400"
                      : "text-gray-500 dark:text-gray-400"
                }`}
              >
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Text>
            </View>
          </View>
          <Text className="text-gray-500 dark:text-gray-400 text-sm">
            {item.email}
          </Text>
          <View className="flex-row justify-between mt-2">
            <View className="flex-row items-center">
              <MaterialCommunityIcons
                name={
                  item.role === "Admin"
                    ? "shield-account"
                    : item.role === "Project Manager"
                      ? "clipboard-account"
                      : item.role === "Editor"
                        ? "pencil"
                        : "eye"
                }
                size={16}
                color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
              />
              <Text className="text-gray-500 dark:text-gray-400 text-sm ml-1">
                {item.role}
              </Text>
            </View>
            <Text className="text-gray-400 dark:text-gray-500 text-xs">
              {item.lastActive}
            </Text>
          </View>
        </View>
      </View>
      <View className="flex-row gap-2 justify-end mt-3 space-x-2">
        <TouchableOpacity className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
          <Feather
            name="edit-2"
            size={16}
            color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
          />
        </TouchableOpacity>
        <TouchableOpacity className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
          <MaterialIcons
            name="delete-outline"
            size={18}
            color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="bg-white dark:bg-gray-800 px-6 pt-12 pb-6 shadow-sm">
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center">
            <Link href="../">
              <MaterialIcons
                name="arrow-back"
                size={24}
                color={colorScheme === "dark" ? "#FFFFFF" : "#000000"}
              />
            </Link>
            <Text className="ml-4 text-xl font-bold text-gray-900 dark:text-white">
              Manage Users
            </Text>
          </View>
          <TouchableOpacity className="bg-blue-500 p-2 rounded-full">
            <Feather name="user-plus" size={20} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
          <Feather
            name="search"
            size={18}
            color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
          />
          <TextInput
            placeholder="Search users..."
            placeholderTextColor={
              colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
            }
            className="flex-1 ml-2 text-gray-900 dark:text-white"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <MaterialIcons
                name="clear"
                size={18}
                color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="flex-row px-6 mt-4 border-b border-gray-200 dark:border-gray-700">
        <TouchableOpacity
          className={`pb-3 px-4 ${activeTab === "all" ? "border-b-2 border-blue-500" : ""}`}
          onPress={() => setActiveTab("all")}
        >
          <Text
            className={`font-medium ${activeTab === "all" ? "text-blue-500" : "text-gray-500 dark:text-gray-400"}`}
          >
            All Users
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`pb-3 px-4 ${activeTab === "active" ? "border-b-2 border-blue-500" : ""}`}
          onPress={() => setActiveTab("active")}
        >
          <Text
            className={`font-medium ${activeTab === "active" ? "text-blue-500" : "text-gray-500 dark:text-gray-400"}`}
          >
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`pb-3 px-4 ${activeTab === "pending" ? "border-b-2 border-blue-500" : ""}`}
          onPress={() => setActiveTab("pending")}
        >
          <Text
            className={`font-medium ${activeTab === "pending" ? "text-blue-500" : "text-gray-500 dark:text-gray-400"}`}
          >
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`pb-3 px-4 ${activeTab === "inactive" ? "border-b-2 border-blue-500" : ""}`}
          onPress={() => setActiveTab("inactive")}
        >
          <Text
            className={`font-medium ${activeTab === "inactive" ? "text-blue-500" : "text-gray-500 dark:text-gray-400"}`}
          >
            Inactive
          </Text>
        </TouchableOpacity>
      </View>

      {/* User Count */}
      <View className="px-6 py-4">
        <Text className="text-gray-500 dark:text-gray-400">
          {filteredUsers.length} {filteredUsers.length === 1 ? "user" : "users"}{" "}
          found
        </Text>
      </View>

      {/* User List */}
      <View className="px-6 pb-10">
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ListEmptyComponent={
            <View className="items-center justify-center py-10">
              <Ionicons
                name="people-outline"
                size={48}
                color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
              />
              <Text className="mt-4 text-gray-500 dark:text-gray-400">
                No users found
              </Text>
            </View>
          }
        />
      </View>
    </ScrollView>
  );
};

export default ManageUsersScreen;
