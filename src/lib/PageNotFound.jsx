import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';

export default function PageNotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#060a14]">
            <SEOHead title="Page not found" noindex />
            <div className="max-w-md w-full text-center space-y-6">
                <div className="space-y-2">
                    <p className="text-7xl font-light text-blue-400" aria-hidden="true">404</p>
                    <div className="h-0.5 w-16 bg-blue-500/30 mx-auto" />
                </div>
                <div className="space-y-3">
                    <h1 className="text-2xl font-semibold text-white">Page not found</h1>
                    <p className="text-slate-400 leading-relaxed">This page does not exist.</p>
                </div>
                <div className="pt-4">
                    <Link
                        to="/"
                        className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#060a14]"
                    >
                        Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}
