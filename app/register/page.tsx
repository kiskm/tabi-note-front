import { titleConfig } from "@/app/constants/ui";
import RegisterForm from "../components/RegisterForm";

const RegisterPage = async () => {
  return (
    <div className="mx-auto px-4 py-6 md:px-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold font-serif text-gray-900">
          {titleConfig.title}
        </h1>
      </div>
      <div className="flex justify-end">
        <div className="mb-4 mr-1 hidden md:block">
          <h1>ユーザ登録</h1>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
