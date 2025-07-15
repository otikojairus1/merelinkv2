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
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    fetchInvitations();
  }, []);

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

      setInvitations(response.data?.invitations || []);
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

  const handleAcceptInvitation = async (invitation: Invitation) => {
    setProcessingId(invitation.invitation_id);
    try {
      const token = await AsyncStorage.getItem(ASYNCKEYS.ACCESS_TOKEN);
      if (!token) {
        throw new Error("No access token found");
      }

      const response = await axios.post(
        `${BASE_URI}/api/organizations/accept-invitation`,
        { token: invitation.invitation_token },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Invitation accepted successfully!");
        // Refresh the invitations list
        await fetchInvitations();
        // Optionally navigate to the organization
        router.push(`/`);
      }
    } catch (error: any) {
      console.error("Error accepting invitation:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to accept invitation"
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeclineInvitation = async (invitationId: number) => {
    setProcessingId(invitationId);
    try {
      // Implement decline functionality if you have an endpoint
      // For now, just remove from local state
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      setInvitations(
        invitations.filter((i) => i.invitation_id !== invitationId)
      );
      Alert.alert("Success", "Invitation declined");
    } catch (error) {
      console.error("Error declining invitation:", error);
      Alert.alert("Error", "Failed to decline invitation");
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="px-6 pt-12 pb-6">
        <View className="flex-row items-center mb-6">
          <View className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full mr-4">
            <MaterialCommunityIcons
              name="email-outline"
              size={28}
              color={colorScheme === "dark" ? "#60A5FA" : "#3B82F6"}
            />
          </View>
          <View>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              Organization Invitations
            </Text>
            <Text className="text-gray-500 dark:text-gray-400">
              {invitations.length} pending invitation(s)
            </Text>
          </View>
        </View>
      </View>

      {/* Invitations List */}
      <View className="px-6 pb-6">
        {invitations.length === 0 ? (
          <View className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 items-center">
            <MaterialCommunityIcons
              name="email-remove-outline"
              size={48}
              color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
              className="mb-4"
            />
            <Text className="text-lg text-gray-500 dark:text-gray-400 text-center">
              No pending invitations
            </Text>
          </View>
        ) : (
          invitations.map((invitation) => (
            <View
              key={invitation.invitation_id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm shadow-black/10 dark:shadow-black/20 mb-4 overflow-hidden"
            >
              <View className="p-5">
                <View className="flex-row items-start mb-4">
                  <View className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded-lg mr-3">
                    <MaterialCommunityIcons
                      name="office-building-outline"
                      size={20}
                      color={colorScheme === "dark" ? "#60A5FA" : "#3B82F6"}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                      {invitation.organization_name}
                    </Text>
                    {invitation.organization_description && (
                      <Text className="text-gray-500 dark:text-gray-400 mt-1">
                        {invitation.organization_description}
                      </Text>
                    )}
                  </View>
                </View>

                <View className="space-y-2 ml-11">
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="account-outline"
                      size={16}
                      color={colorScheme === "dark" ? "#9CA3AF" : "#6B7280"}
                    />
                    <Text className="text-gray-600 dark:text-gray-300 ml-2">
                      Invited by {invitation.inviter_name}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
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
                      {formatDate(invitation.invited_at)}
                    </Text>
                  </View>
                </View>
              </View>

              <View className="border-t border-gray-100 dark:border-gray-700 flex-row">
                <TouchableOpacity
                  className={`flex-1 py-3 items-center justify-center ${
                    processingId === invitation.invitation_id
                      ? "opacity-70"
                      : ""
                  }`}
                  onPress={() =>
                    handleDeclineInvitation(invitation.invitation_id)
                  }
                  disabled={processingId === invitation.invitation_id}
                >
                  {processingId === invitation.invitation_id ? (
                    <ActivityIndicator color="#EF4444" />
                  ) : (
                    <Text className="text-red-500 dark:text-red-400 font-medium">
                      Decline
                    </Text>
                  )}
                </TouchableOpacity>

                <View className="w-px bg-gray-100 dark:bg-gray-700" />

                <TouchableOpacity
                  className={`flex-1 py-3 items-center justify-center bg-blue-50 dark:bg-blue-900/30 ${
                    processingId === invitation.invitation_id
                      ? "opacity-70"
                      : ""
                  }`}
                  onPress={() => handleAcceptInvitation(invitation)}
                  disabled={processingId === invitation.invitation_id}
                >
                  {processingId === invitation.invitation_id ? (
                    <ActivityIndicator color="#3B82F6" />
                  ) : (
                    <Text className="text-blue-600 dark:text-blue-400 font-medium">
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
