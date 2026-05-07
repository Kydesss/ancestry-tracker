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
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* ambient warm gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed/40 via-surface to-tertiary-fixed/30 pointer-events-none" />

            <div className="relative w-full max-w-md bg-container-lowest rounded-md shadow-modal border border-outline-variant/60">
                {/* Title inside the box */}
                <div className="px-8 pt-8 pb-4 text-center border-b border-outline-variant/50">
                    <span className="label-meta block mb-1.5">A Digital Heirloom</span>
                    <h1 className="font-serif text-2xl font-semibold text-primary tracking-tight">
                        Rooted Heritage
                    </h1>
                </div>

                {/* Underline-style tabs */}
                <div className="flex border-b border-outline-variant/50">
                    <button
                        onClick={() => setMode("signin")}
                        className={`flex-1 px-4 py-3 font-sans text-sm font-semibold tracking-wide uppercase transition-all ${
                            mode === "signin"
                                ? "text-ink border-b-2 border-primary -mb-px"
                                : "text-ink-variant hover:text-ink"
                        }`}
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => setMode("signup")}
                        className={`flex-1 px-4 py-3 font-sans text-sm font-semibold tracking-wide uppercase transition-all ${
                            mode === "signup"
                                ? "text-ink border-b-2 border-primary -mb-px"
                                : "text-ink-variant hover:text-ink"
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
                                        "text-tertiary-accent font-semibold hover:underline",
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
                                        "text-tertiary-accent font-semibold hover:underline",
                                },
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
