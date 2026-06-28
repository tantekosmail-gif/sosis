import AuthLayout from "@/components/layout/AuthLayout";
import Footer from "@/features/auth/components/Footer";
import LoginForm from "@/features/auth/components/LoginForm";
import Logo from "@/features/auth/components/Logo";
import SocialLogin from "@/features/auth/components/SocialLogin";

export default function LoginPage() {
  return (
    <AuthLayout>
      <Logo />
      <LoginForm />
      <SocialLogin />
      <Footer />
    </AuthLayout>
  );
}
