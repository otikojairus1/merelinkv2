import { ASYNCKEYS, BASE_URI } from "@/BASE_URI";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { Skeleton } from "moti/skeleton";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
type Project = {
  id: string;
  name: string;
  progress: number;
  last_updated: string;
};

const ProjectsSection = ({ refreshSync }) => {
  const { colorScheme } = useColorScheme();

  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);

        const orgStr = await AsyncStorage.getItem(
          ASYNCKEYS.CURRENT_ORGANIZATION
        );
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

        // Transform API data to match your component's expected format
        const formattedProjects = response.data.data.map((project: any) => ({
          id: project.id,
          name: project.name,
          start_date: project.start_date,
          end_date: project.end_date,
          desc: project.description || "No description provided", // Default if not provided
          progress: project.progress || 0, // Default to 0 if not provided
          lastUpdated: formatLastUpdated(
            project.last_updated || project.created_at
          ),
          // Map other fields as needed
        }));

        setProjects(formattedProjects);
      } catch (err) {
        console.error(err);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [refreshSync]);

  const getProjectProgress = (project) => {
    const now = new Date();
    const start = new Date(project.start_date);
    const end = new Date(project.end_date);

    const totalDuration = end.getTime() - start.getTime();
    const elapsedDuration = now.getTime() - start.getTime();
    const progress = Math.min(
      100,
      Math.max(0, (elapsedDuration / totalDuration) * 100)
    );
    return String(Math.round(progress));
  };

  // Format the last updated time
  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 3600 * 24)
    );

    if (diffInDays < 1) return "Today";
    if (diffInDays < 2) return "Yesterday";
    if (diffInDays < 7) return `${Math.floor(diffInDays)} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading) {
    return (
      <View className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 ">
        <Skeleton colorMode={colorScheme} width={250} height={15} />
        <View className="h-2"></View>
        <Skeleton colorMode={colorScheme} width={150} height={15} />
        <View className="h-2"></View>
        <Skeleton colorMode={colorScheme} height={10} width={250} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <Text className="text-red-500 dark:text-red-400 text-center">
          {error}
        </Text>
      </View>
    );
  }

  if (projects.length === 0) {
    return (
      <View className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
        <Text className="text-gray-500 dark:text-gray-400 text-center">
          No projects found
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
      {projects.map((project) => (
        <TouchableOpacity
          // onPress={() => router.push(`/features/Home/Analytics`)}
          // onPress={() =>
          //   router.push({
          //     pathname: "/features/Home/Analytics",
          //     params: {
          //       project: JSON.stringify(project),
          //     },
          //   })
          // }
          key={project.id}
          className="py-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
        >
          <View className="flex-row justify-between items-center mb-1">
            <View>
              <Text className="font-medium text-gray-900 dark:text-white">
                {project.name}
              </Text>
              <Text className="text-sm my-1 text-gray-500 dark:text-gray-400">
                {`${project.desc.slice(0, 35)}...`}
              </Text>
            </View>

            <Text className="text-sm text-gray-500 dark:text-gray-400">
              {project.lastUpdated}
            </Text>
          </View>
          <View className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mt-2">
            <View
              className="h-full bg-blue-500 rounded-full"
              style={{ width: `${getProjectProgress(project)}%` }}
            />
          </View>
          <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {getProjectProgress(project)}% complete
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ProjectsSection;
