import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requirePro?: boolean;
}

export function ProtectedRoute({ children, requirePro = false }: ProtectedRouteProps) {
    const { user, profile, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-white/60">Loading your mission data...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        // Redirect to signup, but save the current location
        return <Navigate to="/signup" state={{ from: location.pathname }} replace />;
    }

    if (requirePro && !profile?.is_pro) {
        // Redirect to upgrade page or show paywall
        return <Navigate to="/upgrade" state={{ from: location.pathname }} replace />;
    }

    return <>{children}</>;
}
