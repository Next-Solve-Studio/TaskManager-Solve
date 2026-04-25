export function LoadingState() {
    return (
        <div className="min-h-screen bg-background-page flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
                <p className="text-sm text-font-gray2">Carregando dashboard…</p>
            </div>
        </div>
    );
}
