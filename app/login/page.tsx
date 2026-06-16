import { titleConfig } from "@/app/constants/ui";
import LoginForm from "@/app/components/LoginForm";

const LoginPage = async () => {
  return (
    <div className="mx-auto px-4 py-6 md:px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold font-serif text-gray-900">
          {titleConfig.title}
        </h1>
      </div>
      <div className="flex justify-end">
        <div className="mb-4 mr-1">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
