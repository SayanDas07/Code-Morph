
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
 

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-blue-900 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-4xl font-extrabold text-center text-blue-500 mb-6">
          Create an Account
        </h1>
        <SignUp
          path="/sign-up"
          routing="path"
          signInUrl="/sign-in"
          redirectUrl="/continue"
        />
      </div>
    </div>
  );
}
