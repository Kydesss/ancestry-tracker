import { SignIn, SignUp, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useState } from "react";

const ROOTED_HERITAGE = {
    variables: {
        colorPrimary: "#061b0e",
        colorText: "#1b1c1c",
        colorTextSecondary: "#434843",
        colorTextOnPrimaryBackground: "#ffffff",
        colorBackground: "#ffffff",
        colorInputBackground: "#ffffff",
        colorInputText: "#1b1c1c",
        colorNeutral: "#434843",
        colorDanger: "#ba1a1a",
        colorSuccess: "#364c3c",
        colorWarning: "#a98e6e",
        colorShimmer: "rgba(6,27,14,0.06)",
        fontFamily: "'Manrope', ui-sans-serif, system-ui, sans-serif",
        fontFamilyButtons: "'Manrope', ui-sans-serif, system-ui, sans-serif",
        fontSize: "0.9375rem",
        fontWeight: { normal: 400, medium: 500, semibold: 600, bold: 700 },
        borderRadius: "0.5rem",
        spacingUnit: "1rem",
    },
    elements: {
        rootBox: "w-full",
        cardBox:
            "!shadow-none !border-0 !bg-transparent !rounded-none !overflow-visible !p-0 w-full",
        card: "!shadow-none !border-0 !bg-transparent !p-0 w-full",
        header: "hidden",
        headerTitle: "hidden",
        headerSubtitle: "hidden",
        logoBox: "hidden",
        main: "gap-4",
        form: "gap-4",
        formFieldRow: "gap-1.5",
        formFieldLabel:
            "font-sans !text-label-sm !uppercase !tracking-wider !text-ink-variant !font-semibold",
        formFieldLabelRow: "mb-1.5",
        formFieldInput:
            "block w-full !rounded !border !border-outline-variant !bg-container-lowest " +
            "!px-3.5 !py-2.5 !text-sm !text-ink !shadow-inset-paper " +
            "placeholder:!text-ink-variant/60 " +
            "focus:!outline-none focus:!ring-2 focus:!ring-primary-300 focus:!border-primary " +
            "transition-colors",
        formFieldInputShowPasswordButton:
            "!text-ink-variant hover:!text-primary transition-colors",
        formFieldAction:
            "!text-tertiary-accent !font-semibold !text-xs hover:!underline",
        formFieldHintText: "!text-xs !text-ink-variant/80",
        formFieldErrorText: "!text-xs !text-danger !font-medium",
        formFieldWarningText: "!text-xs !text-tertiary-accent",
        formFieldSuccessText: "!text-xs !text-primary",
        formButtonPrimary:
            "inline-flex items-center justify-center gap-2 w-full !px-5 !py-2.5 !rounded " +
            "!bg-primary !text-primary-on !font-semibold !text-sm !leading-5 !normal-case !tracking-normal " +
            "!shadow-embossed " +
            "hover:!bg-primary-700 hover:!shadow-card-hover " +
            "focus:!outline-none focus:!ring-2 focus:!ring-primary-300 focus:!ring-offset-2 focus:!ring-offset-surface " +
            "transition-all duration-200 " +
            "disabled:!opacity-50 disabled:!cursor-not-allowed disabled:!shadow-none " +
            "[&_.cl-buttonArrowIcon]:hidden",
        formButtonReset:
            "!text-ink-variant hover:!text-ink !font-medium !text-sm transition-colors",
        formResendCodeLink:
            "!text-tertiary-accent !font-semibold hover:!underline !text-sm",
        otpCodeFieldInput:
            "!border !border-outline-variant !bg-container-lowest !text-ink !rounded " +
            "!shadow-inset-paper focus:!ring-2 focus:!ring-primary-300 focus:!border-primary",
        socialButtonsBlockButton:
            "!border !border-outline-variant !bg-container-lowest !text-ink " +
            "!rounded !shadow-card hover:!shadow-card-hover hover:!bg-container-low " +
            "transition-all duration-200 !normal-case !font-semibold",
        socialButtonsBlockButtonText: "font-sans text-sm text-ink",
        socialButtonsProviderIcon: "opacity-90",
        dividerLine: "bg-outline-variant/60",
        dividerText:
            "font-sans text-label-sm uppercase tracking-wider text-ink-variant/80",
        identityPreview:
            "bg-container-low border border-outline-variant/60 rounded text-ink",
        identityPreviewText: "text-ink font-medium",
        identityPreviewEditButton:
            "text-tertiary-accent hover:text-primary transition-colors",
        alertText: "text-sm text-ink-variant",
        alert: "bg-container-low border border-outline-variant/60 rounded",
        footer: "hidden",
        footerAction: "hidden",
        footerActionText: "hidden",
        footerActionLink: "hidden",
        footerPagesLink: "hidden",
    },
    layout: {
        socialButtonsPlacement: "top",
        socialButtonsVariant: "blockButton",
        showOptionalFields: false,
    },
};

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
        <main className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none
          bg-[radial-gradient(circle_at_20%_15%,rgba(180,205,184,0.35),transparent_55%),radial-gradient(circle_at_85%_85%,rgba(224,194,159,0.28),transparent_50%)]"
            />

            <a
                href="/"
                className="relative mb-6 font-serif text-xl font-semibold text-primary tracking-tight
          hover:text-primary-700 transition-colors
          focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2 focus:ring-offset-surface rounded"
            >
                Rooted
            </a>

            <section
                aria-labelledby="auth-title"
                className="relative w-full max-w-md bg-container-lowest rounded-md shadow-modal border border-outline-variant/60"
            >
                <header className="px-8 pt-8 pb-5 text-center border-b border-outline-variant/50">
                    <span className="label-meta block mb-1.5">
                        A Digital Heirloom
                    </span>
                    <h1
                        id="auth-title"
                        className="font-serif text-2xl font-semibold text-primary tracking-tight"
                    >
                        {mode === "signin" ? "Welcome back" : "Begin your tree"}
                    </h1>
                    <p className="mt-2 text-sm text-ink-variant">
                        {mode === "signin"
                            ? "Open the family record where you left off."
                            : "Create the place your family's story will live."}
                    </p>
                </header>

                <div
                    role="tablist"
                    aria-label="Sign in or sign up"
                    className="flex border-b border-outline-variant/50"
                >
                    <ModeTab
                        active={mode === "signin"}
                        onClick={() => setMode("signin")}
                        controls="signin-panel"
                    >
                        Sign In
                    </ModeTab>
                    <ModeTab
                        active={mode === "signup"}
                        onClick={() => setMode("signup")}
                        controls="signup-panel"
                    >
                        Sign Up
                    </ModeTab>
                </div>

                <div className="px-7 sm:px-8 py-7">
                    {mode === "signin" ? (
                        <div
                            role="tabpanel"
                            id="signin-panel"
                            className="motion-safe:animate-fade-in"
                        >
                            <SignIn
                                routing="hash"
                                redirectUrl="/dashboard"
                                signUpUrl="/auth?mode=signup"
                                appearance={ROOTED_HERITAGE}
                            />
                        </div>
                    ) : (
                        <div
                            role="tabpanel"
                            id="signup-panel"
                            className="motion-safe:animate-fade-in"
                        >
                            <SignUp
                                routing="hash"
                                redirectUrl="/dashboard"
                                signInUrl="/auth?mode=signin"
                                appearance={ROOTED_HERITAGE}
                            />
                        </div>
                    )}
                </div>

                <footer className="px-8 py-4 border-t border-outline-variant/50 text-center">
                    <p className="text-xs text-ink-variant">
                        {mode === "signin" ? (
                            <>
                                New to Rooted?{" "}
                                <button
                                    type="button"
                                    onClick={() => setMode("signup")}
                                    className="font-semibold text-tertiary-accent hover:underline focus:outline-none focus:underline"
                                >
                                    Begin your tree
                                </button>
                            </>
                        ) : (
                            <>
                                Already keeping a record?{" "}
                                <button
                                    type="button"
                                    onClick={() => setMode("signin")}
                                    className="font-semibold text-tertiary-accent hover:underline focus:outline-none focus:underline"
                                >
                                    Sign in
                                </button>
                            </>
                        )}
                    </p>
                </footer>
            </section>

            <p className="relative mt-6 text-xs text-ink-variant/80 max-w-sm text-center px-4">
                By continuing you agree to our{" "}
                <a
                    href="/terms"
                    className="underline hover:text-primary transition-colors"
                >
                    Terms
                </a>{" "}
                and{" "}
                <a
                    href="/privacy"
                    className="underline hover:text-primary transition-colors"
                >
                    Privacy Policy
                </a>
                .
            </p>
        </main>
    );
}

function ModeTab({ active, onClick, controls, children }) {
    return (
        <button
            type="button"
            role="tab"
            aria-selected={active}
            aria-controls={controls}
            onClick={onClick}
            className={`flex-1 px-4 py-3 font-sans text-sm font-semibold tracking-wide uppercase transition-colors
        focus:outline-none focus-visible:bg-container-low
        ${
            active
                ? "text-ink border-b-2 border-primary -mb-px"
                : "text-ink-variant hover:text-ink"
        }`}
        >
            {children}
        </button>
    );
}
