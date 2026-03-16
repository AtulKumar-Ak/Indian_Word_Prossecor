"use client";

import { SignInButton } from "@clerk/nextjs";

const SignInPage = () => {
    return (
        <div className="flex min-h-screen items-center justify-center px-6 py-16">
            <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur">
                <div className="grid gap-10 p-10 md:grid-cols-[1.05fr_0.95fr] md:p-14">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.3em] text-white/70">
                            BharatDocs
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
                                Sign in to your
                                <span className="block bg-[linear-gradient(120deg,#ffd18a,#fff0c9_40%,#76d6ff_70%,#b7f3ff)] bg-clip-text text-transparent">
                                    workspace
                                </span>
                            </h1>
                            <p className="max-w-md text-sm leading-relaxed text-white/70 md:text-base">
                                Draft, translate, and collaborate on BharatDocs with clarity.
                                Pick up where you left off and keep every idea in sync.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-white/70">
                            <div className="flex -space-x-2">
                                <div className="h-10 w-10 rounded-full border border-white/20 bg-[radial-gradient(circle_at_top,#ffce8a,#f59e0b)]" />
                                <div className="h-10 w-10 rounded-full border border-white/20 bg-[radial-gradient(circle_at_top,#9ed4ff,#3b82f6)]" />
                                <div className="h-10 w-10 rounded-full border border-white/20 bg-[radial-gradient(circle_at_top,#ffc1c1,#f97316)]" />
                            </div>
                            <span>Trusted by 12k+ writers across India.</span>
                        </div>
                        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/70">
                            <div className="flex items-center justify-between">
                                <span>Live collaboration</span>
                                <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">Active</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Indic language assistant</span>
                                <span className="text-white/50">45+ languages</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Secure cloud sync</span>
                                <span className="text-white/50">Every 3s</span>
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-[#0f1115]/80 p-8 shadow-[0_20px_70px_rgba(0,0,0,0.45)]">
                        <div className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
                                <p className="mt-2 text-sm text-white/60">
                                    Sign in with your BharatDocs account.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <p className="text-sm text-white/60">
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
                                <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/70">
                                    <div className="flex items-center justify-between">
                                        <span>Indian language support</span>
                                        <span className="text-white/50">Hindi to Tamil</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Voice typing for accents</span>
                                        <span className="text-white/50">Hands-free</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Live translation</span>
                                        <span className="text-white/50">Real-time</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>AI writing assistance</span>
                                        <span className="text-white/50">Grammar + style</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span>Cloud sync on low data</span>
                                        <span className="text-white/50">Optimized</span>
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