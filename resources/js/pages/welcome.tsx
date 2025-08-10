import { Link } from '@inertiajs/react';

export default function Welcome() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
                {/* Logo and Title */}
                <div className="mb-8 text-center">
                    <img src="/logo.png" alt="Logo" className="mx-auto mb-4 w-50" />
                    <h1 className="text-2xl font-bold text-gray-800">SISTEM PENILAIAN LOMBA HIROpendence Day</h1>
                </div>

                {/* Choose Role */}
                <div className="grid grid-rows-2 gap-4">
                    <Link href="/login">
                        <div className="rounded-md bg-blue-600 p-4 text-center text-white shadow-md">
                            <h3 className="text-xl font-semibold">Login as Master Admin</h3>
                            <p className="mt-2">Access all data and manage the system.</p>
                        </div>
                    </Link>

                    <Link href="/login-cities">
                        <div className="rounded-md bg-green-600 p-4 text-center text-white shadow-md">
                            <h3 className="text-xl font-semibold">Login as Admin Perkota</h3>
                            <p className="mt-2">Login and manage city-specific data.</p>
                        </div>
                    </Link>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center text-sm text-gray-600">
                    <p>Powered by Ottimo Multima Grup</p>
                </div>
            </div>
        </div>
    );
}
