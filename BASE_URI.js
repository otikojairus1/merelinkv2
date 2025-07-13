import AsyncStorage from "@react-native-async-storage/async-storage";

// Base API URL
const BASE_URI = "https://merelink.io/merelinkv2-api/public";

// const BASE_URI = "https://c8e0f9b2506f.ngrok-free.app";

// AsyncStorage keys
const ASYNCKEYS = {
  USER: "USER",
  ONBOARDING_STEP: "ONBOARDING_STEP",
  ACCESS_TOKEN: "ACCESS_TOKEN",
  CURRENT_ORGANIZATION:"CURRENT_ORGANIZATION"
};

// Improved token retrieval with proper typing
const getAccessToken = async () => {
  try {
    const token = await AsyncStorage.getItem(ASYNCKEYS.ACCESS_TOKEN);
    if (!token) {
      throw new Error("No access token found");
    }
    return token.toString(); // Ensure it's a string
  } catch (error) {
    console.error("Failed to retrieve access token:", error);
    throw error; // Re-throw to let calling code handle it
  }
};

// Helper function to safely get any AsyncStorage value
const getAsyncValue = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(`Failed to retrieve ${key}:`, error);
    return null;
  }
};

// Helper function to safely set any AsyncStorage value
const setAsyncValue = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to set ${key}:`, error);
    throw error;
  }
};

export { ASYNCKEYS, BASE_URI, getAccessToken, getAsyncValue, setAsyncValue };
