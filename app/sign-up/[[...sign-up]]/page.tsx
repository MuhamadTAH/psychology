// 🧠 FILE PURPOSE
// This is the sign-up page using Clerk authentication.
// It provides a pre-built sign-up UI component from Clerk.

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f1419]">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-xl"
          }
        }}
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        afterSignUpUrl="/dark-psychology-dashboard"
        redirectUrl="/dark-psychology-dashboard"
      />
    </div>
  );
}
