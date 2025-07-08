import { Feather, FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useState } from "react";
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

const FormBuilderScreen = () => {
  const { colorScheme } = useColorScheme();
  const [formTitle, setFormTitle] = useState("My Form");
  const [formDescription, setFormDescription] = useState("");
  const [fields, setFields] = useState([]);
  const [editingField, setEditingField] = useState(null);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [newField, setNewField] = useState({
    type: "text",
    label: "",
    placeholder: "",
    required: false,
    options: [],
    validation: "",
  });

  const fieldTypes = [
    { id: "text", name: "Text Input", icon: "text-height" },
    { id: "number", name: "Number", icon: "hashtag" },
    { id: "email", name: "Email", icon: "at" },
    { id: "password", name: "Password", icon: "lock" },
    { id: "textarea", name: "Long Text", icon: "align-left" },
    { id: "select", name: "Dropdown", icon: "chevron-down" },
    { id: "radio", name: "Radio Buttons", icon: "dot-circle-o" },
    { id: "checkbox", name: "Checkbox", icon: "check-square-o" },
    { id: "date", name: "Date Picker", icon: "calendar" },
    { id: "file", name: "File Upload", icon: "upload" },
    { id: "section", name: "Section Header", icon: "header" },
  ];

  const addField = () => {
    if (!newField.label && newField.type !== "section") {
      Alert.alert("Error", "Field label is required");
      return;
    }

    if (editingField !== null) {
      // Update existing field
      const updatedFields = [...fields];
      updatedFields[editingField] = { ...newField };
      setFields(updatedFields);
      setEditingField(null);
    } else {
      // Add new field
      setFields([...fields, { ...newField, id: Date.now().toString() }]);
    }

    setNewField({
      type: "text",
      label: "",
      placeholder: "",
      required: false,
      options: [],
      validation: "",
    });
    setShowFieldModal(false);
  };

  const editField = (index) => {
    setEditingField(index);
    setNewField({ ...fields[index] });
    setShowFieldModal(true);
  };

  const removeField = (index) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  const moveField = (fromIndex, toIndex) => {
    const updatedFields = [...fields];
    const [movedField] = updatedFields.splice(fromIndex, 1);
    updatedFields.splice(toIndex, 0, movedField);
    setFields(updatedFields);
  };

  const addOption = () => {
    if (!newField.options) newField.options = [];
    setNewField({
      ...newField,
      options: [...newField.options, { label: "", value: "" }],
    });
  };

  const updateOption = (index, key, value) => {
    const updatedOptions = [...newField.options];
    updatedOptions[index][key] = value;
    setNewField({ ...newField, options: updatedOptions });
  };

  const removeOption = (index) => {
    const updatedOptions = [...newField.options];
    updatedOptions.splice(index, 1);
    setNewField({ ...newField, options: updatedOptions });
  };

  const handleSubmit = () => {
    const formSchema = {
      title: formTitle,
      description: formDescription,
      fields: fields.map((field) => ({
        type: field.type,
        label: field.label,
        placeholder: field.placeholder || "",
        required: field.required || false,
        options: field.options || [],
        validation: field.validation || "",
      })),
    };

    console.log("Form Schema:", formSchema);
    Alert.alert("Form Schema Created", "Check console for the output");
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <View className="bg-white dark:bg-gray-800 p-4 shadow-sm">
        <Text className="text-xl font-bold text-gray-900 pt-10 dark:text-white">
          Merelink Form Builder
        </Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Form Metadata */}
        <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Form Details
          </Text>

          <Text className="text-gray-900 dark:text-white font-medium mb-1">
            Title
          </Text>
          <TextInput
            placeholder="Form Title"
            placeholderTextColor={
              colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
            }
            className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-4 text-gray-900 dark:text-white mb-3"
            value={formTitle}
            onChangeText={setFormTitle}
          />

          <Text className="text-gray-900 dark:text-white font-medium mb-1">
            Description
          </Text>
          <TextInput
            placeholder="Form Description (optional)"
            placeholderTextColor={
              colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
            }
            className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-4 text-gray-900 dark:text-white"
            value={formDescription}
            onChangeText={setFormDescription}
            multiline
          />
        </View>

        {/* Form Fields List */}
        <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4 shadow-sm">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">
              Form Fields
            </Text>
            <TouchableOpacity
              className="bg-blue-500 p-2 rounded-full"
              onPress={() => {
                setEditingField(null);
                setShowFieldModal(true);
              }}
            >
              <Feather name="plus" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {fields.length === 0 ? (
            <View className="items-center justify-center py-8">
              <MaterialIcons
                name="info-outline"
                size={32}
                color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
              />
              <Text className="text-gray-500 dark:text-gray-400 mt-2">
                No fields added yet. Click the + button to add a field.
              </Text>
            </View>
          ) : (
            <View className="space-y-3 gap-5">
              {fields.map((field, index) => (
                <View
                  key={field.id || index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="font-medium text-gray-900 dark:text-white">
                      {field.label || `Field ${index + 1}`}
                    </Text>
                    <Text className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      {field.type}
                    </Text>
                  </View>

                  <View className="flex-row justify-end space-x-2">
                    <TouchableOpacity
                      className="p-1"
                      onPress={() => editField(index)}
                    >
                      <Feather
                        name="edit-2"
                        size={16}
                        color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="p-1"
                      onPress={() => removeField(index)}
                    >
                      <Feather name="trash-2" size={16} color="#EF4444" />
                    </TouchableOpacity>
                    {index > 0 && (
                      <TouchableOpacity
                        className="p-1"
                        onPress={() => moveField(index, index - 1)}
                      >
                        <Feather
                          name="arrow-up"
                          size={16}
                          color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
                        />
                      </TouchableOpacity>
                    )}
                    {index < fields.length - 1 && (
                      <TouchableOpacity
                        className="p-1"
                        onPress={() => moveField(index, index + 1)}
                      >
                        <Feather
                          name="arrow-down"
                          size={16}
                          color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          className="bg-blue-500 py-3 rounded-lg shadow-md"
          onPress={handleSubmit}
          disabled={fields.length === 0}
        >
          <Text className="text-white text-center font-bold">
            Generate Form Schema
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Field Configuration Modal */}
      {showFieldModal && (
        <View className="absolute inset-0 bg-black bg-opacity-50 justify-center p-4">
          <View className="bg-white dark:bg-gray-800 rounded-lg p-4 max-h-[80vh]">
            <ScrollView>
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingField !== null ? "Edit Field" : "Add New Field"}
                </Text>
                <TouchableOpacity onPress={() => setShowFieldModal(false)}>
                  <Feather
                    name="x"
                    size={24}
                    color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
                  />
                </TouchableOpacity>
              </View>

              {/* Field Type Selection */}
              <Text className="text-gray-900 dark:text-white font-medium mb-2">
                Field Type
              </Text>
              <View className="flex-row flex-wrap mb-4">
                {fieldTypes.map((type) => (
                  <Pressable
                    key={type.id}
                    className={`w-1/3 p-2 ${newField.type === type.id ? "bg-blue-100 dark:bg-blue-900/30" : ""}`}
                    onPress={() => setNewField({ ...newField, type: type.id })}
                  >
                    <View className="items-center">
                      <FontAwesome
                        name={type.icon}
                        size={20}
                        color={
                          newField.type === type.id
                            ? "#3B82F6"
                            : colorScheme === "dark"
                              ? "#9CA3AF"
                              : "#6B7280"
                        }
                      />
                      <Text
                        className={`text-xs mt-1 text-center ${
                          newField.type === type.id
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {type.name}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>

              {/* Field Label */}
              {newField.type !== "section" && (
                <>
                  <Text className="text-gray-900 dark:text-white font-medium mb-1">
                    Label
                  </Text>
                  <TextInput
                    placeholder="Field Label"
                    placeholderTextColor={
                      colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                    }
                    className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white mb-3"
                    value={newField.label}
                    onChangeText={(text) =>
                      setNewField({ ...newField, label: text })
                    }
                  />
                </>
              )}

              {/* Placeholder */}
              {!["section", "radio", "checkbox"].includes(newField.type) && (
                <>
                  <Text className="text-gray-900 dark:text-white font-medium mb-1">
                    Placeholder (optional)
                  </Text>
                  <TextInput
                    placeholder="Placeholder text"
                    placeholderTextColor={
                      colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                    }
                    className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 text-gray-900 dark:text-white mb-3"
                    value={newField.placeholder}
                    onChangeText={(text) =>
                      setNewField({ ...newField, placeholder: text })
                    }
                  />
                </>
              )}

              {/* Required Toggle */}
              {newField.type !== "section" && (
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-gray-900 dark:text-white font-medium">
                    Required Field
                  </Text>
                  <Switch
                    value={newField.required}
                    onValueChange={(value) =>
                      setNewField({ ...newField, required: value })
                    }
                    trackColor={{ false: "#E5E7EB", true: "#3B82F6" }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              )}

              {/* Options for select/radio/checkbox */}
              {["select", "radio", "checkbox"].includes(newField.type) && (
                <>
                  <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-gray-900 dark:text-white font-medium">
                      Options
                    </Text>
                    <TouchableOpacity
                      className="bg-blue-500 px-3 py-1 rounded-full"
                      onPress={addOption}
                    >
                      <Text className="text-white">Add Option</Text>
                    </TouchableOpacity>
                  </View>

                  {newField.options?.map((option, index) => (
                    <View key={index} className="flex-row mb-2">
                      <View className="flex-1 flex-row space-x-2">
                        <TextInput
                          placeholder="Label"
                          placeholderTextColor={
                            colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                          }
                          className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-4 text-gray-900 dark:text-white"
                          value={option.label}
                          onChangeText={(text) =>
                            updateOption(index, "label", text)
                          }
                        />
                        <TextInput
                          placeholder="Value"
                          placeholderTextColor={
                            colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                          }
                          className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-4 text-gray-900 dark:text-white"
                          value={option.value}
                          onChangeText={(text) =>
                            updateOption(index, "value", text)
                          }
                        />
                      </View>
                      <TouchableOpacity
                        className="p-2 ml-2"
                        onPress={() => removeOption(index)}
                      >
                        <Feather name="trash-2" size={16} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </>
              )}

              {/* Validation */}
              {!["section", "checkbox"].includes(newField.type) && (
                <>
                  <Text className="text-gray-900 dark:text-white font-medium mb-1">
                    Validation (optional)
                  </Text>
                  <TextInput
                    placeholder="Regex pattern or validation rule"
                    placeholderTextColor={
                      colorScheme === "dark" ? "#9CA3AF" : "#6B7280"
                    }
                    className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-4 text-gray-900 dark:text-white mb-3"
                    value={newField.validation}
                    onChangeText={(text) =>
                      setNewField({ ...newField, validation: text })
                    }
                  />
                </>
              )}

              <View className="flex-row justify-end gap-4 space-x-3 mt-4">
                <TouchableOpacity
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                  onPress={() => setShowFieldModal(false)}
                >
                  <Text className="text-gray-900 dark:text-white">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="px-4 py-2 bg-blue-500 rounded-lg"
                  onPress={addField}
                >
                  <Text className="text-white">
                    {editingField !== null ? "Update Field" : "Add Field"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

export default FormBuilderScreen;
