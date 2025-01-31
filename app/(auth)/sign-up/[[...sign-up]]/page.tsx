import { SignUp } from "@clerk/nextjs";

export default function Page() {
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
          redirectUrl="/home"
          appearance={{
            variables: {
              colorPrimary: "#4f83cc", // Primary color for buttons
              colorBackground: "#ffffff", // Background color
              colorText: "#333333", // Text color
              fontFamily: "Arial, sans-serif", // Custom font
            },
          }}
        />
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/sign-in" className="text-blue-500 hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}