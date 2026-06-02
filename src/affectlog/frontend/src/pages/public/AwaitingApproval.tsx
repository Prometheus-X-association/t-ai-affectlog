import React from "react";
import { Clock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { PublicHeader } from "../../components/public/PublicHeader";
import { PublicFooter } from "../../components/public/PublicFooter";

export default function AwaitingApproval() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950">
      <PublicHeader />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg text-center">
          <div className="w-16 h-16 bg-indigo-900/40 border border-indigo-700/40 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Clock size={28} className="text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Registration received</h1>
          <p className="text-slate-400 mb-6 leading-relaxed">
            Your access request has been submitted and is awaiting administrator review.
            You will receive an email once your account has been approved or if additional information is needed.
          </p>
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 mb-6 text-sm text-slate-400 flex items-start gap-3">
            <Mail size={16} className="text-indigo-400 flex-shrink-0 mt-0.5" />
            <span>
              Check your inbox for a confirmation email. Reviews typically take 1–3 business days.
              If you have not heard back in 5 days, contact the platform administrators.
            </span>
          </div>
          <Link to="/" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
            Return to homepage
          </Link>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
