import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ProjectsList = () => {
  const { colorScheme } = useColorScheme();
  const textColor = colorScheme === "dark" ? "white" : "black";
  const cardBg = colorScheme === "dark" ? "bg-gray-800" : "bg-white";
  const borderColor =
    colorScheme === "dark" ? "border-gray-700" : "border-gray-200";
  const inputBg = colorScheme === "dark" ? "bg-gray-700" : "bg-gray-100";

  // Sample projects data
  const [projects, setProjects] = useState([
    {
      id: "1",
      name: "Urban Food Initiative",
      description: "Providing meals to low-income families in urban areas",
      status: "Active",
      country: "Kenya",
      startDate: "2023-01-15",
      mealsServed: 12500,
      funding: 75000,
    },
    {
      id: "2",
      name: "Rural Nutrition Program",
      description: "Nutrition support for children in rural villages",
      status: "Active",
      country: "Ethiopia",
      startDate: "2023-03-10",
      mealsServed: 8200,
      funding: 45000,
    },
    {
      id: "3",
      name: "Emergency Relief Somalia",
      description: "Food distribution in drought-affected regions",
      status: "Completed",
      country: "Somalia",
      startDate: "2022-11-05",
      mealsServed: 18500,
      funding: 120000,
    },
    {
      id: "4",
      name: "School Feeding Program",
      description: "Daily meals for primary school children",
      status: "Planning",
      country: "Uganda",
      startDate: "2023-06-01",
      mealsServed: 0,
      funding: 30000,
    },
  ]);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [sortOption, setSortOption] = useState("Newest");

  // Get unique countries for filter
  const countries = ["All", ...new Set(projects.map((p) => p.country))];
  const statuses = ["All", "Active", "Completed", "Planning"];

  // Filter and sort projects
  const filteredProjects = projects
    .filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || project.status === statusFilter;
      const matchesCountry =
        countryFilter === "All" || project.country === countryFilter;
      return matchesSearch && matchesStatus && matchesCountry;
    })
    .sort((a, b) => {
      if (sortOption === "Newest")
        return new Date(b.startDate) - new Date(a.startDate);
      if (sortOption === "Oldest")
        return new Date(a.startDate) - new Date(b.startDate);
      if (sortOption === "Most Meals") return b.mealsServed - a.mealsServed;
      if (sortOption === "Most Funding") return b.funding - a.funding;
      return 0;
    });

  // Status badge component
  const StatusBadge = ({ status }) => {
    let bgColor = "bg-gray-100";
    let textColor = "text-gray-800";

    if (status === "Active") {
      bgColor = "bg-green-100 dark:bg-green-900/30";
      textColor = "text-green-800 dark:text-green-400";
    } else if (status === "Completed") {
      bgColor = "bg-blue-100 dark:bg-blue-900/30";
      textColor = "text-blue-800 dark:text-blue-400";
    } else if (status === "Planning") {
      bgColor = "bg-yellow-100 dark:bg-yellow-900/30";
      textColor = "text-yellow-800 dark:text-yellow-400";
    }

    return (
      <View className={`px-2 py-1 rounded-full ${bgColor}`}>
        <Text className={`text-xs font-medium ${textColor}`}>{status}</Text>
      </View>
    );
  };

  return (
    <View className="flex-1 pt-10 bg-white dark:bg-gray-900">
      {/* Filter Controls */}
      <View className={`p-4 ${cardBg} border-b ${borderColor}`}>
        {/* Search Bar */}
        <View
          className={`flex-row items-center ${inputBg} rounded-lg px-3 py-2 mb-3`}
        >
          <MaterialCommunityIcons
            name="magnify"
            size={20}
            color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
          />
          <TextInput
            placeholder="Search projects..."
            placeholderTextColor={
              colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
            }
            className={`flex-1 ml-2 text-${textColor}`}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <MaterialCommunityIcons
                name="close-circle"
                size={20}
                color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-3"
        >
          <TouchableOpacity
            onPress={() => setStatusFilter("All")}
            className={`px-3 py-1 rounded-full mr-2 ${statusFilter === "All" ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-gray-700"}`}
          >
            <Text
              className={`text-sm ${statusFilter === "All" ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"}`}
            >
              All Statuses
            </Text>
          </TouchableOpacity>

          {statuses
            .filter((s) => s !== "All")
            .map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-full mr-2 ${statusFilter === status ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-gray-700"}`}
              >
                <Text
                  className={`text-sm ${statusFilter === status ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"}`}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>

        {/* Country Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-3"
        >
          {countries.map((country) => (
            <TouchableOpacity
              key={country}
              onPress={() => setCountryFilter(country)}
              className={`px-3 py-1 rounded-full mr-2 ${countryFilter === country ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-gray-700"}`}
            >
              <Text
                className={`text-sm ${countryFilter === country ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"}`}
              >
                {country}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Sort Options */}
        <View className="flex-row items-center">
          <Text className={`text-sm mr-2 text-${textColor}`}>Sort by:</Text>
          <TouchableOpacity
            onPress={() => setSortOption("Newest")}
            className={`px-3 py-1 rounded-full mr-2 ${sortOption === "Newest" ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-gray-700"}`}
          >
            <Text
              className={`text-sm ${sortOption === "Newest" ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"}`}
            >
              Newest
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSortOption("Oldest")}
            className={`px-3 py-1 rounded-full mr-2 ${sortOption === "Oldest" ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-gray-700"}`}
          >
            <Text
              className={`text-sm ${sortOption === "Oldest" ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"}`}
            >
              Oldest
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSortOption("Most Meals")}
            className={`px-3 py-1 rounded-full mr-2 ${sortOption === "Most Meals" ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-gray-700"}`}
          >
            <Text
              className={`text-sm ${sortOption === "Most Meals" ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"}`}
            >
              Most Meals
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSortOption("Most Funding")}
            className={`px-3 py-1 rounded-full ${sortOption === "Most Funding" ? "bg-blue-100 dark:bg-blue-900/30" : "bg-gray-100 dark:bg-gray-700"}`}
          >
            <Text
              className={`text-sm ${sortOption === "Most Funding" ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"}`}
            >
              Most Funding
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Projects List */}
      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-10">
            <MaterialCommunityIcons
              name="folder-alert-outline"
              size={40}
              color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
            />
            <Text className={`mt-2 text-lg text-${textColor}`}>
              No projects found
            </Text>
            <Text
              className={`text-center text-gray-500 dark:text-gray-400 mt-1`}
            >
              Try adjusting your filters or create a new project
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            className={`mb-4 p-4 rounded-xl ${cardBg} shadow-sm border ${borderColor}`}
          >
            <View className="flex-row justify-between items-start mb-2">
              <Text className={`text-lg font-bold text-${textColor} flex-1`}>
                {item.name}
              </Text>
              <StatusBadge status={item.status} />
            </View>

            <Text className={`text-gray-600 dark:text-gray-300 mb-3`}>
              {item.description}
            </Text>

            <View className="flex-row justify-between mb-2">
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="earth"
                  size={16}
                  color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
                />
                <Text
                  className={`ml-1 text-sm text-gray-600 dark:text-gray-300`}
                >
                  {item.country}
                </Text>
              </View>
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="calendar"
                  size={16}
                  color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
                />
                <Text
                  className={`ml-1 text-sm text-gray-600 dark:text-gray-300`}
                >
                  {new Date(item.startDate).toLocaleDateString()}
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
              <View>
                <Text className={`text-xs text-gray-500 dark:text-gray-400`}>
                  Meals served
                </Text>
                <Text className={`text-sm font-medium text-${textColor}`}>
                  {item.mealsServed.toLocaleString()}
                </Text>
              </View>
              <View>
                <Text className={`text-xs text-gray-500 dark:text-gray-400`}>
                  Funding
                </Text>
                <Text className={`text-sm font-medium text-${textColor}`}>
                  ${item.funding.toLocaleString()}
                </Text>
              </View>
              <TouchableOpacity className="flex-row items-center">
                <Text
                  className={`text-blue-600 dark:text-blue-400 text-sm mr-1`}
                >
                  View Details
                </Text>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={16}
                  color={colorScheme === "dark" ? "#60A5FA" : "#3B82F6"}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Create New Project Button */}
      <TouchableOpacity
        className={`absolute bottom-6 right-6 bg-blue-600 dark:bg-blue-500 p-4 rounded-full shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30`}
      >
        <MaterialCommunityIcons name="plus" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default ProjectsList;
