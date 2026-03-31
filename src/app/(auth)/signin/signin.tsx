"use client";

import { SignInButton } from "@clerk/nextjs";

const SignInPage = () => {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#fff7e8_0%,#f9fafb_45%,#eff6ff_100%)] px-4 py-10 sm:px-8 sm:py-14 xl:px-16 xl:py-20 dark:bg-[radial-gradient(circle_at_top,#1c1f24_0%,#0b0d10_55%,#050608_100%)]">
            <div className="pointer-events-none absolute -top-10 left-10 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_top,#ffd59a,#f59e0b)] opacity-20 blur-3xl dark:opacity-25" />
            <div className="pointer-events-none absolute bottom-10 right-10 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_top,#93c5fd,#2563eb)] opacity-20 blur-3xl dark:opacity-30" />
            <div className="relative w-full max-w-4xl overflow-hidden rounded-[28px] border border-slate-200/70 bg-white/70 shadow-[0_30px_120px_rgba(15,23,42,0.15)] backdrop-blur sm:rounded-[32px] lg:max-w-6xl 2xl:max-w-7xl dark:border-white/10 dark:bg-white/5 dark:shadow-[0_30px_120px_rgba(0,0,0,0.55)]">
                <div className="grid gap-8 p-6 md:grid-cols-[1.05fr_0.95fr] md:gap-10 md:p-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:p-16 xl:p-20">
                    <div className="space-y-6 md:space-y-8">
                        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-4 py-1 text-xs uppercase tracking-[0.3em] text-slate-500 dark:border-white/10 dark:bg-white/10 dark:text-white/70">
                            BharatDocs
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl md:text-5xl dark:text-white">
                                Sign in to your
                                <span className="block bg-[linear-gradient(120deg,#f59e0b,#fbbf24_35%,#38bdf8_70%,#bae6fd)] bg-clip-text text-transparent">
                                    workspace
                                </span>
                            </h1>
                            <p className="max-w-md text-xs leading-relaxed text-slate-600 sm:text-sm md:text-base dark:text-white/70">
                                Draft, translate, and collaborate on BharatDocs with clarity.
                                Pick up where you left off and keep every idea in sync.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 sm:text-sm dark:text-white/70">
                            <div className="flex -space-x-2">
                                <div className="h-9 w-9 rounded-full border border-white/30 bg-[radial-gradient(circle_at_top,#ffce8a,#f59e0b)] sm:h-10 sm:w-10" />
                                <div className="h-9 w-9 rounded-full border border-white/30 bg-[radial-gradient(circle_at_top,#9ed4ff,#3b82f6)] sm:h-10 sm:w-10" />
                                <div className="h-9 w-9 rounded-full border border-white/30 bg-[radial-gradient(circle_at_top,#ffc1c1,#f97316)] sm:h-10 sm:w-10" />
                            </div>
                            <span>Trusted by 12k+ writers across India.</span>
                        </div>
                        <div className="space-y-3 rounded-2xl border border-slate-200/70 bg-white/70 p-4 text-[11px] text-slate-600 shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:text-xs dark:border-white/10 dark:bg-white/5 dark:text-white/70">
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                <span>Live collaboration</span>
                                <span className="rounded-full bg-slate-900/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-slate-600 dark:bg-white/10 dark:text-white/70">Active</span>
                            </div>
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                <span>Indic language assistant</span>
                                <span className="text-slate-400 dark:text-white/50">45+ languages</span>
                            </div>
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                <span>Secure cloud sync</span>
                                <span className="text-slate-400 dark:text-white/50">Every 3s</span>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.15)] sm:p-6 md:p-7 dark:border-white/10 dark:bg-[#0f1115]/80 dark:shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
                        <div className="space-y-5 sm:space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl dark:text-white">Welcome back</h2>
                                <p className="mt-2 text-xs text-slate-600 sm:text-sm dark:text-white/60">
                                    Sign in with your BharatDocs account.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <p className="text-xs text-slate-600 sm:text-sm dark:text-white/60">
                                    Continue to BharatDocs using your account.
                                </p>
                                <SignInButton mode="modal">
                                    <button
                                        type="button"
                                        className="w-full rounded-xl bg-[linear-gradient(120deg,#ffb454,#ffd18a_40%,#6ec7ff_70%,#b7f3ff)] px-4 py-3 text-sm font-semibold text-[#0b0d0f] shadow-[0_20px_40px_rgba(255,184,84,0.25)] transition hover:translate-y-[-1px]"
                                    >
                                        Sign in
                                    </button>
                                </SignInButton>
                                <div className="space-y-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 text-[11px] text-slate-600 sm:text-xs dark:border-white/10 dark:bg-white/5 dark:text-white/70">
                                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                        <span>Indian language support</span>
                                        <span className="text-slate-400 dark:text-white/50">Hindi to Tamil</span>
                                    </div>
                                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                        <span>Voice typing for accents</span>
                                        <span className="text-slate-400 dark:text-white/50">Hands-free</span>
                                    </div>
                                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                        <span>Live translation</span>
                                        <span className="text-slate-400 dark:text-white/50">Real-time</span>
                                    </div>
                                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                        <span>AI writing assistance</span>
                                        <span className="text-slate-400 dark:text-white/50">Grammar + style</span>
                                    </div>
                                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                        <span>Cloud sync on low data</span>
                                        <span className="text-slate-400 dark:text-white/50">Optimized</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;