import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useRef, useState } from "react";
import {
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
  const [region, setRegion] = useState("");
  const [sector, setSector] = useState("");
  const [beneficiaries, setBeneficiaries] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [duration, setDuration] = useState("");
  const [funding, setFunding] = useState("");
  const [foodlbs, setFoodlbs] = useState("");
  const [mediaLink, setmediaLink] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>("KE");
  const [country, setCountry] = useState<Country | null>(null);

  const handleSubmit = () => {
    Alert.alert("Success", "Project created successfully!");
    router.back();
  };

  const onSelectCountry = (selectedCountry: Country) => {
    setCountryCode(selectedCountry.cca2);
    setCountry(selectedCountry);
    setRegion(selectedCountry.region);
  };

  const focusNextField = (nextField: string) => {
    inputRefs.current[nextField]?.focus();
  };

  const scrollToInput = (reactNode: any) => {
    scrollViewRef.current?.scrollTo({ y: reactNode, animated: true });
  };

  // SVG Icons (same as before)
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-8 pb-10 pt-16 bg-white dark:bg-gray-900"
        contentContainerStyle={{ paddingBottom: 0 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="items-center mb-10 ">
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
        <View className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 shadow-lg shadow-black/10 dark:shadow-black/20 mb-10">
          {/* Project Name */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Project Title
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
                onFocus={(e) => {
                  scrollToInput(e.nativeEvent.target);
                }}
              />
            </View>
          </View>

          {/* Description */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Project Description
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
                onFocus={(e) => {
                  scrollToInput(e.nativeEvent.target);
                }}
              />
            </View>
          </View>

          {/* Address */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Organization Address
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
              onFocus={(e) => {
                scrollToInput(e.nativeEvent.target);
              }}
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
              onFocus={(e) => {
                scrollToInput(e.nativeEvent.target);
              }}
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
              onSubmitEditing={() => focusNextField("region")}
              returnKeyType="next"
              onFocus={(e) => {
                scrollToInput(e.nativeEvent.target);
              }}
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
                {country?.name}
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
              onFocus={(e) => {
                scrollToInput(e.nativeEvent.target);
              }}
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
              onFocus={(e) => {
                scrollToInput(e.nativeEvent.target);
              }}
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
              keyboardType="numeric"
              ref={(el) => (inputRefs.current["beneficiaries"] = el)}
              onSubmitEditing={() => focusNextField("duration")}
              returnKeyType="next"
              onFocus={(e) => {
                scrollToInput(e.nativeEvent.target);
              }}
            />
          </View>

          {/* Duration */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Duration (months)
            </Text>
            <TextInput
              placeholder="Enter Duration"
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg"
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
              ref={(el) => (inputRefs.current["duration"] = el)}
              onSubmitEditing={() => focusNextField("funding")}
              returnKeyType="next"
              onFocus={(e) => {
                scrollToInput(e.nativeEvent.target);
              }}
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
              onFocus={(e) => {
                scrollToInput(e.nativeEvent.target);
              }}
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
              onFocus={(e) => {
                scrollToInput(e.nativeEvent.target);
              }}
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
              onChangeText={setmediaLink}
              ref={(el) => (inputRefs.current["mediaLink"] = el)}
              onSubmitEditing={Keyboard.dismiss}
              returnKeyType="done"
              onFocus={(e) => {
                scrollToInput(e.nativeEvent.target);
              }}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            className="bg-blue-600 dark:bg-blue-500 py-4 rounded-xl shadow-md shadow-blue-500/20 dark:shadow-blue-900/30"
          >
            <Text className="text-white text-center font-bold text-lg">
              Create Project
            </Text>
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
