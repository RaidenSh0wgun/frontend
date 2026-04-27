import { X } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  policy: "terms" | "privacy" | null;
  onClose: () => void;
}

export default function TermsModal({ isOpen, policy, onClose }: TermsModalProps) {
  if (!isOpen || !policy) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-2xl border border-red-500/30 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl shadow-red-500/20">
        <div className="sticky top-0 bg-slate-900 border-b border-red-500/30 flex items-center justify-between p-6">
          <h2 className="text-2xl font-bold text-white">
            {policy === "terms" ? "Terms and Conditions" : "Privacy Policy"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6 text-slate-300 text-sm leading-relaxed">
          {policy === "terms" ? (
            <>
              <section>
                <p>This license applies to the School Quiz App product. Source Code for the School Quiz App is available under the appropriate license. Additional information can be found in our documentation.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-2">SOFTWARE LICENSE TERMS</h3>
                <h4 className="text-base font-semibold text-white mb-2">SCHOOL QUIZ APP</h4>
                <p>These license terms are an agreement between you and the school or institution providing this app (or based on where you live, applicable affiliates). They apply to the software named above. The terms also apply to any updates or services for the app, except to the extent those have different terms.</p>
                <p>IF YOU COMPLY WITH THESE LICENSE TERMS, YOU HAVE THE RIGHTS BELOW.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-2">1. INSTALLATION AND USE RIGHTS.</h3>
                <p><strong>a. General.</strong> You may use the app to participate in quizzes and learning activities as permitted by your school.</p>
                <p><strong>b. Demo use.</strong> The uses permitted above include use of the app in educational demonstrations.</p>
                <p><strong>c. Third Party Components.</strong> The app may include third party components with separate legal notices or governed by other agreements.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-2">2. DATA.</h3>
                <p><strong>a. Data Collection.</strong> The app may collect information about your use for educational purposes. Data is handled in accordance with privacy laws.</p>
                <p><strong>b. Processing of Personal Data.</strong> Personal data is processed in compliance with applicable data protection regulations.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-2">3. UPDATES.</h3>
                <p>The app may be updated periodically. You agree to receive updates as provided by the school.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-2">4. FEEDBACK.</h3>
                <p>If you provide feedback, it may be used to improve the app.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-2">5. SCOPE OF LICENSE.</h3>
                <p>This license applies to the School Quiz App. The app is provided for educational use. You may not</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>cheat or violate quiz rules;</li>
                  <li>use the app for unauthorized purposes;</li>
                  <li>share, publish, or misuse the app.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-2">6. SUPPORT SERVICES.</h3>
                <p>Support is provided as available by the school.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-2">7. ENTIRE AGREEMENT.</h3>
                <p>This agreement constitutes the entire agreement for the app.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-2">8. APPLICABLE LAW.</h3>
                <p>Laws of the jurisdiction where the school is located apply.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-2">9. DISCLAIMER OF WARRANTY.</h3>
                <p>The app is provided "as is." No warranties are given.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-2">10. LIMITATION OF LIABILITY.</h3>
                <p>Liability is limited to the extent permitted by law.</p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h3 className="text-lg font-semibold text-white mb-2">PRIVACY POLICY</h3>
                <p>The app collects information to support student learning and quiz delivery. Collected data may include profile details, quiz responses, and device usage data.</p>
                <p>Information is used to provide and improve the app, to maintain academic integrity, and to comply with school policies.</p>
                <p>Personal data is not shared outside the school or its service providers except as required for app operation and legal obligations.</p>
                <p>By using the app, you consent to the collection and use of data as described here.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-2">DATA COLLECTION</h3>
                <p>We collect only the data needed for account access, quiz participation, and learning progress.</p>
                <p>Your quiz answers are stored securely and used for grading and teacher feedback.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-2">DATA USE</h3>
                <p>Collected information is used for app functionality, reporting, and educational analytics.</p>
                <p>The app does not sell personal data.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-2">DATA SHARING</h3>
                <p>Data may be shared with school administrators and authorized service providers only.</p>
                <p>Third parties receive data only when necessary for the app to operate.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-2">SECURITY</h3>
                <p>Data is protected with appropriate security measures and access controls.</p>
                <p>Schools are responsible for safeguarding student privacy and enforcing authorized access.</p>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-white mb-2">YOUR CHOICES</h3>
                <p>You may request access to or correction of your personal data through your school.</p>
                <p>Use of the app indicates acceptance of this privacy approach.</p>
              </section>
            </>) }
        </div>
      </div>
    </div>
  );
}
