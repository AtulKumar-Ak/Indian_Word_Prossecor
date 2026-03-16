interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <div className="min-h-screen bg-[#0b0d0f] text-white">
            <div className="relative min-h-screen overflow-hidden">
                <div className="pointer-events-none absolute -left-24 top-[-140px] h-80 w-80 rounded-full bg-[radial-gradient(circle_at_top,#ffb454,transparent_65%)] opacity-70 blur-2xl" />
                <div className="pointer-events-none absolute -right-32 top-16 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_top,#44c2ff,transparent_60%)] opacity-60 blur-2xl" />
                <div className="pointer-events-none absolute bottom-[-120px] left-1/3 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_top,#ff7a7a,transparent_62%)] opacity-60 blur-2xl" />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.01)_45%,rgba(255,255,255,0)_100%)]" />
                <div className="relative z-10">
                    {children}
                </div>
            </div>
        </div>
    );
};
export default AuthLayout;