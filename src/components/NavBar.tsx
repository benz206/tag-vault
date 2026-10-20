import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession, signIn, signOut } from "next-auth/react";
import { buttonClass } from "@/components/buttons";
import ThemeToggle from "@/components/ThemeToggle";

function DiscordLogo() {
    return (
        <svg
            className="size-4"
            fill="currentColor"
            viewBox="0 -28.5 256 256"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid"
            aria-hidden="true"
        >
            <g>
                <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" />
            </g>
        </svg>
    );
}

function NavLink({ href, children }: { href: string; children: string }) {
    const { pathname } = useRouter();
    const active = pathname === href;
    return (
        <Link
            href={href}
            aria-current={active ? "page" : undefined}
            className={`px-3 py-1.5 text-[15px] rounded-md transition-colors hover:text-ink ${
                active ? "text-ink" : "text-ink-3"
            }`}
        >
            {children}
        </Link>
    );
}

export default function NavBar() {
    const { data } = useSession();
    const [profileOpen, setProfileOpen] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (navRef.current && !navRef.current.contains(event.target as Node)) {
            setProfileOpen(false);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [handleClickOutside]);

    const avatarSrc =
        data?.user?.image || "https://cdn.discordapp.com/embed/avatars/0.png";

    return (
        <nav className="sticky top-0 z-20 border-b border-line bg-canvas/90 backdrop-blur">
            <div className="flex items-center h-16 max-w-6xl gap-1 px-4 mx-auto sm:px-6">
                <Link
                    href="/"
                    className="flex items-center gap-2 mr-5 text-[17px] tracking-tight"
                >
                    <span className="grid font-mono text-xs font-bold text-white rounded-md size-6 place-items-center bg-linear-to-br from-pink-500 to-rose-600">
                        {"{}"}
                    </span>
                    Tag Vault
                </Link>
                <NavLink href="/search">Search</NavLink>
                {data && <NavLink href="/dashboard">Dashboard</NavLink>}
                <div className="flex items-center gap-3 ml-auto">
                    <ThemeToggle />
                    {data ? (
                        <div ref={navRef} className="relative">
                            <button
                                type="button"
                                onClick={() => setProfileOpen((v) => !v)}
                                aria-haspopup="menu"
                                aria-expanded={profileOpen}
                                aria-label="Account menu"
                                className="flex rounded-full"
                            >
                                <Image
                                    src={avatarSrc}
                                    className="rounded-full"
                                    alt=""
                                    width={28}
                                    height={28}
                                    unoptimized
                                />
                            </button>
                            {profileOpen && (
                                <div
                                    role="menu"
                                    className="absolute right-0 z-10 w-56 p-1 mt-2 bg-surface border rounded-xl shadow-lg shadow-stone-950/5 top-full border-line motion-safe:animate-drop"
                                >
                                    <p className="px-3 py-2 text-sm truncate text-muted">
                                        {data.user?.name}
                                    </p>
                                    <div className="h-px my-1 bg-line" />
                                    <Link
                                        href="/dashboard"
                                        role="menuitem"
                                        className="block px-3 py-2 text-sm rounded-md hover:bg-chip"
                                        onClick={() => setProfileOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        type="button"
                                        role="menuitem"
                                        className="block w-full px-3 py-2 text-sm text-left rounded-md hover:bg-chip"
                                        onClick={() =>
                                            signOut({ callbackUrl: "/" })
                                        }
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() =>
                                signIn("discord", { callbackUrl: "/dashboard" })
                            }
                            className={buttonClass("dark", "sm")}
                        >
                            <DiscordLogo />
                            Sign in
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}
