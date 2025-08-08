import { Home } from 'lucide-react';
import { useEffect } from 'react';

export default function Authenticated() {
    useEffect(() => {
        document.title = '403 - Forbidden';
    }, []);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 px-4 text-center">
            <div className="mb-6 text-7xl font-bold text-red-500 drop-shadow-lg">403</div>
            <h1 className="mb-2 text-2xl font-semibold text-gray-800">Akses Ditolak</h1>
            <p className="mb-6 max-w-md text-gray-600">
                Anda tidak memiliki izin untuk mengakses halaman ini. Jika Anda merasa ini adalah kesalahan, hubungi administrator.
            </p>
            <a
                href="/admin/dashboard"
                className="inline-flex items-center gap-2 rounded bg-indigo-600 px-5 py-2.5 text-white transition hover:bg-indigo-700"
            >
                <Home className="h-4 w-4" />
                Kembali ke Beranda
            </a>
        </div>
    );
}
