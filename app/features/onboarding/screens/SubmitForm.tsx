import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const FormSubmissionScreen = ({ route }) => {
  const { colorScheme } = useColorScheme();
  // Sample form with all input types
  const formSchema = route?.params?.formSchema || {
    title: "Complete Profile",
    description: "Please fill in all required fields",
    fields: [
      { type: "section", label: "Personal Information" },
      {
        type: "text",
        label: "Full Name",
        placeholder: "John Doe",
        required: true,
      },
      {
        type: "email",
        label: "Email",
        placeholder: "your@email.com",
        required: true,
      },
      { type: "number", label: "Age", placeholder: "Enter your age" },
      {
        type: "password",
        label: "Password",
        placeholder: "Create a password",
        required: true,
      },
      { type: "textarea", label: "Bio", placeholder: "Tell us about yourself" },
      { type: "phone", label: "Phone Number", placeholder: "+1 234 567 890" },
      { type: "date", label: "Date of Birth", required: true },

      { type: "section", label: "Preferences" },
      {
        type: "select",
        label: "Country",
        required: true,
        options: [
          { label: "United States", value: "us" },
          { label: "Canada", value: "ca" },
          { label: "United Kingdom", value: "uk" },
        ],
      },
      {
        type: "radio",
        label: "Gender",
        required: true,
        options: [
          { label: "Male", value: "male" },
          { label: "Female", value: "female" },
          { label: "Other", value: "other" },
        ],
      },
      { type: "checkbox", label: "Subscribe to newsletter", value: false },
      {
        type: "multiselect",
        label: "Interests",
        options: [
          { label: "Technology", value: "tech" },
          { label: "Sports", value: "sports" },
          { label: "Music", value: "music" },
        ],
      },

      { type: "section", label: "Additional Information" },
      { type: "file", label: "Upload Resume" },
      { type: "range", label: "Experience Level", min: 0, max: 10, step: 1 },
      { type: "color", label: "Favorite Color" },
    ],
  };

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerField, setDatePickerField] = useState(null);
  const [multiSelectValues, setMultiSelectValues] = useState({});

  // Initialize form data structure
  useEffect(() => {
    const initialData = {};
    const initialMultiSelect = {};
    formSchema.fields.forEach((field) => {
      if (field.type === "checkbox") {
        initialData[field.label] = field.value || false;
      } else if (field.type === "select" || field.type === "radio") {
        initialData[field.label] = field.options?.[0]?.value || "";
      } else if (field.type === "date") {
        initialData[field.label] = new Date();
      } else if (field.type === "multiselect") {
        initialMultiSelect[field.label] = [];
        initialData[field.label] = [];
      } else if (field.type === "range") {
        initialData[field.label] = field.min || 0;
      } else if (field.type === "color") {
        initialData[field.label] = "#000000";
      } else {
        initialData[field.label] = "";
      }
    });

    setFormData(initialData);
    setMultiSelectValues(initialMultiSelect);
  }, [formSchema]);

  const handleInputChange = (fieldLabel, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldLabel]: value,
    }));

    // Clear error when user starts typing
    if (errors[fieldLabel]) {
      setErrors((prev) => ({
        ...prev,
        [fieldLabel]: null,
      }));
    }
  };

  const handleMultiSelectChange = (fieldLabel, optionValue) => {
    setMultiSelectValues((prev) => {
      const currentValues = prev[fieldLabel] || [];
      const newValues = currentValues.includes(optionValue)
        ? currentValues.filter((v) => v !== optionValue)
        : [...currentValues, optionValue];

      // Update the actual form data
      setFormData((prevForm) => ({
        ...prevForm,
        [fieldLabel]: newValues,
      }));

      return {
        ...prev,
        [fieldLabel]: newValues,
      };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    formSchema.fields.forEach((field) => {
      if (field.required) {
        if (field.type === "checkbox") {
          if (!formData[field.label]) {
            newErrors[field.label] = "This field is required";
          }
        } else if (field.type === "multiselect") {
          if (!formData[field.label]?.length) {
            newErrors[field.label] = "Please select at least one option";
          }
        } else {
          if (
            !formData[field.label] ||
            formData[field.label].toString().trim() === ""
          ) {
            newErrors[field.label] = "This field is required";
          }
        }
      }

      // Additional validation for email
      if (
        field.type === "email" &&
        formData[field.label] &&
        !/^\S+@\S+\.\S+$/.test(formData[field.label])
      ) {
        newErrors[field.label] = "Please enter a valid email";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      console.log("Form submitted:", formData);
      Alert.alert("Success", "Form submitted successfully!");
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate && datePickerField) {
      handleInputChange(datePickerField, selectedDate);
    }
  };

  const renderField = (field) => {
    switch (field.type) {
      case "text":
      case "email":
      case "number":
      case "password":
      case "phone":
      case "textarea":
        return (
          <View key={field.label} className="mb-4">
            <Text className="text-gray-900 dark:text-white font-medium mb-1">
              {field.label}
              {field.required && <Text className="text-red-500"> *</Text>}
            </Text>
            <TextInput
              placeholder={field.placeholder}
              placeholderTextColor={
                colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
              }
              className={`bg-white dark:bg-gray-800 rounded-lg px-4 py-3 text-gray-900 dark:text-white border ${
                errors[field.label]
                  ? "border-red-500"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              value={formData[field.label]?.toString()}
              onChangeText={(text) => handleInputChange(field.label, text)}
              keyboardType={
                field.type === "number"
                  ? "numeric"
                  : field.type === "email"
                    ? "email-address"
                    : field.type === "phone"
                      ? "phone-pad"
                      : "default"
              }
              secureTextEntry={field.type === "password"}
              multiline={field.type === "textarea"}
              numberOfLines={field.type === "textarea" ? 4 : 1}
            />
            {errors[field.label] && (
              <Text className="text-red-500 text-sm mt-1">
                {errors[field.label]}
              </Text>
            )}
          </View>
        );

      case "select":
        return (
          <View key={field.label} className="mb-4">
            <Text className="text-gray-900 dark:text-white font-medium mb-1">
              {field.label}
              {field.required && <Text className="text-red-500"> *</Text>}
            </Text>
            <View
              className={`bg-white dark:bg-gray-800 rounded-lg border ${
                errors[field.label]
                  ? "border-red-500"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              <Picker
                selectedValue={formData[field.label]}
                onValueChange={(value) => handleInputChange(field.label, value)}
                style={{
                  color: colorScheme === "dark" ? "#FFFFFF" : "#000000",
                }}
                dropdownIconColor={
                  colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                }
              >
                {field.options?.map((option, index) => (
                  <Picker.Item
                    key={index}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker>
            </View>
            {errors[field.label] && (
              <Text className="text-red-500 text-sm mt-1">
                {errors[field.label]}
              </Text>
            )}
          </View>
        );

      case "radio":
        return (
          <View key={field.label} className="mb-4">
            <Text className="text-gray-900 dark:text-white font-medium mb-1">
              {field.label}
              {field.required && <Text className="text-red-500"> *</Text>}
            </Text>
            <View
              className={`bg-white dark:bg-gray-800 rounded-lg p-3 border ${
                errors[field.label]
                  ? "border-red-500"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              {field.options?.map((option, index) => (
                <Pressable
                  key={index}
                  className="flex-row items-center py-2"
                  onPress={() => handleInputChange(field.label, option.value)}
                >
                  <View className="w-5 h-5 rounded-full border border-gray-400 mr-3 items-center justify-center">
                    {formData[field.label] === option.value && (
                      <View className="w-3 h-3 rounded-full bg-blue-500" />
                    )}
                  </View>
                  <Text className="text-gray-900 dark:text-white">
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            {errors[field.label] && (
              <Text className="text-red-500 text-sm mt-1">
                {errors[field.label]}
              </Text>
            )}
          </View>
        );

      case "checkbox":
        return (
          <View key={field.label} className="mb-4">
            <View className="flex-row items-center">
              <Switch
                value={formData[field.label] || false}
                onValueChange={(value) => handleInputChange(field.label, value)}
                trackColor={{ false: "#E5E7EB", true: "#3B82F6" }}
                thumbColor="#FFFFFF"
              />
              <Text className="text-gray-900 dark:text-white font-medium ml-3">
                {field.label}
                {field.required && <Text className="text-red-500"> *</Text>}
              </Text>
            </View>
            {errors[field.label] && (
              <Text className="text-red-500 text-sm mt-1">
                {errors[field.label]}
              </Text>
            )}
          </View>
        );

      case "multiselect":
        return (
          <View key={field.label} className="mb-4">
            <Text className="text-gray-900 dark:text-white font-medium mb-1">
              {field.label}
              {field.required && <Text className="text-red-500"> *</Text>}
            </Text>
            <View
              className={`bg-white dark:bg-gray-800 rounded-lg p-3 border ${
                errors[field.label]
                  ? "border-red-500"
                  : "border-gray-200 dark:border-gray-700"
              }`}
            >
              {field.options?.map((option, index) => (
                <Pressable
                  key={index}
                  className="flex-row items-center py-2"
                  onPress={() =>
                    handleMultiSelectChange(field.label, option.value)
                  }
                >
                  <View className="w-5 h-5 rounded border border-gray-400 mr-3 items-center justify-center">
                    {multiSelectValues[field.label]?.includes(option.value) && (
                      <Feather name="check" size={16} color="#3B82F6" />
                    )}
                  </View>
                  <Text className="text-gray-900 dark:text-white">
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            {errors[field.label] && (
              <Text className="text-red-500 text-sm mt-1">
                {errors[field.label]}
              </Text>
            )}
          </View>
        );

      case "date":
        return (
          <View key={field.label} className="mb-4">
            <Text className="text-gray-900 dark:text-white font-medium mb-1">
              {field.label}
              {field.required && <Text className="text-red-500"> *</Text>}
            </Text>
            <Pressable
              className={`bg-white dark:bg-gray-800 rounded-lg px-4 py-3 border ${
                errors[field.label]
                  ? "border-red-500"
                  : "border-gray-200 dark:border-gray-700"
              }`}
              onPress={() => {
                setDatePickerField(field.label);
                setShowDatePicker(true);
              }}
            >
              <Text className="text-gray-900 dark:text-white">
                {formData[field.label]?.toDateString() || "Select date"}
              </Text>
            </Pressable>
            {showDatePicker && datePickerField === field.label && (
              <DateTimePicker
                value={formData[field.label] || new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
            {errors[field.label] && (
              <Text className="text-red-500 text-sm mt-1">
                {errors[field.label]}
              </Text>
            )}
          </View>
        );

      case "range":
        return (
          <View key={field.label} className="mb-4">
            <Text className="text-gray-900 dark:text-white font-medium mb-1">
              {field.label}: {formData[field.label]}
            </Text>
            <View className="flex-row items-center">
              <Text className="text-gray-500 dark:text-gray-400 mr-2">
                {field.min || 0}
              </Text>
              <View className="flex-1">
                <View className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <View
                    className="h-2 bg-blue-500 rounded-full"
                    style={{
                      width: `${((formData[field.label] - (field.min || 0)) / ((field.max || 10) - (field.min || 0))) * 100}%`,
                    }}
                  />
                </View>
              </View>
              <Text className="text-gray-500 dark:text-gray-400 ml-2">
                {field.max || 10}
              </Text>
            </View>
            <TextInput
              className="mt-2 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
              value={formData[field.label]?.toString()}
              onChangeText={(text) => {
                const num = parseInt(text) || field.min || 0;
                const clamped = Math.min(
                  Math.max(num, field.min || 0),
                  field.max || 10
                );
                handleInputChange(field.label, clamped);
              }}
              keyboardType="numeric"
            />
          </View>
        );

      case "color":
        return (
          <View key={field.label} className="mb-4">
            <Text className="text-gray-900 dark:text-white font-medium mb-1">
              {field.label}
            </Text>
            <View className="flex-row items-center">
              <View
                className="w-10 h-10 rounded border border-gray-300 mr-3"
                style={{ backgroundColor: formData[field.label] }}
              />
              <TextInput
                placeholder="#RRGGBB"
                placeholderTextColor={
                  colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                }
                className="flex-1 bg-white dark:bg-gray-800 rounded-lg px-4 py-2 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
                value={formData[field.label]}
                onChangeText={(text) => handleInputChange(field.label, text)}
              />
            </View>
          </View>
        );

      case "file":
        return (
          <View key={field.label} className="mb-4">
            <Text className="text-gray-900 dark:text-white font-medium mb-1">
              {field.label}
            </Text>
            <Pressable
              className="bg-blue-500 py-3 rounded-lg items-center"
              onPress={() =>
                Alert.alert(
                  "Info",
                  "File upload functionality would be implemented here"
                )
              }
            >
              <Text className="text-white font-medium">Choose File</Text>
            </Pressable>
          </View>
        );

      case "section":
        return (
          <View key={field.label} className="my-6">
            <Text className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              {field.label}
            </Text>
            {field.description && (
              <Text className="text-gray-500 dark:text-gray-400">
                {field.description}
              </Text>
            )}
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-gray-900 p-4">
      {/* Form Header */}
      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          {formSchema.title}
        </Text>
        {formSchema.description && (
          <Text className="text-gray-500 dark:text-gray-400 mt-1">
            {formSchema.description}
          </Text>
        )}
      </View>

      {/* Form Fields */}
      <View className="mb-6">
        {formSchema.fields.map((field) => renderField(field))}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        className="bg-blue-500 py-3 rounded-lg shadow-md mb-8"
        onPress={handleSubmit}
      >
        <Text className="text-white text-center font-bold">Submit Form</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default FormSubmissionScreen;
