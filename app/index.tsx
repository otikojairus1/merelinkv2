
import "../global.css";
import AnalyticsScreen from "./features/Home/Analytics";
import HomeScreen from "./features/Home/Homescreen";
import ProjectsList from "./features/Home/ProjectList";
import LoginScreen from "./features/onboarding/Login";
import OrganizationInviteScreen from "./features/onboarding/OrganizationInvite";
import ResetPasswordScreen from "./features/onboarding/ResetPassword";
import SignupScreen from "./features/onboarding/Signup";
import VerifyEmailScreen from "./features/onboarding/VerifyScreen";

export default function Index() {
  return <HomeScreen/>;
}
