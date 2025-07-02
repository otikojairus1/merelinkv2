import { Text, View } from "react-native";
import "../global.css";

export default function Index() {
  return (
    <View className="bg-white dark:bg-gray-800">
      <Text className="text-gray-800 dark:text-gray-50">
        Hello, themed world!
      </Text>
    </View>
  );
}
