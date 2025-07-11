import { ASYNCKEYS, BASE_URI } from "@/BASE_URI";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useRef, useState } from "react";
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
import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import Svg, { Path } from "react-native-svg";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AddProjectScreen() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRefs = useRef<{ [key: string]: TextInput | null }>({});

  // Form state
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [country, setCountry] = useState("");
  const [region, setRegion] = useState("");
  const [sector, setSector] = useState("");
  const [beneficiaries, setBeneficiaries] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [duration, setDuration] = useState("");
  const [funding, setFunding] = useState("");
  const [foodlbs, setFoodlbs] = useState("");
  const [mediaLink, setMediaLink] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>("KE");
  const [loading, setLoading] = useState(false);

  // Date picker states
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const calculateDuration = (start: Date | null, end: Date | null) => {
    if (!start || !end) return "";

    // Calculate difference in days
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end days

    return diffDays.toString();
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      if (endDate) {
        setDuration(calculateDuration(selectedDate, endDate));
      }
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
      if (startDate) {
        setDuration(calculateDuration(startDate, selectedDate));
      }
    }
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleSubmit = async () => {
    const orgStr = await AsyncStorage.getItem(ASYNCKEYS.CURRENT_ORGANIZATION);
    let organizationId: string | null = null;
    try {
      organizationId = orgStr ? JSON.parse(orgStr).id : null;
    } catch (e) {
      console.error("Error parsing organization:", e);
      organizationId = null;
    }

    if (!organizationId) {
      Alert.alert("Error", "No organization selected");
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem(ASYNCKEYS.ACCESS_TOKEN);
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await axios.post(
        `${BASE_URI}/api/projects`,
        {
          name: projectName,
          organization_id: organizationId,
          description,
          address,
          contact_person: contactPerson,
          contact_email: contactEmail,
          country,
          region,
          sector,
          beneficiaries,
          start_date: startDate?.toISOString().split("T")[0] || null,
          end_date: endDate?.toISOString().split("T")[0] || null,
          duration: duration ? parseInt(duration) : null,
          funding,
          foodlbs: foodlbs ? parseInt(foodlbs) : null,
          mediaLink,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Project created successfully!");
        router.back();
      } else {
        throw new Error("Failed to create project");
      }
    } catch (error: any) {
      console.error("Error creating project:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to create project"
      );
    } finally {
      setLoading(false);
    }
  };

  const onSelectCountry = (selectedCountry: Country) => {
    setCountryCode(selectedCountry.cca2);
    setCountry(selectedCountry.name);
    setRegion(selectedCountry.region);
  };

  const focusNextField = (nextField: string) => {
    inputRefs.current[nextField]?.focus();
  };

  // SVG Icons
  const OutlinedProject = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        stroke={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
        strokeWidth={2}
      />
      <Path
        d="M9 22V12h6v10"
        stroke={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
        strokeWidth={2}
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
              name="file-document"
              size={40}
              color={colorScheme === "dark" ? "#60A5FA" : "#3B82F6"}
            />
          </View>
          <Text className="text-3xl font-bold text-gray-900 dark:text-white text-center">
            Create New Project
          </Text>
          <Text className="text-lg text-gray-500 dark:text-gray-400 mt-2 text-center">
            Enter project details to continue
          </Text>
        </View>

        {/* Form */}
        <View className="bg-gray-50 dark:bg-gray-800 rounded-t-3xl p-8 shadow-lg shadow-black/10 dark:shadow-black/20">
          {/* Project Name */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Project Title*
            </Text>
            <View className="flex-row items-center border-b border-gray-200 dark:border-gray-600 pb-2">
              <View className="mr-3">
                <OutlinedProject />
              </View>
              <TextInput
                placeholder="Enter Project Title"
                placeholderTextColor={
                  colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                }
                className="flex-1 text-gray-900 dark:text-white text-lg"
                value={projectName}
                onChangeText={setProjectName}
                ref={(el) => (inputRefs.current["projectName"] = el)}
                onSubmitEditing={() => focusNextField("description")}
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Project Description*
            </Text>
            <View className="flex-row items-center border-b border-gray-200 dark:border-gray-600 pb-2">
              <View className="mr-3">
                <OutlinedDescription />
              </View>
              <TextInput
                placeholder="Enter Description"
                placeholderTextColor={
                  colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                }
                className="flex-1 text-gray-900 dark:text-white text-lg"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                ref={(el) => (inputRefs.current["description"] = el)}
                onSubmitEditing={() => focusNextField("address")}
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Address */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Project Address
            </Text>
            <TextInput
              placeholder="Enter Address"
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg"
              value={address}
              onChangeText={setAddress}
              ref={(el) => (inputRefs.current["address"] = el)}
              onSubmitEditing={() => focusNextField("contactPerson")}
              returnKeyType="next"
            />
          </View>

          {/* Contact Person */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Contact Person
            </Text>
            <TextInput
              placeholder="Enter Contact Person"
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg"
              value={contactPerson}
              onChangeText={setContactPerson}
              ref={(el) => (inputRefs.current["contactPerson"] = el)}
              onSubmitEditing={() => focusNextField("contactEmail")}
              returnKeyType="next"
            />
          </View>

          {/* Contact Email */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Contact Email
            </Text>
            <TextInput
              placeholder="Enter Contact Email"
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg"
              value={contactEmail}
              onChangeText={setContactEmail}
              keyboardType="email-address"
              ref={(el) => (inputRefs.current["contactEmail"] = el)}
              onSubmitEditing={() => focusNextField("country")}
              returnKeyType="next"
            />
          </View>

          {/* Country */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Country
            </Text>
            <View className="flex-row items-center border-b border-gray-200 dark:border-gray-600 pb-2">
              <CountryPicker
                countryCode={countryCode}
                withFilter
                withFlag
                withCountryNameButton
                withEmoji
                onSelect={onSelectCountry}
                theme={{
                  onBackgroundTextColor:
                    colorScheme === "dark" ? "#FFFFFF" : "#000000",
                  backgroundColor:
                    colorScheme === "dark" ? "#1F2937" : "#F3F4F6",
                }}
              />
              <Text className="ml-2 text-gray-900 dark:text-white">
                {country || "Select country"}
              </Text>
            </View>
          </View>

          {/* Region */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Region
            </Text>
            <TextInput
              placeholder="Enter Region"
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg"
              value={region}
              onChangeText={setRegion}
              ref={(el) => (inputRefs.current["region"] = el)}
              onSubmitEditing={() => focusNextField("sector")}
              returnKeyType="next"
            />
          </View>

          {/* Sector */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Sector or Activities
            </Text>
            <TextInput
              placeholder="e.g. Health, Education"
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg"
              value={sector}
              onChangeText={setSector}
              ref={(el) => (inputRefs.current["sector"] = el)}
              onSubmitEditing={() => focusNextField("beneficiaries")}
              returnKeyType="next"
            />
          </View>

          {/* Beneficiaries */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Target Beneficiaries
            </Text>
            <TextInput
              placeholder="Enter Target Beneficiaries"
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg"
              value={beneficiaries}
              onChangeText={setBeneficiaries}
              ref={(el) => (inputRefs.current["beneficiaries"] = el)}
              onSubmitEditing={() => Keyboard.dismiss()}
              returnKeyType="next"
            />
          </View>

          {/* Start Date */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Start Date
            </Text>
            <TouchableOpacity
              onPress={() => setShowStartDatePicker(true)}
              className="flex-row items-center border-b border-gray-200 dark:border-gray-600 pb-2"
            >
              <View className="mr-3">
                <OutlinedCalendar />
              </View>
              <Text
                className={`text-lg ${startDate ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}
              >
                {startDate ? formatDate(startDate) : "Select start date"}
              </Text>
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={startDate || new Date()}
                mode="date"
                display="default"
                onChange={handleStartDateChange}
                minimumDate={new Date()}
              />
            )}
          </View>

          {/* End Date */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              End Date
            </Text>
            <TouchableOpacity
              onPress={() => setShowEndDatePicker(true)}
              className="flex-row items-center border-b border-gray-200 dark:border-gray-600 pb-2"
            >
              <View className="mr-3">
                <OutlinedCalendar />
              </View>
              <Text
                className={`text-lg ${endDate ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}`}
              >
                {endDate ? formatDate(endDate) : "Select end date"}
              </Text>
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={endDate || new Date()}
                mode="date"
                display="default"
                onChange={handleEndDateChange}
                minimumDate={startDate || new Date()}
              />
            )}
          </View>

          {/* Duration (auto-calculated) */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Duration (days)
            </Text>
            <TextInput
              placeholder="Will be calculated automatically"
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg"
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
              editable={false}
              ref={(el) => (inputRefs.current["duration"] = el)}
              onSubmitEditing={() => focusNextField("funding")}
              returnKeyType="next"
            />
          </View>

          {/* Funding */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Funding Request ($USD)
            </Text>
            <TextInput
              placeholder="Enter Amount"
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg"
              value={funding}
              onChangeText={setFunding}
              keyboardType="numeric"
              ref={(el) => (inputRefs.current["funding"] = el)}
              onSubmitEditing={() => focusNextField("foodlbs")}
              returnKeyType="next"
            />
          </View>

          {/* Food LBS */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Total LBS for food
            </Text>
            <TextInput
              placeholder="Enter Amount"
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg"
              value={foodlbs}
              onChangeText={setFoodlbs}
              keyboardType="numeric"
              ref={(el) => (inputRefs.current["foodlbs"] = el)}
              onSubmitEditing={() => focusNextField("mediaLink")}
              returnKeyType="next"
            />
          </View>

          {/* Media Link */}
          <View className="mb-8">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Media Link
            </Text>
            <TextInput
              placeholder="Enter link"
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg"
              value={mediaLink}
              onChangeText={setMediaLink}
              ref={(el) => (inputRefs.current["mediaLink"] = el)}
              onSubmitEditing={Keyboard.dismiss}
              returnKeyType="done"
            />
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
                Create Project
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
