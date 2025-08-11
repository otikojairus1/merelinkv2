import { ASYNCKEYS, BASE_URI } from "@/BASE_URI";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useRef, useState } from "react";
import Svg, { Path } from "react-native-svg";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

export default function ProjectDistribution() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRefs = useRef<{ [key: string]: TextInput | null }>({});

  // Form state
  const [projectId, setProjectId] = useState("");
  const [distributionCenter, setDistributionCenter] = useState("");
  const [distributionDate, setDistributionDate] = useState<Date | null>(null);
  const [teamLeaderId, setTeamLeaderId] = useState("");
  const [kgDistributed, setKgDistributed] = useState("");
  const [location, setLocation] = useState("");
  const [targetGroup, setTargetGroup] = useState("");
  const [activity, setActivity] = useState("");
  const [reportLink, setReportLink] = useState("");
  const [mediaLink, setMediaLink] = useState("");
  const [volunteers, setVolunteers] = useState("");
  const [budgetItems, setBudgetItems] = useState([{ item: "", amount: "" }]);
  const [communityEngagement, setCommunityEngagement] = useState("");
  const [challenges, setChallenges] = useState("");
  const [crisisBackground, setCrisisBackground] = useState("");
  const [impactStory, setImpactStory] = useState("");
  const [hourlyUpdates, setHourlyUpdates] = useState([
    { hour: "", update: "" },
  ]);
  const [beneficiaries, setBeneficiaries] = useState([{ name: "", bio: "" }]);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // Projects data
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loading, setLoading] = useState(false);

  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const orgStr = await AsyncStorage.getItem(
          ASYNCKEYS.CURRENT_ORGANIZATION
        );
        let organizationId: string | null = null;

        if (orgStr) {
          const org = JSON.parse(orgStr);
          organizationId = org.id;
        }

        if (!organizationId) {
          throw new Error("No organization selected");
        }

        const token = await AsyncStorage.getItem(ASYNCKEYS.ACCESS_TOKEN);
        if (!token) {
          throw new Error("No access token found");
        }

        const response = await axios.get(
          `${BASE_URI}/api/projects/organizations/${organizationId}/projects`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.data) {
          setProjects(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        Alert.alert("Error", "Failed to fetch projects");
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, []);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDistributionDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!projectId) {
      Alert.alert("Error", "Please select a project");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem(ASYNCKEYS.ACCESS_TOKEN);
      if (!token) {
        throw new Error("No access token found");
      }

      // Prepare the payload according to the API structure
      const payload = {
        project_id: projectId.toString(),
        distribution_center: distributionCenter,
        distribution_date: distributionDate
          ? formatDate(distributionDate)
          : null,
        team_leader_id: teamLeaderId,
        kg_distributed: kgDistributed ? parseFloat(kgDistributed) : null,
        location,
        target_group: targetGroup,
        activity,
        report_link: reportLink,
        media_link: mediaLink,
        volunteers: volunteers
          .split(",")
          .map((v) => v.trim())
          .filter((v) => v),
        budget_breakdown: budgetItems
          .filter((item) => item.item && item.amount)
          .map((item) => ({
            item: item.item,
            amount: parseFloat(item.amount),
          })),
        community_engagement: communityEngagement,
        challenges,
        crisis_background: crisisBackground,
        impact_story: impactStory,
        hourly_updates: hourlyUpdates
          .filter((update) => update.hour && update.update)
          .map((update) => ({
            hour: update.hour,
            update: update.update,
          })),
        beneficiaries: beneficiaries
          .filter((ben) => ben.name && ben.bio)
          .map((ben) => ({
            name: ben.name,
            bio: ben.bio,
          })),
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
      };

      const response = await axios.post(
        `${BASE_URI}/api/distributions`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Distribution created successfully!");
        router.back();
      } else {
        throw new Error("Failed to create distribution");
      }
    } catch (error: any) {
      console.error("Error creating distribution:", error.response?.data);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to create distribution"
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for dynamic fields
  const addBudgetItem = () => {
    setBudgetItems([...budgetItems, { item: "", amount: "" }]);
  };

  const removeBudgetItem = (index: number) => {
    const newItems = [...budgetItems];
    newItems.splice(index, 1);
    setBudgetItems(newItems);
  };

  const updateBudgetItem = (index: number, field: string, value: string) => {
    const newItems = [...budgetItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setBudgetItems(newItems);
  };

  const addHourlyUpdate = () => {
    setHourlyUpdates([...hourlyUpdates, { hour: "", update: "" }]);
  };

  const removeHourlyUpdate = (index: number) => {
    const newUpdates = [...hourlyUpdates];
    newUpdates.splice(index, 1);
    setHourlyUpdates(newUpdates);
  };

  const updateHourlyUpdate = (index: number, field: string, value: string) => {
    const newUpdates = [...hourlyUpdates];
    newUpdates[index] = { ...newUpdates[index], [field]: value };
    setHourlyUpdates(newUpdates);
  };

  const addBeneficiary = () => {
    setBeneficiaries([...beneficiaries, { name: "", bio: "" }]);
  };

  const removeBeneficiary = (index: number) => {
    const newBeneficiaries = [...beneficiaries];
    newBeneficiaries.splice(index, 1);
    setBeneficiaries(newBeneficiaries);
  };

  const updateBeneficiary = (index: number, field: string, value: string) => {
    const newBeneficiaries = [...beneficiaries];
    newBeneficiaries[index] = { ...newBeneficiaries[index], [field]: value };
    setBeneficiaries(newBeneficiaries);
  };

  const focusNextField = (nextField: string) => {
    inputRefs.current[nextField]?.focus();
  };

  // SVG Icons
  const OutlinedCalendar = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 2v4M8 2v4M3 10h18"
        stroke={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  const OutlinedLocation = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
        stroke={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
        strokeWidth={2}
      />
      <Path
        d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
        stroke={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
        strokeWidth={2}
      />
    </Svg>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 bg-white dark:bg-gray-900"
        contentContainerStyle={{ paddingBottom: 100 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="items-center px-8 pt-16 pb-4">
          <View className="bg-blue-100 dark:bg-blue-900/30 p-5 rounded-full mb-4">
            <MaterialCommunityIcons
              name="truck-delivery"
              size={40}
              color={colorScheme === "dark" ? "#60A5FA" : "#3B82F6"}
            />
          </View>
          <Text className="text-3xl font-bold text-gray-900 dark:text-white text-center">
            New Distribution
          </Text>
          <Text className="text-lg text-gray-500 dark:text-gray-400 mt-2 text-center">
            Record details of your distribution
          </Text>
        </View>

        {/* Form */}
        <View className="bg-gray-50 dark:bg-gray-800 rounded-t-3xl p-8 shadow-lg shadow-black/10 dark:shadow-black/20">
          {/* Project Selection */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Project*
            </Text>
            {loadingProjects ? (
              <ActivityIndicator size="small" />
            ) : (
              <View className="border-b border-gray-200 dark:border-gray-600 pb-2">
                <Picker
                  selectedValue={projectId}
                  onValueChange={(itemValue) => setProjectId(itemValue)}
                  style={{
                    color: colorScheme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                >
                  <Picker.Item label="Select a project" value="" />
                  {projects.map((project) => (
                    <Picker.Item
                      key={project.id}
                      label={project.name}
                      value={project.id}
                    />
                  ))}
                </Picker>
              </View>
            )}
          </View>

          {/* Distribution Center */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Distribution Center
            </Text>
            <TextInput
              placeholder="Enter distribution center"
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg"
              value={distributionCenter}
              onChangeText={setDistributionCenter}
              ref={(el) => (inputRefs.current["distributionCenter"] = el)}
              onSubmitEditing={() => focusNextField("teamLeaderId")}
              returnKeyType="next"
            />
          </View>

          {/* Distribution Date */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Distribution Date
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="flex-row items-center border-b border-gray-200 dark:border-gray-600 pb-2"
            >
              <View className="mr-3">
                <OutlinedCalendar />
              </View>
              <Text
                className={`text-lg ${distributionDate ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}
              >
                {distributionDate
                  ? formatDate(distributionDate)
                  : "Select date"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={distributionDate || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          {/* Team Leader ID */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Team Leader ID
            </Text>
            <TextInput
              placeholder="Enter team leader ID"
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg"
              value={teamLeaderId}
              onChangeText={setTeamLeaderId}
              ref={(el) => (inputRefs.current["teamLeaderId"] = el)}
              onSubmitEditing={() => focusNextField("kgDistributed")}
              returnKeyType="next"
            />
          </View>

          {/* KG Distributed */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              KG Distributed
            </Text>
            <TextInput
              placeholder="Enter amount in KG"
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg"
              value={kgDistributed}
              onChangeText={setKgDistributed}
              keyboardType="numeric"
              ref={(el) => (inputRefs.current["kgDistributed"] = el)}
              onSubmitEditing={() => focusNextField("location")}
              returnKeyType="next"
            />
          </View>

          {/* Location */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Location
            </Text>
            <View className="flex-row items-center border-b border-gray-200 dark:border-gray-600 pb-2">
              <View className="mr-3">
                <OutlinedLocation />
              </View>
              <TextInput
                placeholder="Enter location"
                placeholderTextColor={
                  colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                }
                className="flex-1 text-gray-900 dark:text-white text-lg"
                value={location}
                onChangeText={setLocation}
                ref={(el) => (inputRefs.current["location"] = el)}
                onSubmitEditing={() => focusNextField("targetGroup")}
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Target Group */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Target Group
            </Text>
            <TextInput
              placeholder="Enter target group"
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg"
              value={targetGroup}
              onChangeText={setTargetGroup}
              ref={(el) => (inputRefs.current["targetGroup"] = el)}
              onSubmitEditing={() => focusNextField("activity")}
              returnKeyType="next"
            />
          </View>

          {/* Activity */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Activity
            </Text>
            <TextInput
              placeholder="Enter activity description"
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg"
              value={activity}
              onChangeText={setActivity}
              ref={(el) => (inputRefs.current["activity"] = el)}
              onSubmitEditing={() => focusNextField("reportLink")}
              returnKeyType="next"
            />
          </View>

          {/* Report Link */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Report Link
            </Text>
            <TextInput
              placeholder="Enter report URL"
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg"
              value={reportLink}
              onChangeText={setReportLink}
              keyboardType="url"
              ref={(el) => (inputRefs.current["reportLink"] = el)}
              onSubmitEditing={() => focusNextField("mediaLink")}
              returnKeyType="next"
            />
          </View>

          {/* Media Link */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Media Link
            </Text>
            <TextInput
              placeholder="Enter media URL"
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg"
              value={mediaLink}
              onChangeText={setMediaLink}
              keyboardType="url"
              ref={(el) => (inputRefs.current["mediaLink"] = el)}
              onSubmitEditing={() => focusNextField("volunteers")}
              returnKeyType="next"
            />
          </View>

          {/* Volunteers */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Volunteers (comma separated)
            </Text>
            <TextInput
              placeholder="Jane Doe, John Smith"
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg"
              value={volunteers}
              onChangeText={setVolunteers}
              ref={(el) => (inputRefs.current["volunteers"] = el)}
              onSubmitEditing={Keyboard.dismiss}
              returnKeyType="next"
            />
          </View>

          {/* Budget Breakdown */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Budget Breakdown
            </Text>
            {budgetItems.map((item, index) => (
              <View key={index} className="mb-4">
                <View className="flex-row items-center mb-2">
                  <TextInput
                    placeholder="Item"
                    placeholderTextColor={
                      colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                    }
                    className="flex-1 border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg mr-2"
                    value={item.item}
                    onChangeText={(text) =>
                      updateBudgetItem(index, "item", text)
                    }
                  />
                  <TextInput
                    placeholder="Amount"
                    placeholderTextColor={
                      colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                    }
                    className="flex-1 border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg"
                    value={item.amount}
                    onChangeText={(text) =>
                      updateBudgetItem(index, "amount", text)
                    }
                    keyboardType="numeric"
                  />
                </View>
                {budgetItems.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeBudgetItem(index)}
                    className="self-end"
                  >
                    <Text className="text-red-500 text-sm">Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity
              onPress={addBudgetItem}
              className="bg-blue-100 dark:bg-blue-900/30 py-2 px-4 rounded-lg self-start"
            >
              <Text className="text-blue-600 dark:text-blue-400">
                + Add Item
              </Text>
            </TouchableOpacity>
          </View>

          {/* Community Engagement */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Community Engagement
            </Text>
            <TextInput
              placeholder="Describe community engagement"
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg"
              value={communityEngagement}
              onChangeText={setCommunityEngagement}
              multiline
              numberOfLines={3}
              ref={(el) => (inputRefs.current["communityEngagement"] = el)}
              onSubmitEditing={Keyboard.dismiss}
              returnKeyType="next"
            />
          </View>

          {/* Challenges */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Challenges Faced
            </Text>
            <TextInput
              placeholder="Describe any challenges"
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg"
              value={challenges}
              onChangeText={setChallenges}
              multiline
              numberOfLines={3}
              ref={(el) => (inputRefs.current["challenges"] = el)}
              onSubmitEditing={Keyboard.dismiss}
              returnKeyType="next"
            />
          </View>

          {/* Crisis Background */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Crisis Background
            </Text>
            <TextInput
              placeholder="Describe the crisis background"
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg"
              value={crisisBackground}
              onChangeText={setCrisisBackground}
              multiline
              numberOfLines={3}
              ref={(el) => (inputRefs.current["crisisBackground"] = el)}
              onSubmitEditing={Keyboard.dismiss}
              returnKeyType="next"
            />
          </View>

          {/* Impact Story */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Impact Story
            </Text>
            <TextInput
              placeholder="Share a specific impact story"
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg"
              value={impactStory}
              onChangeText={setImpactStory}
              multiline
              numberOfLines={3}
              ref={(el) => (inputRefs.current["impactStory"] = el)}
              onSubmitEditing={Keyboard.dismiss}
              returnKeyType="next"
            />
          </View>

          {/* Hourly Updates */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Hourly Updates
            </Text>
            {hourlyUpdates.map((update, index) => (
              <View key={index} className="mb-4">
                <View className="flex-row items-center mb-2">
                  <TextInput
                    placeholder="Hour (HH:MM)"
                    placeholderTextColor={
                      colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                    }
                    className="flex-1 border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg mr-2"
                    value={update.hour}
                    onChangeText={(text) =>
                      updateHourlyUpdate(index, "hour", text)
                    }
                  />
                  <TextInput
                    placeholder="Update"
                    placeholderTextColor={
                      colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                    }
                    className="flex-1 border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg"
                    value={update.update}
                    onChangeText={(text) =>
                      updateHourlyUpdate(index, "update", text)
                    }
                  />
                </View>
                {hourlyUpdates.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeHourlyUpdate(index)}
                    className="self-end"
                  >
                    <Text className="text-red-500 text-sm">Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity
              onPress={addHourlyUpdate}
              className="bg-blue-100 dark:bg-blue-900/30 py-2 px-4 rounded-lg self-start"
            >
              <Text className="text-blue-600 dark:text-blue-400">
                + Add Update
              </Text>
            </TouchableOpacity>
          </View>

          {/* Beneficiaries */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Beneficiary Stories
            </Text>
            {beneficiaries.map((beneficiary, index) => (
              <View key={index} className="mb-4">
                <TextInput
                  placeholder="Beneficiary Name"
                  placeholderTextColor={
                    colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                  }
                  className="border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg mb-2"
                  value={beneficiary.name}
                  onChangeText={(text) =>
                    updateBeneficiary(index, "name", text)
                  }
                />
                <TextInput
                  placeholder="Beneficiary Bio"
                  placeholderTextColor={
                    colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                  }
                  className="border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg"
                  value={beneficiary.bio}
                  onChangeText={(text) => updateBeneficiary(index, "bio", text)}
                  multiline
                  numberOfLines={3}
                />
                {beneficiaries.length > 1 && (
                  <TouchableOpacity
                    onPress={() => removeBeneficiary(index)}
                    className="self-end mt-2"
                  >
                    <Text className="text-red-500 text-sm">Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity
              onPress={addBeneficiary}
              className="bg-blue-100 dark:bg-blue-900/30 py-2 px-4 rounded-lg self-start"
            >
              <Text className="text-blue-600 dark:text-blue-400">
                + Add Beneficiary
              </Text>
            </TouchableOpacity>
          </View>

          {/* Coordinates */}
          <View className="mb-8">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Location Coordinates
            </Text>
            <View className="flex-row mb-2">
              <TextInput
                placeholder="Latitude"
                placeholderTextColor={
                  colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                }
                className="flex-1 border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg mr-2"
                value={latitude}
                onChangeText={setLatitude}
                keyboardType="numeric"
              />
              <TextInput
                placeholder="Longitude"
                placeholderTextColor={
                  colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                }
                className="flex-1 border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg"
                value={longitude}
                onChangeText={setLongitude}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className={`bg-blue-600 dark:bg-blue-500 py-4 rounded-xl shadow-md shadow-blue-500/20 dark:shadow-blue-900/30 ${
              loading ? "opacity-70" : ""
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white text-center font-bold text-lg">
                Save Distribution
              </Text>
            )}
          </TouchableOpacity>

          {/* Back Link */}
          <View className="flex-row justify-center mt-6">
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-blue-600 dark:text-blue-400 font-medium">
                Go Back
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
