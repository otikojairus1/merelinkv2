import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export type SlideProps = {
  title: string;
  description: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
};

export const OnboardingSlide = ({
  title,
  description,
  iconName,
}: SlideProps) => {
  return (
    <View className="flex-1 items-center justify-center p-6 bg-white dark:bg-gray-900">
      {/* Illustration */}
      <View className="mb-8 p-4 bg-blue-100 dark:bg-blue-900 rounded-full">
        <MaterialIcons name={iconName} size={80} color="#3b82f6" />
      </View>

      {/* Text */}
      <Text className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-4">
        {title}
      </Text>
      <Text className="text-lg text-center text-gray-600 dark:text-gray-300">
        {description}
      </Text>
    </View>
  );
};
