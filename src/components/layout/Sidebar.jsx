import { useClerk, useUser } from "@clerk/clerk-react";
import { Link, NavLink } from "react-router-dom";
import Avatar from "../ui/Avatar";
import useStore from "../../store/useStore";
import { useSubscription } from "../../hooks/useSubscription";

const navItems = [
    { label: "My Tree", icon: TreeIcon, href: "/dashboard" },
    {
        label: "Shared Trees",
        icon: ShareIcon,
        href: "/dashboard?view=shared",
        premium: true,
        comingSoon: true,
    },
    { label: "Settings", icon: SettingsIcon, href: "/dashboard?view=settings", comingSoon: true },
];

export default function Sidebar({ isOpen, onClose }) {
    const { signOut } = useClerk();
    const { user } = useUser();
    const subscriptionTier = useStore((s) => s.subscriptionTier);
    const setShowUpgradeModal = useStore((s) => s.setShowUpgradeModal);
    const setUpgradeFeature = useStore((s) => s.setUpgradeFeature);
    const showToast = useStore((s) => s.showToast);
    const { isPremium } = useSubscription();

    function handleSharedTrees(e) {
        if (!isPremium) {
            e.preventDefault();
            setUpgradeFeature("shared_trees");
            setShowUpgradeModal(true);
            onClose?.();
        }
    }

    function handleComingSoon(label) {
        showToast(`${label} will be available in a future version.`, "info");
        onClose?.();
    }

    return (
        <>
            {/* Mobile backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-ink/30 z-20 lg:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            <aside
                className={`
          fixed top-0 left-0 h-full w-64 bg-container-lowest border-r border-outline-variant/60 z-30 flex flex-col
          transition-transform duration-200 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
            >
                {/* Logo */}
                <div className="flex items-center justify-between h-16 px-5 border-b border-outline-variant/50 flex-shrink-0">
                    <Link
                        to="/"
                        onClick={onClose}
                        className="font-serif text-lg font-semibold text-primary tracking-tight"
                    >
                        Rooted
                    </Link>
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1.5 rounded hover:bg-container-low text-ink-variant transition-colors"
                    >
                        <svg
                            className="w-5 h-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>

                {/* User info */}
                <div className="flex items-center gap-3 px-4 py-4 border-b border-outline-variant/50">
                    <Avatar
                        src={user?.imageUrl}
                        name={
                            user?.fullName ||
                            user?.emailAddresses?.[0]?.emailAddress
                        }
                        size="md"
                    />
                    <div className="min-w-0 flex-1">
                        <p className="font-serif text-sm font-semibold text-ink truncate">
                            {user?.fullName || "Archivist"}
                        </p>
                        <p className="text-xs text-ink-variant truncate">
                            {user?.emailAddresses?.[0]?.emailAddress}
                        </p>
                    </div>
                </div>

                {/* Subscription badge */}
                <div className="px-4 pt-4 pb-1">
                    <span
                        className={
                            subscriptionTier === "premium"
                                ? "chip-tertiary"
                                : "chip-neutral"
                        }
                    >
                        {subscriptionTier === "premium"
                            ? "✦ Heirloom"
                            : "Free Trial"}
                    </span>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
                    {navItems.map(({ label, icon: Icon, href, premium, comingSoon }) => {
                        if (comingSoon) {
                            return (
                                <button
                                    key={label}
                                    type="button"
                                    onClick={() => handleComingSoon(label)}
                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded text-sm font-semibold text-ink-variant/70 transition-colors hover:bg-container-low hover:text-ink focus:bg-container-low focus:text-ink focus:outline-none focus:ring-2 focus:ring-primary-300"
                                    aria-label={`${label} is coming soon`}
                                >
                                    <Icon className="w-4 h-4 flex-shrink-0" />
                                    <span>{label}</span>
                                    <span className="ml-auto text-[11px] font-semibold uppercase tracking-wide text-ink-variant/70">
                                        Soon
                                    </span>
                                </button>
                            );
                        }

                        return (
                            <NavLink
                                key={label}
                                to={href}
                                onClick={
                                    premium && !isPremium
                                        ? handleSharedTrees
                                        : onClose
                                }
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded text-sm font-semibold transition-colors ${
                                        isActive
                                            ? "bg-primary-fixed text-primary"
                                            : "text-ink-variant hover:bg-container-low hover:text-ink"
                                    }`
                                }
                            >
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                <span>{label}</span>
                                {premium && !isPremium && (
                                    <svg
                                        className="w-3.5 h-3.5 ml-auto text-tertiary-accent"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                            </NavLink>
                        );
                    })}

                    {!isPremium && (
                        <button
                            onClick={() => {
                                setUpgradeFeature("general");
                                setShowUpgradeModal(true);
                                onClose?.();
                            }}
                            className="flex items-center gap-3 w-full px-3 py-2.5 rounded text-sm font-semibold text-tertiary-on-container hover:bg-tertiary-fixed transition-colors mt-2"
                        >
                            <svg
                                className="w-4 h-4 flex-shrink-0 text-tertiary-accent"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            Upgrade to Heirloom
                        </button>
                    )}
                </nav>

                {/* Logout */}
                <div className="p-3 border-t border-outline-variant/50">
                    <button
                        onClick={() => signOut()}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded text-sm font-medium text-ink-variant hover:bg-container-low hover:text-ink transition-colors"
                    >
                        <svg
                            className="w-4 h-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}

function TreeIcon({ className }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22V14" />
            <circle cx="12" cy="10" r="4" />
            <circle cx="6" cy="6" r="2.5" />
            <circle cx="18" cy="6" r="2.5" />
            <path d="M6 8.5v2a2 2 0 002 2h1.5M18 8.5v2a2 2 0 01-2 2h-1.5" />
        </svg>
    );
}

function ShareIcon({ className }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49" />
        </svg>
    );
}

function SettingsIcon({ className }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
    );
}
