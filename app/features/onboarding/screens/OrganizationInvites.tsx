import { ASYNCKEYS, BASE_URI } from "@/BASE_URI";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

interface Invitation {
  invitation_id: number;
  organization_id: number;
  organization_name: string;
  organization_description: string;
  inviter_id: number;
  inviter_name: string;
  inviter_email: string;
  role: string;
  invited_at: string;
  invitation_token: string;
}

export default function InvitationsScreen() {
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const token = await AsyncStorage.getItem(ASYNCKEYS.ACCESS_TOKEN);
        if (!token) {
          throw new Error("No access token found");
        }

        const response = await axios.get(
          `${BASE_URI}/api/organizations/received-invitation`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data && response.data.invitations) {
          setInvitations(response.data.invitations);
        }
      } catch (error: any) {
        console.error("Error fetching invitations:", error);
        Alert.alert(
          "Error",
          error.response?.data?.message || "Failed to fetch invitations"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInvitations();
  }, []);

  const handleAcceptInvitation = async (
    invitationId: number,
    token: string
  ) => {
    setProcessing(invitationId);
    try {
      const accessToken = await AsyncStorage.getItem(ASYNCKEYS.ACCESS_TOKEN);
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await axios.post(
        `${BASE_URI}/api/organizations/accept-invitation`,
        { invitation_token: token },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Invitation accepted successfully!");
        // Remove the accepted invitation from the list
        setInvitations(
          invitations.filter((i) => i.invitation_id !== invitationId)
        );
      } else {
        throw new Error("Failed to accept invitation");
      }
    } catch (error: any) {
      console.error("Error accepting invitation:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to accept invitation"
      );
    } finally {
      setProcessing(null);
    }
  };

  const handleDeclineInvitation = async (
    invitationId: number,
    token: string
  ) => {
    setProcessing(invitationId);
    try {
      const accessToken = await AsyncStorage.getItem(ASYNCKEYS.ACCESS_TOKEN);
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const response = await axios.post(
        `${BASE_URI}/api/organizations/decline-invitation`,
        { invitation_token: token },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Invitation declined successfully!");
        // Remove the declined invitation from the list
        setInvitations(
          invitations.filter((i) => i.invitation_id !== invitationId)
        );
      } else {
        throw new Error("Failed to decline invitation");
      }
    } catch (error: any) {
      console.error("Error declining invitation:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to decline invitation"
      );
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // SVG Icon
  const OutlinedInvitation = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <Path
        d="M22 16v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-2m18 0V8a2 2 0 0 0-2-2h-6M22 16H2m10-10V2m0 4H8a2 2 0 0 0-2 2v10"
        stroke={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-white dark:bg-gray-900 justify-center items-center">
        <ActivityIndicator size="large" />
        <Text className="mt-4 text-gray-900 dark:text-white">
          Loading invitations...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-gray-900"
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      {/* Header */}
      <View className="items-center px-8 pt-16 pb-4">
        <View className="bg-blue-100 dark:bg-blue-900/30 p-5 rounded-full mb-4">
          <MaterialCommunityIcons
            name="email-outline"
            size={40}
            color={colorScheme === "dark" ? "#60A5FA" : "#3B82F6"}
          />
        </View>
        <Text className="text-3xl font-bold text-gray-900 dark:text-white text-center">
          Organization Invitations
        </Text>
        <Text className="text-lg text-gray-500 dark:text-gray-400 mt-2 text-center">
          {invitations.length > 0
            ? "You have pending invitations"
            : "No pending invitations"}
        </Text>
      </View>

      {/* Invitations List */}
      <View className="bg-gray-50 dark:bg-gray-800 rounded-t-3xl p-8 shadow-lg shadow-black/10 dark:shadow-black/20">
        {invitations.length === 0 ? (
          <View className="items-center py-8">
            <OutlinedInvitation />
            <Text className="text-gray-500 dark:text-gray-400 mt-4 text-center">
              You don't have any pending invitations
            </Text>
          </View>
        ) : (
          invitations.map((invitation) => (
            <View
              key={invitation.invitation_id}
              className="mb-6 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
            >
              <View className="flex-row items-start mb-3">
                <View className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-full mr-3">
                  <MaterialCommunityIcons
                    name="office-building"
                    size={20}
                    color={colorScheme === "dark" ? "#60A5FA" : "#3B82F6"}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                    {invitation.organization_name}
                  </Text>
                  {invitation.organization_description && (
                    <Text className="text-gray-600 dark:text-gray-300 mt-1">
                      {invitation.organization_description}
                    </Text>
                  )}
                </View>
              </View>

              <View className="border-t border-gray-200 dark:border-gray-600 pt-3 mt-3">
                <View className="flex-row items-center mb-2">
                  <MaterialCommunityIcons
                    name="account-outline"
                    size={16}
                    color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
                  />
                  <Text className="text-gray-600 dark:text-gray-300 ml-2">
                    Invited by: {invitation.inviter_name} (
                    {invitation.inviter_email})
                  </Text>
                </View>

                <View className="flex-row items-center mb-2">
                  <MaterialCommunityIcons
                    name="shield-account-outline"
                    size={16}
                    color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
                  />
                  <Text className="text-gray-600 dark:text-gray-300 ml-2">
                    Role: {invitation.role}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={16}
                    color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
                  />
                  <Text className="text-gray-600 dark:text-gray-300 ml-2">
                    Invited on: {formatDate(invitation.invited_at)}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between mt-4">
                <TouchableOpacity
                  onPress={() =>
                    handleDeclineInvitation(
                      invitation.invitation_id,
                      invitation.invitation_token
                    )
                  }
                  disabled={processing === invitation.invitation_id}
                  className={`bg-red-100 dark:bg-red-900/20 px-4 py-2 rounded-lg flex-1 mr-2 ${
                    processing === invitation.invitation_id ? "opacity-70" : ""
                  }`}
                >
                  {processing === invitation.invitation_id ? (
                    <ActivityIndicator color="#EF4444" />
                  ) : (
                    <Text className="text-red-600 dark:text-red-400 text-center font-medium">
                      Decline
                    </Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    handleAcceptInvitation(
                      invitation.invitation_id,
                      invitation.invitation_token
                    )
                  }
                  disabled={processing === invitation.invitation_id}
                  className={`bg-blue-600 dark:bg-blue-500 px-4 py-2 rounded-lg flex-1 ml-2 ${
                    processing === invitation.invitation_id ? "opacity-70" : ""
                  }`}
                >
                  {processing === invitation.invitation_id ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text className="text-white text-center font-medium">
                      Accept
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}
