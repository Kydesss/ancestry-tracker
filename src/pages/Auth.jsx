import { SignIn, SignUp, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

export default function Auth() {
    const [searchParams] = useSearchParams();
    const [mode, setMode] = useState(
        searchParams.get("mode") === "signup" ? "signup" : "signin",
    );

    return (
        <>
            <SignedIn>
                <Navigate to="/dashboard" replace />
            </SignedIn>
            <SignedOut>
                <AuthCard mode={mode} setMode={setMode} />
            </SignedOut>
        </>
    );
}

function AuthCard({ mode, setMode }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-modal border border-gray-100">
                {/* Title inside the box */}
                <div className="px-8 pt-8 pb-4">
                    <h1 className="text-2xl font-bold text-primary-700 tracking-tight">
                        AncestryTracker
                    </h1>
                </div>

                {/* Minimal underline-style tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setMode("signin")}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                            mode === "signin"
                                ? "text-gray-900 border-b-2 border-primary-600 -mb-px"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => setMode("signup")}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-all ${
                            mode === "signup"
                                ? "text-gray-900 border-b-2 border-primary-600 -mb-px"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Form content in padded container */}
                <div className="px-8 py-6">
                    {mode === "signin" ? (
                        <SignIn
                            routing="hash"
                            redirectUrl="/dashboard"
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    card: "shadow-none border-0 bg-transparent p-0",
                                    headerTitle: "hidden",
                                    headerSubtitle: "hidden",
                                    formButtonPrimary:
                                        "btn-primary w-full justify-center",
                                    formFieldInput: "input",
                                    formFieldLabel: "label",
                                    footerActionLink:
                                        "text-primary-600 font-medium hover:underline",
                                },
                            }}
                        />
                    ) : (
                        <SignUp
                            routing="hash"
                            redirectUrl="/dashboard"
                            appearance={{
                                elements: {
                                    rootBox: "w-full",
                                    card: "shadow-none border-0 bg-transparent p-0",
                                    headerTitle: "hidden",
                                    headerSubtitle: "hidden",
                                    formButtonPrimary:
                                        "btn-primary w-full justify-center",
                                    formFieldInput: "input",
                                    formFieldLabel: "label",
                                    footerActionLink:
                                        "text-primary-600 font-medium hover:underline",
                                },
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
