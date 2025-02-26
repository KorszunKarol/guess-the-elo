'use client';

interface AnalysisStatusProps {
    error: string | null;
    engineReady: boolean;
}

export const AnalysisStatus = ({
    error,
    engineReady,
}: AnalysisStatusProps) => {
    if (!error && engineReady) return null;

    return (
        <>
            {error && (
                <div className="mb-4 p-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                    {error}
                </div>
            )}

            {!engineReady && (
                <div className="mb-4 p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-400 text-sm">
                    Engine is initializing...
                </div>
            )}
        </>
    );
};