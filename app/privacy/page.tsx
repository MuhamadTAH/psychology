// 🧠 FILE PURPOSE
// This page displays the privacy policy for DuoLearn.
// Required for app store submissions and good user transparency.

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Step 1: Header section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-600">Last updated: November 22, 2025</p>
        </div>

        {/* Step 2: Introduction */}
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed">
            DuoLearn ("we", "our", or "us") is committed to protecting your privacy.
            This Privacy Policy explains how we collect, use, disclose, and safeguard
            your information when you use our mobile application and website.
          </p>
        </section>

        {/* Step 3: Information we collect */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">1.1 Personal Information</h3>
          <p className="text-gray-700 mb-4">
            When you create an account, we collect:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
            <li>Email address</li>
            <li>Name (optional)</li>
            <li>Profile picture (optional)</li>
            <li>Authentication credentials</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">1.2 Usage Information</h3>
          <p className="text-gray-700 mb-4">
            We automatically collect:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
            <li>Learning progress and lesson completion data</li>
            <li>Quiz and test results</li>
            <li>XP, gems, hearts, and streak information</li>
            <li>Character customization preferences</li>
            <li>Notes and bookmarks you create</li>
            <li>Time spent on lessons and activities</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">1.3 Device Information</h3>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
            <li>Device type and model</li>
            <li>Operating system version</li>
            <li>Browser type and version</li>
            <li>IP address</li>
            <li>App version</li>
          </ul>
        </section>

        {/* Step 4: How we use information */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-700 mb-4">We use the collected information to:</p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
            <li>Provide and maintain our learning services</li>
            <li>Track your progress and personalize your learning experience</li>
            <li>Calculate and display XP, streaks, and achievements</li>
            <li>Enable social features like leaderboards and following</li>
            <li>Send you notifications about streaks and lessons (if enabled)</li>
            <li>Improve our app and develop new features</li>
            <li>Analyze usage patterns to optimize content</li>
            <li>Prevent fraud and ensure security</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        {/* Step 5: Third-party services */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Third-Party Services</h2>
          <p className="text-gray-700 mb-4">We use the following third-party services:</p>

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Clerk (Authentication)</h3>
              <p className="text-gray-700 mb-2">
                Manages user authentication and account security.
              </p>
              <a
                href="https://clerk.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Clerk Privacy Policy
              </a>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Convex (Database)</h3>
              <p className="text-gray-700 mb-2">
                Stores your learning data, progress, and user information.
              </p>
              <a
                href="https://www.convex.dev/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Convex Privacy Policy
              </a>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">OpenAI (Content Generation)</h3>
              <p className="text-gray-700 mb-2">
                Used for AI-powered lesson content generation (if applicable).
              </p>
              <a
                href="https://openai.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                OpenAI Privacy Policy
              </a>
            </div>
          </div>
        </section>

        {/* Step 6: Data sharing */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
          <p className="text-gray-700 mb-4">
            We do not sell your personal information. We may share your information in these situations:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
            <li><strong>Public Information:</strong> Your profile, XP, and leaderboard position may be visible to other users if you enable social features</li>
            <li><strong>Service Providers:</strong> Third-party services listed above that help us operate the app</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            <li><strong>Business Transfers:</strong> In case of merger, acquisition, or asset sale</li>
          </ul>
        </section>

        {/* Step 7: Data security */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
          <p className="text-gray-700 mb-4">
            We implement security measures to protect your information:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
            <li>Encryption in transit (HTTPS/TLS)</li>
            <li>Encryption at rest for sensitive data</li>
            <li>Secure authentication via Clerk</li>
            <li>Regular security audits</li>
            <li>Access controls and monitoring</li>
          </ul>
          <p className="text-gray-700">
            However, no method of transmission over the internet is 100% secure.
            We cannot guarantee absolute security.
          </p>
        </section>

        {/* Step 8: Your rights */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Privacy Rights</h2>
          <p className="text-gray-700 mb-4">You have the right to:</p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Update or correct your information</li>
            <li><strong>Deletion:</strong> Request deletion of your account and data</li>
            <li><strong>Export:</strong> Download your learning data</li>
            <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
            <li><strong>Withdraw Consent:</strong> Disable optional data collection</li>
          </ul>
          <p className="text-gray-700">
            To exercise these rights, contact us at privacy@duolearn.com
          </p>
        </section>

        {/* Step 9: Data retention */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Data Retention</h2>
          <p className="text-gray-700 mb-4">
            We retain your information for as long as:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
            <li>Your account is active</li>
            <li>Needed to provide services</li>
            <li>Required by law</li>
          </ul>
          <p className="text-gray-700">
            When you delete your account, we delete your personal information within 30 days,
            except where retention is required by law.
          </p>
        </section>

        {/* Step 10: Children's privacy */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
          <p className="text-gray-700">
            Our service is intended for users aged 13 and above. We do not knowingly
            collect personal information from children under 13. If you believe we have
            collected information from a child under 13, please contact us immediately.
          </p>
        </section>

        {/* Step 11: International users */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
          <p className="text-gray-700">
            Your information may be transferred to and processed in countries other than
            your own. We ensure appropriate safeguards are in place to protect your data
            in accordance with this Privacy Policy.
          </p>
        </section>

        {/* Step 12: Cookies and tracking */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Cookies and Tracking</h2>
          <p className="text-gray-700 mb-4">
            We use cookies and similar technologies to:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
            <li>Keep you logged in</li>
            <li>Remember your preferences</li>
            <li>Analyze app usage</li>
            <li>Improve performance</li>
          </ul>
          <p className="text-gray-700">
            You can control cookies through your browser settings.
          </p>
        </section>

        {/* Step 13: Changes to policy */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
          <p className="text-gray-700">
            We may update this Privacy Policy periodically. We will notify you of
            significant changes by email or in-app notification. Continued use of
            the service after changes constitutes acceptance of the updated policy.
          </p>
        </section>

        {/* Step 14: Contact information */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have questions about this Privacy Policy or our data practices:
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>Email:</strong> privacy@duolearn.com
            </p>
            <p className="text-gray-700">
              <strong>Support:</strong> support@duolearn.com
            </p>
          </div>
        </section>

        {/* Step 15: Footer navigation */}
        <div className="pt-8 border-t border-gray-200">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

// ✅ In this page we achieved:
// Complete privacy policy covering all major aspects
// Clear sections for easy reading
// Links to third-party privacy policies
// Contact information for privacy requests
// Professional formatting and structure
