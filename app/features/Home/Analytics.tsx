import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useColorScheme } from "nativewind";
import { useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-gifted-charts";

const AnalyticsScreen = () => {
  const { colorScheme } = useColorScheme();
  const textColor = colorScheme === "dark" ? "white" : "black";
  const cardBg = colorScheme === "dark" ? "bg-gray-800" : "bg-white";
  const gridColor = colorScheme === "dark" ? "#374151" : "#E5E7EB";

  // Sample data - replace with your API data
  const foodDistributionData = [
    { value: 5000, label: "Jan", frontColor: "#3B82F6" },
    { value: 8000, label: "Feb", frontColor: "#3B82F6" },
    { value: 12000, label: "Mar", frontColor: "#3B82F6" },
    { value: 10000, label: "Apr", frontColor: "#3B82F6" },
    { value: 15000, label: "May", frontColor: "#3B82F6" },
    { value: 18000, label: "Jun", frontColor: "#3B82F6" },
  ];

  const foodByCountryData = [
    { value: 12000, color: "#3B82F6", text: "Kenya" },
    { value: 8000, color: "#10B981", text: "Somalia" },
    { value: 15000, color: "#F59E0B", text: "Ethiopia" },
    { value: 6000, color: "#EF4444", text: "Uganda" },
  ];

  const mealsServedData = [
    { value: 25000, dataPointText: "25k", label: "Jan", frontColor: "#F59E0B" },
    { value: 32000, dataPointText: "32k", label: "Feb", frontColor: "#F59E0B" },
    { value: 40000, dataPointText: "40k", label: "Mar", frontColor: "#F59E0B" },
    { value: 38000, dataPointText: "38k", label: "Apr", frontColor: "#F59E0B" },
    { value: 45000, dataPointText: "45k", label: "May", frontColor: "#F59E0B" },
    { value: 52000, dataPointText: "52k", label: "Jun", frontColor: "#F59E0B" },
  ];

  const fundingData = [
    {
      value: 25000,
      label: "Jan",
      dataPointText: "$25k",
      dataPointColor: "#10B981",
    },
    {
      value: 32000,
      label: "Feb",
      dataPointText: "$32k",
      dataPointColor: "#10B981",
    },
    {
      value: 40000,
      label: "Mar",
      dataPointText: "$40k",
      dataPointColor: "#10B981",
    },
    {
      value: 38000,
      label: "Apr",
      dataPointText: "$38k",
      dataPointColor: "#10B981",
    },
    {
      value: 45000,
      label: "May",
      dataPointText: "$45k",
      dataPointColor: "#10B981",
    },
    {
      value: 52000,
      label: "Jun",
      dataPointText: "$52k",
      dataPointColor: "#10B981",
    },
  ];

  const fundingSourcesData = [
    { value: 120000, color: "#3B82F6", text: "UN" },
    { value: 80000, color: "#10B981", text: "USAID" },
    { value: 50000, color: "#F59E0B", text: "Private" },
    { value: 30000, color: "#EF4444", text: "Local" },
  ];
  const sampleProject = {
    id: "1",
    name: "Urban Food Initiative",
    description: "Providing meals to low-income families in urban areas",
    totalMeals: 12500,
    familiesReached: 3200,
    funding: 75000,
  };

  const handleFilterChange = (filters) => {
    console.log("Filters changed:", filters);
    // Implement your filtering logic here
  };

  const renderTitle = (iconName, title) => (
    <View className="flex-row items-center mb-4">
      <MaterialCommunityIcons
        name={iconName}
        size={24}
        color={
          colorScheme === "dark"
            ? iconName === "chart-line"
              ? "#60A5FA"
              : iconName === "earth"
                ? "#10B981"
                : iconName === "food"
                  ? "#F59E0B"
                  : iconName === "account-group"
                    ? "#8B5CF6"
                    : iconName === "cash-multiple"
                      ? "#10B981"
                      : "#EF4444"
            : iconName === "chart-line"
              ? "#3B82F6"
              : iconName === "earth"
                ? "#10B981"
                : iconName === "food"
                  ? "#F59E0B"
                  : iconName === "account-group"
                    ? "#8B5CF6"
                    : iconName === "cash-multiple"
                      ? "#10B981"
                      : "#EF4444"
        }
        className="mr-2"
      />
      <Text className={`text-lg font-bold text-${textColor}`}>{title}</Text>
    </View>
  );

  return (
    <ScrollView className="flex-1 p-4 bg-gray-50 dark:bg-gray-900">
      <ProjectSummaryCard
        project={sampleProject}
        onFilterChange={handleFilterChange}
      />

      {/* Food Distribution Over Time */}
      <View className={`mb-6 p-4 rounded-xl ${cardBg} shadow-sm`}>
        {renderTitle("chart-line", "Food Distribution Over Time")}
        <BarChart
          data={foodDistributionData}
          barWidth={22}
          spacing={24}
          roundedTop
          roundedBottom={false}
          xAxisThickness={1}
          yAxisThickness={1}
          yAxisTextStyle={{ color: textColor }}
          xAxisLabelTextStyle={{ color: textColor }}
          noOfSections={5}
          maxValue={20000}
          isAnimated
          showReferenceLine1
          referenceLine1Position={15000}
          referenceLine1Config={{
            color: "gray",
            dashWidth: 2,
            dashGap: 3,
          }}
        />
      </View>

      {/* Food Distribution by Country */}
      <View className={`mb-6 p-4 rounded-xl ${cardBg} shadow-sm`}>
        {renderTitle("earth", "Food Distribution by Country")}
        <View className="items-center">
          <PieChart
            data={foodByCountryData}
            donut
            showGradient
            sectionAutoFocus
            radius={90}
            innerRadius={60}
            innerCircleColor={cardBg === "bg-white" ? "white" : "#1F2937"}
            centerLabelComponent={() => (
              <View className="items-center">
                <Text className={`text-lg font-bold text-${textColor}`}>
                  Total
                </Text>
                <Text className={`text-xl font-bold text-${textColor}`}>
                  {foodByCountryData
                    .reduce((sum, item) => sum + item.value, 0)
                    .toLocaleString()}
                </Text>
              </View>
            )}
          />
          <View className="flex-row flex-wrap justify-center mt-4">
            {foodByCountryData.map((item, index) => (
              <View key={index} className="flex-row items-center mx-2 mb-2">
                <View
                  style={{ backgroundColor: item.color }}
                  className="w-3 h-3 rounded-full mr-1"
                />
                <Text className={`text-sm text-${textColor}`}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Meals Served Over Time */}
      <View className={`mb-6 p-4 rounded-xl ${cardBg} shadow-sm`}>
        {renderTitle("food", "Meals Served Over Time")}
        <LineChart
          data={mealsServedData}
          areaChart
          curved
          startFillColor="#F59E0B"
          startOpacity={0.4}
          endFillColor="#F59E0B"
          endOpacity={0.1}
          spacing={60}
          initialSpacing={10}
          color="#F59E0B"
          thickness={3}
          yAxisTextStyle={{ color: textColor }}
          xAxisLabelTextStyle={{ color: textColor }}
          hideDataPoints
          showVerticalLines
          verticalLinesColor={gridColor}
          yAxisOffset={10000}
          noOfSections={5}
          maxValue={60000}
          yAxisLabelPrefix=""
          yAxisLabelSuffix=""
          rulesType="solid"
          rulesColor={gridColor}
        />
      </View>

      {/* Monthly Funding Received */}
      <View className={`mb-6 p-4 rounded-xl ${cardBg} shadow-sm`}>
        {renderTitle("cash-multiple", "Monthly Funding Received ($)")}
        <LineChart
          data={fundingData}
          curved
          isAnimated
          animationDuration={1200}
          color="#10B981"
          thickness={3}
          yAxisTextStyle={{ color: textColor }}
          xAxisLabelTextStyle={{ color: textColor }}
          dataPointsColor="#10B981"
          dataPointsRadius={6}
          yAxisOffset={10000}
          noOfSections={5}
          maxValue={60000}
          rulesType="solid"
          rulesColor={gridColor}
        />
      </View>

      {/* Funding Source Distribution */}
      <View className={`mb-6 p-4 rounded-xl ${cardBg} shadow-sm`}>
        {renderTitle("chart-pie", "Funding Source Distribution ($)")}
        <View className="flex-row">
          <View className="flex-1 items-center">
            <PieChart
              data={fundingSourcesData}
              radius={80}
              focusOnPress
              showText
              textColor="white"
              textSize={12}
            />
          </View>
          <View className="flex-1 justify-center">
            {fundingSourcesData.map((item, index) => (
              <View key={index} className="flex-row items-center mb-2">
                <View
                  style={{ backgroundColor: item.color }}
                  className="w-3 h-3 rounded-full mr-2"
                />
                <Text className={`text-sm text-${textColor}`}>
                  {item.text}:{" "}
                </Text>
                <Text className={`text-sm font-medium text-${textColor}`}>
                  ${(item.value / 1000).toFixed(0)}k
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

//
const ProjectSummaryCard = ({ project, onFilterChange }) => {
  const { colorScheme } = useColorScheme();
  const textColor = colorScheme === "dark" ? "white" : "black";
  const cardBg = colorScheme === "dark" ? "bg-gray-800" : "bg-white";
  const borderColor =
    colorScheme === "dark" ? "border-gray-700" : "border-gray-200";
  const inputBg = colorScheme === "dark" ? "bg-gray-700" : "bg-gray-100";
  const buttonBg = colorScheme === "dark" ? "bg-gray-700" : "bg-gray-100";

  const [timeFilter, setTimeFilter] = useState("all");
  const [showActions, setShowActions] = useState(false);

  const handleTimeFilterChange = (filter) => {
    setTimeFilter(filter);
    onFilterChange({ time: filter });
  };

  const handleCreateForm = () => {
    router.push("/features/onboarding/screens/AddForm");
    // Alert.alert("Create Form", `Create new form for ${project.name}`);
    // Implement form creation logic
    // setShowActions(false);
  };

  const handleAssignLeader = () => {
    Alert.alert("Assign Leader", `Assign project leader for ${project.name}`);
    // Implement leader assignment logic
    setShowActions(false);
  };

  const handleViewSubmissions = () => {
    Alert.alert("View Submissions", `View submissions for ${project.name}`);
    // Implement view submissions logic
    setShowActions(false);
  };

  return (
    <View
      className={`mb-6 mt-10 p-4 rounded-xl ${cardBg} border ${borderColor} shadow-sm`}
    >
      {/* Project Header */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className={`text-xl font-bold text-${textColor}`}>
            {project.name}
          </Text>
          <Text className={`text-gray-600 dark:text-gray-300`}>
            {project.description}
          </Text>
        </View>

        {/* Action Menu Button */}
        <TouchableOpacity onPress={() => setShowActions(!showActions)}>
          <MaterialCommunityIcons
            name={showActions ? "close" : "dots-vertical"}
            size={24}
            color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
          />
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View className="flex-row justify-between mb-4">
        <View className="items-center">
          <Text className={`text-sm text-gray-500 dark:text-gray-400`}>
            Meals Served
          </Text>
          <Text className={`text-lg font-bold text-${textColor}`}>
            {project.totalMeals.toLocaleString()}
          </Text>
        </View>
        <View className="items-center">
          <Text className={`text-sm text-gray-500 dark:text-gray-400`}>
            Families Reached
          </Text>
          <Text className={`text-lg font-bold text-${textColor}`}>
            {project.familiesReached.toLocaleString()}
          </Text>
        </View>
        <View className="items-center">
          <Text className={`text-sm text-gray-500 dark:text-gray-400`}>
            Funding
          </Text>
          <Text className={`text-lg font-bold text-${textColor}`}>
            ${project.funding.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Filter Controls */}
      <View className="flex-col justify-between mb-3">
        <View className="flex-row rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 mb-3">
          {["all", "3m", "6m", "12m"].map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => handleTimeFilterChange(filter)}
              className={`flex-1 items-center py-2 ${timeFilter === filter ? "bg-blue-100 dark:bg-blue-900/30" : ""}`}
            >
              <Text
                className={`text-sm ${timeFilter === filter ? "text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-300"}`}
              >
                {filter === "all"
                  ? "All Time"
                  : filter === "3m"
                    ? "3M"
                    : filter === "6m"
                      ? "6M"
                      : "12M"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Action Buttons - Shown when menu is clicked */}
      {showActions && (
        <View className={`mt-3 p-3 rounded-lg ${buttonBg}`}>
          {/* <Link href={`/projects/${project.id}/create-form`} asChild> */}
            <TouchableOpacity
              className="flex-row items-center py-2 px-3 mb-2 rounded-md bg-blue-100 dark:bg-blue-900/30"
              onPress={handleCreateForm}
            >
              <MaterialCommunityIcons
                name="plus-circle-outline"
                size={20}
                color={colorScheme === "dark" ? "#60A5FA" : "#3B82F6"}
              />
              <Text className="ml-2 text-blue-600 dark:text-blue-400">
                Create New Form
              </Text>
            </TouchableOpacity>
          {/* </Link> */}
          {/* <Link href={`/projects/${project.id}/create-form`} asChild> */}
            <TouchableOpacity
              className="flex-row items-center py-2 px-3 mb-2 rounded-md bg-blue-100 dark:bg-blue-900/30"
              onPress={handleCreateForm}
            >
              <MaterialCommunityIcons
                name="plus-circle-outline"
                size={20}
                color={colorScheme === "dark" ? "#60A5FA" : "#3B82F6"}
              />
              <Text className="ml-2 text-blue-600 dark:text-blue-400">
                Submit Form
              </Text>
            </TouchableOpacity>
          {/* </Link> */}

          <Link href={`/projects/${project.id}/assign-leader`} asChild>
            <TouchableOpacity
              className="flex-row items-center py-2 px-3 mb-2 rounded-md bg-green-100 dark:bg-green-900/30"
              onPress={handleAssignLeader}
            >
              <MaterialCommunityIcons
                name="account-plus"
                size={20}
                color={colorScheme === "dark" ? "#34D399" : "#10B981"}
              />
              <Text className="ml-2 text-green-600 dark:text-green-400">
                Project Leader Form
              </Text>
            </TouchableOpacity>
          </Link>

          <Link href={`/projects/${project.id}/submissions`} asChild>
            <TouchableOpacity
              className="flex-row items-center py-2 px-3 rounded-md bg-purple-100 dark:bg-purple-900/30"
              onPress={handleViewSubmissions}
            >
              <MaterialCommunityIcons
                name="clipboard-list-outline"
                size={20}
                color={colorScheme === "dark" ? "#A78BFA" : "#8B5CF6"}
              />
              <Text className="ml-2 text-purple-600 dark:text-purple-400">
                View Submissions
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}

      {/* Quick Access Buttons (Always visible) */}
      <View className="flex-row justify-between mt-3">
        <Link href={`/projects/${project.id}/quick-report`} asChild>
          <TouchableOpacity className={`py-2 px-3 rounded-md ${buttonBg}`}>
            <Text className={`text-sm text-${textColor}`}>Quick Report</Text>
          </TouchableOpacity>
        </Link>

        <Link href={`/projects/${project.id}/details`} asChild>
          <TouchableOpacity className={`py-2 px-3 rounded-md ${buttonBg}`}>
            <Text className={`text-sm text-${textColor}`}>View Details</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};
export default AnalyticsScreen;
