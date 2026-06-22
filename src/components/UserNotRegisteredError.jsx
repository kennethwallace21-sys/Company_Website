import React from 'react';
import { AlertTriangle, LogOut, Mail } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

const ADMIN_EMAIL = 'contact@catalystappliedai.com';

const UserNotRegisteredError = ({
    title = 'Access Restricted',
    message = 'You are not registered to use this application. Please contact the app administrator to request access.',
    adminEmail = ADMIN_EMAIL,
}) => {
    const { logout } = useAuth();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-white to-slate-50">
            <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg border border-slate-100">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-orange-100">
                        <AlertTriangle
                            className="w-8 h-8 text-orange-600"
                            aria-hidden="true"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-4">
                        {title}
                    </h1>
                    <p className="text-slate-600 mb-8">
                        {message}
                    </p>
                    <div className="p-4 bg-slate-50 rounded-md text-sm text-slate-600">
                        <p>If you believe this is an error, you can:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-left">
                            <li>Verify you are logged in with the correct account</li>
                            <li>Contact the app administrator for access</li>
                            <li>Try logging out and back in again</li>
                        </ul>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
                        <button
                            type="button"
                            onClick={logout}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                        >
                            <LogOut className="w-4 h-4" aria-hidden="true" />
                            Log Out
                        </button>
                        <a
                            href={`mailto:${adminEmail}?subject=Access%20Request%20-%20CAAi%20Platform`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                        >
                            <Mail className="w-4 h-4" aria-hidden="true" />
                            Contact Admin
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserNotRegisteredError;
