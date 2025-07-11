import { ASYNCKEYS, BASE_URI } from "@/BASE_URI";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

const AddAidDistributionForm = () => {
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const [showPicker, setShowPicker] = useState({
    field: "",
    show: false,
    mode: "date",
  });
  const [countryCode, setCountryCode] = useState<CountryCode>("KE");
  const [loading, setLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [orgID, setOrgID] = useState("");
  const [projects, setProjects] = useState([]);
  const [diff, setDiff] = useState("");

  const [form, setForm] = useState({
    team_leader_name: "",
    organization_id: "",
    project_id: "",
    contact_phone: "",
    contact_email: "",
    distribution_country: "",
    distribution_region_city: "",
    distribution_location: "",
    distribution_coordinates: "",
    start_date: new Date(),
    end_date: new Date(),
    operation_days: "",
    volunteers: [""],
    total_aid_cost: "",
    budget_breakdown: [{ item: "", cost: "" }],
    items_distributed: [""],
    families_served: "",
    total_families: "",
    individuals_per_family: "",
    distribution_method: "",
    distribution_challenges: [{ type: "", description: "" }],
    special_considerations: [{ type: "", description: "" }],
    community_engagement: [{ type: "", description: "" }],
    crisis_type: "",
    crisis_location: "",
    crisis_date: new Date(),
    crisis_background: "",
    response_description: "",
    aid_weight_kg: "",
    aid_transport_units: "",
    aid_impact_estimate: "",
    hourly_updates: [{ time: "", activity: "", details: "" }],
    bios: [{ name: "", age: "", background: "", story: "", gratitude: "" }],
  });

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const orgStr = await AsyncStorage.getItem(
          ASYNCKEYS.CURRENT_ORGANIZATION
        );
        if (orgStr) {
          const organization = JSON.parse(orgStr);
          setOrgID(organization.id.toString());
          setForm((prev) => ({
            ...prev,
            organization_id: organization.id.toString(),
          }));
        }
      } catch (error) {
        console.error("Failed to get organization:", error);
      }
    };

    fetchOrganization();
  }, []);

  const getDateDifference = (start, end) => {
    const diffMs = end - start;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
    const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);

    const diffStr = `${diffDays} days, ${diffHours} hours, ${diffMinutes} minutes`;
    setForm((prev) => ({
      ...prev,
      operation_days: diffStr,
    }));
    setDiff(diffStr);
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShowPicker({ field: "", show: false, mode: "date" });
      return;
    }

    if (selectedDate) {
      handleChange(showPicker.field, selectedDate);
    }
    setShowPicker({ field: "", show: false, mode: "date" });
  };

  const showDatePicker = (field: string, mode: "date" | "time") => {
    setShowPicker({ field, show: true, mode });
  };

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onSelectCountry = (selectedCountry: Country) => {
    setForm((prev) => ({
      ...prev,
      distribution_country: selectedCountry.name,
      distribution_region_city: selectedCountry.subregion,
      distribution_location: selectedCountry.region || "",
    }));
  };

  const handleArrayChange = (key: string, index: number, value: string) => {
    const updated = [...form[key as keyof typeof form]];
    updated[index] = value;
    setForm((prev) => ({ ...prev, [key]: updated }));
  };

  const handleObjectArrayChange = (
    key: keyof typeof form,
    index: number,
    field: string,
    value: string
  ) => {
    const updated = [...(form[key] as Array<Record<string, string>>)];
    updated[index] = { ...updated[index], [field]: value };
    setForm((prev) => ({ ...prev, [key]: updated }));
  };

  const addField = (key: keyof typeof form, defaultValue: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: [...(prev[key] as any[]), defaultValue],
    }));
  };

  const validateForm = () => {
    const requiredFields = [
      "team_leader_name",
      "organization_id",
      "project_id",
      "contact_phone",
      "distribution_country",
      "start_date",
    ];
    for (const field of requiredFields) {
      if (!form[field] || !form[field].toString().trim()) {
        Alert.alert(
          "Validation Error",
          `${field.replace(/_/g, " ")} is required`
        );
        return false;
      }
    }
    if (form.contact_email && !/^\S+@\S+\.\S+$/.test(form.contact_email)) {
      Alert.alert("Validation Error", "Invalid email format");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem(ASYNCKEYS.ACCESS_TOKEN);
      if (!token) throw new Error("No access token found");

      const response = await axios.post(
        `${BASE_URI}/api/projects/project-leader-form`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert("Success", "Distribution submitted successfully");
      router.replace('/');
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to submit distribution"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      setProjectsLoading(true);
      const orgStr = await AsyncStorage.getItem(ASYNCKEYS.CURRENT_ORGANIZATION);
      if (!orgStr) throw new Error("No organization selected");

      const organization = JSON.parse(orgStr);
      const token = await AsyncStorage.getItem(ASYNCKEYS.ACCESS_TOKEN);
      if (!token) throw new Error("No access token found");

      const response = await axios.get(
        `${BASE_URI}/api/projects/organizations/${organization.id}/projects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjects(response.data.data);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load projects");
    } finally {
      setProjectsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Location permission denied");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setForm((prev) => ({
        ...prev,
        distribution_coordinates:
          "Latitude - " +
          location.coords.latitude.toString() +
          ", Longitude - " +
          location.coords.longitude.toString(),
      }));
    })();
  }, []);

  useEffect(() => {
    getDateDifference(form.start_date, form.end_date);
  }, [form.start_date, form.end_date]);

  const renderInput = (
    label: string,
    key: string,
    multiline = false,
    numeric = false
  ) => (
    <View className="mb-6">
      <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
        {label}
      </Text>
      <TextInput
        className="border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg"
        value={form[key]}
        onChangeText={(val) => handleChange(key, val)}
        multiline={multiline}
        keyboardType={numeric ? "numeric" : "default"}
        placeholder={`Enter ${label}`}
        placeholderTextColor={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
      />
    </View>
  );

  const renderArrayInput = (label: string, key: string, numeric = false) => (
    <View className="mb-6">
      <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
        {label}
      </Text>
      {form[key].map((val: string, i: number) => (
        <TextInput
          key={i}
          className="border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg mb-2"
          value={val}
          onChangeText={(text) => handleArrayChange(key, i, text)}
          keyboardType={numeric ? "numeric" : "default"}
          placeholder={`${label} ${i + 1}`}
          placeholderTextColor={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
        />
      ))}
      <TouchableOpacity onPress={() => addField(key, "")}>
        <Text className="text-blue-600 dark:text-blue-400 font-medium">
          + Add another
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderObjectArrayInput = (
    label: string,
    key: string,
    fields: string[],
    numericFields: string[] = []
  ) => (
    <View className="mb-6">
      <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
        {label}
      </Text>
      {form[key].map((item: any, i: number) => (
        <View key={i} className="mb-4">
          {fields.map((field) => (
            <TextInput
              key={field}
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className="border-b border-gray-200 dark:border-gray-600 pb-2 text-gray-900 dark:text-white text-lg mb-2"
              value={item[field]}
              onChangeText={(val) =>
                handleObjectArrayChange(key, i, field, val)
              }
              keyboardType={
                numericFields.includes(field) ? "numeric" : "default"
              }
              placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)} ${
                i + 1
              }`}
            />
          ))}
        </View>
      ))}
      <TouchableOpacity
        onPress={() =>
          addField(
            key,
            fields.reduce((acc, field) => ({ ...acc, [field]: "" }), {})
          )
        }
      >
        <Text className="text-blue-600 dark:text-blue-400 font-medium">
          + Add another
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        className="flex-1 bg-white dark:bg-gray-900"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View className="items-center px-8 pt-16 pb-4">
          <View className="bg-blue-100 dark:bg-blue-900/30 p-5 rounded-full mb-4">
            <MaterialCommunityIcons
              name="hand-heart"
              size={40}
              color={colorScheme === "dark" ? "#60A5FA" : "#3B82F6"}
            />
          </View>
          <Text className="text-3xl font-bold text-gray-900 dark:text-white text-center">
            Project Leader Form
          </Text>
          <Text className="text-lg text-gray-500 dark:text-gray-400 mt-2 text-center">
            Record details of your aid distribution
          </Text>
        </View>

        {/* Form */}
        <View className="bg-gray-50 dark:bg-gray-800 rounded-t-3xl p-8 shadow-lg shadow-black/10 dark:shadow-black/20">
          {/* Project Selection */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Select Project
            </Text>
            {projectsLoading ? (
              <ActivityIndicator
                size="small"
                color={colorScheme === "dark" ? "#60A5FA" : "#3B82F6"}
              />
            ) : (
              <View className="border-b border-gray-200 dark:border-gray-600 pb-2">
                <Picker
                  selectedValue={form.project_id}
                  onValueChange={(itemValue) =>
                    handleChange("project_id", itemValue)
                  }
                  style={{
                    color: colorScheme === "dark" ? "#FFFFFF" : "#000000",
                  }}
                >
                  <Picker.Item label="Select a project..." value="" />
                  {projects.map((project) => (
                    <Picker.Item
                      key={project.id}
                      label={project.name}
                      value={String(project.id)}
                    />
                  ))}
                </Picker>
              </View>
            )}
          </View>

          {/* Dates */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Start Date
            </Text>
            <TouchableOpacity
              onPress={() => showDatePicker("start_date", "date")}
              className="border-b border-gray-200 dark:border-gray-600 pb-2"
            >
              <Text className="text-gray-900 dark:text-white text-lg">
                {form.start_date.toDateString()}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              End Date
            </Text>
            <TouchableOpacity
              onPress={() => showDatePicker("end_date", "date")}
              className="border-b border-gray-200 dark:border-gray-600 pb-2"
            >
              <Text className="text-gray-900 dark:text-white text-lg">
                {form.end_date.toDateString()}
              </Text>
            </TouchableOpacity>
          </View>

          {showPicker.show && (
            <DateTimePicker
              value={form[showPicker.field as keyof typeof form] || new Date()}
              mode={showPicker.mode}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onDateChange}
            />
          )}

          {/* Basic Info */}
          {renderInput("Team Leader Name", "team_leader_name")}
          {renderInput("Contact Phone", "contact_phone", false, true)}
          {renderInput("Contact Email", "contact_email")}

          {/* Location */}
          <View className="mb-6">
            <Text className="text-gray-900 dark:text-white text-sm font-medium mb-2">
              Distribution Country
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
                {form.distribution_country || "Select Country"}
              </Text>
            </View>
          </View>

          {renderInput("Region/City", "distribution_region_city")}
          {renderInput("Location", "distribution_location")}
          {renderInput("Operation Days", "operation_days")}

          {/* Distribution Details */}
          {renderArrayInput("Volunteers", "volunteers")}
          {renderInput("Total Aid Cost", "total_aid_cost", false, true)}
          {renderObjectArrayInput(
            "Budget Breakdown",
            "budget_breakdown",
            ["item", "cost"],
            ["cost"]
          )}
          {renderArrayInput("Items Distributed", "items_distributed")}
          {renderInput("Families Served", "families_served", false, true)}
          {renderInput("Total Families", "total_families", false, true)}
          {renderInput(
            "Individuals Per Family",
            "individuals_per_family",
            false,
            true
          )}
          {renderInput("Distribution Method", "distribution_method")}

          {/* Challenges and Considerations */}
          {renderObjectArrayInput(
            "Distribution Challenges",
            "distribution_challenges",
            ["type", "description"]
          )}
          {renderObjectArrayInput(
            "Special Considerations",
            "special_considerations",
            ["type", "description"]
          )}
          {renderObjectArrayInput(
            "Community Engagement",
            "community_engagement",
            ["type", "description"]
          )}

          {/* Crisis Info */}
          {renderInput("Crisis Type", "crisis_type")}
          {renderInput("Crisis Location", "crisis_location")}
          {renderInput("Crisis Background", "crisis_background", true)}
          {renderInput("Response Description", "response_description", true)}

          {/* Aid Details */}
          {renderInput("Aid Weight (kg)", "aid_weight_kg", false, true)}
          {renderInput("Transport Units", "aid_transport_units", false, true)}
          {renderInput("Aid Impact Estimate", "aid_impact_estimate", true)}

          {/* Hourly Updates */}
          {renderObjectArrayInput("Hourly Updates", "hourly_updates", [
            "time",
            "activity",
            "details",
          ])}

          {/* Beneficiary Bios */}
          {renderObjectArrayInput(
            "Beneficiary Bios",
            "bios",
            ["name", "age", "background", "story", "gratitude"],
            ["age"]
          )}

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className={`bg-blue-600 dark:bg-blue-500 py-4 rounded-xl shadow-md shadow-blue-500/20 dark:shadow-blue-900/30 mt-8 ${
              loading ? "opacity-70" : ""
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white text-center font-bold text-lg">
                Submit Distribution
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddAidDistributionForm;
