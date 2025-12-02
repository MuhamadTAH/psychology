// 🧠 FILE PURPOSE
// This page displays the terms of service for DuoLearn.
// Required for app store submissions and legal protection.

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {/* Step 1: Header section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-600">Last updated: November 22, 2025</p>
        </div>

        {/* Step 2: Introduction */}
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed mb-4">
            Welcome to DuoLearn! These Terms of Service ("Terms") govern your access to
            and use of the DuoLearn application, website, and services (collectively, the "Service").
          </p>
          <p className="text-gray-700 leading-relaxed">
            By accessing or using our Service, you agree to be bound by these Terms. If you
            do not agree to these Terms, please do not use our Service.
          </p>
        </section>

        {/* Step 3: Acceptance of terms */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-700 mb-4">
            By creating an account or using DuoLearn, you confirm that:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
            <li>You are at least 13 years of age</li>
            <li>You have the legal capacity to enter into these Terms</li>
            <li>You will comply with all applicable laws and regulations</li>
            <li>All information you provide is accurate and current</li>
          </ul>
        </section>

        {/* Step 4: Account registration */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Account Registration</h2>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">2.1 Account Creation</h3>
          <p className="text-gray-700 mb-4">
            To access certain features, you must create an account. You agree to:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
            <li>Provide accurate, complete, and current information</li>
            <li>Maintain and update your information</li>
            <li>Keep your password secure and confidential</li>
            <li>Notify us immediately of any unauthorized access</li>
            <li>Accept responsibility for all activities under your account</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">2.2 Account Termination</h3>
          <p className="text-gray-700 mb-4">
            We reserve the right to suspend or terminate your account if you violate
            these Terms or engage in fraudulent, abusive, or illegal activity.
          </p>
        </section>

        {/* Step 5: User conduct */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Conduct</h2>
          <p className="text-gray-700 mb-4">You agree NOT to:</p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
            <li>Use the Service for any illegal or unauthorized purpose</li>
            <li>Violate any laws in your jurisdiction</li>
            <li>Harass, abuse, or harm other users</li>
            <li>Upload viruses, malware, or malicious code</li>
            <li>Attempt to hack, reverse engineer, or compromise the Service</li>
            <li>Scrape, copy, or download content using automated means</li>
            <li>Impersonate another person or entity</li>
            <li>Share your account with others</li>
            <li>Create multiple accounts to abuse features</li>
            <li>Sell, trade, or transfer your account</li>
          </ul>
        </section>

        {/* Step 6: Intellectual property */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Intellectual Property</h2>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">4.1 Our Content</h3>
          <p className="text-gray-700 mb-4">
            All content, features, and functionality of the Service, including but not
            limited to text, graphics, logos, icons, images, audio, video, lessons, and
            software, are owned by DuoLearn or our licensors and are protected by
            copyright, trademark, and other intellectual property laws.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">4.2 Your Content</h3>
          <p className="text-gray-700 mb-4">
            You retain ownership of content you create (notes, bookmarks, etc.). By
            using the Service, you grant us a worldwide, non-exclusive, royalty-free
            license to use, store, and display your content solely to provide the Service.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">4.3 Restrictions</h3>
          <p className="text-gray-700 mb-4">
            You may not reproduce, distribute, modify, create derivative works, publicly
            display, or exploit any part of the Service without our prior written permission.
          </p>
        </section>

        {/* Step 7: Purchases and payments */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Purchases and Payments</h2>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">5.1 Virtual Currency</h3>
          <p className="text-gray-700 mb-4">
            DuoLearn offers virtual currency (gems) and items (hearts, streak freezes,
            power-ups) that can be purchased with real money. Virtual currency and items:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
            <li>Have no real-world value</li>
            <li>Cannot be exchanged for real money</li>
            <li>Cannot be transferred between accounts</li>
            <li>Are non-refundable except as required by law</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">5.2 Pricing</h3>
          <p className="text-gray-700 mb-4">
            Prices are subject to change. We will notify you of significant price changes.
            Purchases are final and non-refundable except as required by applicable law.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">5.3 Refunds</h3>
          <p className="text-gray-700 mb-4">
            Refund requests must be made within 14 days of purchase. Contact
            support@duolearn.com with your purchase details.
          </p>
        </section>

        {/* Step 8: Service availability */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Service Availability</h2>
          <p className="text-gray-700 mb-4">
            We strive to provide reliable service, but we do not guarantee that:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
            <li>The Service will be uninterrupted or error-free</li>
            <li>Defects will be corrected immediately</li>
            <li>The Service will be available at all times</li>
            <li>Data will never be lost</li>
          </ul>
          <p className="text-gray-700">
            We reserve the right to modify, suspend, or discontinue the Service at any
            time with or without notice.
          </p>
        </section>

        {/* Step 9: Disclaimers */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Disclaimers</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="text-gray-800 font-semibold mb-2">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND.
            </p>
            <p className="text-gray-700">
              We disclaim all warranties, express or implied, including but not limited to
              implied warranties of merchantability, fitness for a particular purpose, and
              non-infringement.
            </p>
          </div>
          <p className="text-gray-700">
            We make no warranty that:
          </p>
          <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
            <li>The Service will meet your requirements</li>
            <li>The content is accurate or complete</li>
            <li>Using the Service will result in language proficiency</li>
            <li>Your data will be secure or backed up</li>
          </ul>
        </section>

        {/* Step 10: Limitation of liability */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
            <p className="text-gray-800 font-semibold mb-2">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW:
            </p>
            <p className="text-gray-700 mb-2">
              DuoLearn and its affiliates, officers, employees, agents, partners, and
              licensors shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages, including but not limited to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>Loss of profits, data, or goodwill</li>
              <li>Service interruption</li>
              <li>Computer damage or system failure</li>
              <li>Cost of substitute services</li>
            </ul>
          </div>
          <p className="text-gray-700">
            Our total liability shall not exceed the amount you paid us in the 12 months
            prior to the claim, or $100, whichever is greater.
          </p>
        </section>

        {/* Step 11: Indemnification */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Indemnification</h2>
          <p className="text-gray-700">
            You agree to defend, indemnify, and hold harmless DuoLearn and its affiliates
            from any claims, damages, losses, liabilities, and expenses (including legal
            fees) arising from:
          </p>
          <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
            <li>Your use of the Service</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any third-party rights</li>
            <li>Your content or conduct</li>
          </ul>
        </section>

        {/* Step 12: Privacy */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Privacy</h2>
          <p className="text-gray-700 mb-4">
            Your privacy is important to us. Please review our Privacy Policy to understand
            how we collect, use, and protect your information.
          </p>
          <a
            href="/privacy"
            className="text-blue-600 hover:text-blue-800 underline font-medium"
          >
            Read our Privacy Policy →
          </a>
        </section>

        {/* Step 13: Third-party links */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Third-Party Links and Services</h2>
          <p className="text-gray-700">
            The Service may contain links to third-party websites or services. We are not
            responsible for the content, privacy policies, or practices of third-party sites.
            Your use of third-party services is at your own risk.
          </p>
        </section>

        {/* Step 14: Dispute resolution */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Dispute Resolution</h2>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">12.1 Informal Resolution</h3>
          <p className="text-gray-700 mb-4">
            Before filing a claim, please contact us at support@duolearn.com to attempt
            to resolve the dispute informally.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">12.2 Governing Law</h3>
          <p className="text-gray-700 mb-4">
            These Terms shall be governed by and construed in accordance with the laws
            of [Your Jurisdiction], without regard to conflict of law principles.
          </p>

          <h3 className="text-xl font-semibold text-gray-800 mb-2">12.3 Arbitration</h3>
          <p className="text-gray-700 mb-4">
            Any dispute arising from these Terms shall be resolved through binding
            arbitration, except where prohibited by law.
          </p>
        </section>

        {/* Step 15: Changes to terms */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
          <p className="text-gray-700 mb-4">
            We reserve the right to modify these Terms at any time. We will notify you of
            material changes by:
          </p>
          <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-1">
            <li>Posting the updated Terms on this page</li>
            <li>Updating the "Last updated" date</li>
            <li>Sending an email notification (for significant changes)</li>
          </ul>
          <p className="text-gray-700">
            Your continued use of the Service after changes constitutes acceptance of the
            updated Terms.
          </p>
        </section>

        {/* Step 16: Severability */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Severability</h2>
          <p className="text-gray-700">
            If any provision of these Terms is found to be unenforceable or invalid, that
            provision will be limited or eliminated to the minimum extent necessary, and
            the remaining provisions will remain in full force and effect.
          </p>
        </section>

        {/* Step 17: Entire agreement */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Entire Agreement</h2>
          <p className="text-gray-700">
            These Terms, together with our Privacy Policy, constitute the entire agreement
            between you and DuoLearn regarding the Service and supersede all prior agreements.
          </p>
        </section>

        {/* Step 18: Contact information */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Contact Us</h2>
          <p className="text-gray-700 mb-4">
            If you have questions about these Terms:
          </p>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-gray-700">
              <strong>Email:</strong> legal@duolearn.com
            </p>
            <p className="text-gray-700">
              <strong>Support:</strong> support@duolearn.com
            </p>
          </div>
        </section>

        {/* Step 19: Acknowledgment */}
        <section className="mb-8">
          <div className="bg-gray-100 p-6 rounded-lg">
            <p className="text-gray-800 font-semibold mb-2">
              By using DuoLearn, you acknowledge that you have read, understood, and agree
              to be bound by these Terms of Service.
            </p>
            <p className="text-gray-700">
              Last updated: November 22, 2025
            </p>
          </div>
        </section>

        {/* Step 20: Footer navigation */}
        <div className="pt-8 border-t border-gray-200 flex gap-4">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Home
          </a>
          <span className="text-gray-400">|</span>
          <a
            href="/privacy"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}

// ✅ In this page we achieved:
// Complete terms of service covering all legal aspects
// Clear disclaimers and liability limitations
// Intellectual property protection
// User conduct guidelines
// Purchase and refund policies
// Dispute resolution procedures
