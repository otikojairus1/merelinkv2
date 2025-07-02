// src/features/onboarding/components/PaginationDots.tsx
import { View } from "react-native";

type PaginationProps = {
  totalSlides: number;
  currentSlide: number;
};

export const PaginationDots = ({
  totalSlides,
  currentSlide,
}: PaginationProps) => {
  return (
    <View className="flex-row justify-center mt-8">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <View
          key={index}
          className={`h-2 w-2 mx-1 rounded-full ${
            index === currentSlide ? "bg-blue-500" : "bg-gray-300"
          }`}
        />
      ))}
    </View>
  );
};
