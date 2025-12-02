// 🧠 FILE PURPOSE
// This is the sign-in page using Clerk authentication.
// It provides a pre-built sign-in UI component from Clerk.

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f1419]">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-xl"
          }
        }}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/learn"
        redirectUrl="/learn"
      />
    </div>
  );
}
