import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { OnboardingSlide } from "../components/OnboardingSlides";
import { PaginationDots } from "../components/PaginationDots";

const slides = [
  {
    title: "Collect Data Easily",
    description: "Gather information seamlessly with our intuitive forms.",
    iconName: "cloud-upload",
  },
  {
    title: "Offline Support",
    description: "Work without internet. Data syncs when you’re back online.",
    iconName: "wifi-off",
  },
  {
    title: "Secure & Private",
    description: "Your data is encrypted and stored safely.",
    iconName: "lock",
  },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  // Inside the `goToNextSlide` function:
  const goToNextSlide = async () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      await AsyncStorage.setItem("@onboarding_completed", "true");
      //   router.replace("/home"); // Or navigate to your main app
    }
  };
  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      {/* Slides */}
      <OnboardingSlide {...slides[currentSlide]} />

      {/* Next Button */}
      <TouchableOpacity
        onPress={goToNextSlide}
        className="absolute bottom-10 right-6 bg-blue-500 px-6 py-3 rounded-full"
      >
        <Text className="text-white font-bold">
          {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
        </Text>
      </TouchableOpacity>

      {/* Pagination Dots */}
      <PaginationDots totalSlides={slides.length} currentSlide={currentSlide} />
    </View>
  );
}
