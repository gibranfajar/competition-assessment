import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import toast, { Toaster } from 'react-hot-toast';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

export default function Login() {
    const { data, setData, post, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),

            onError: () => {
                toast.error(errors.email || errors.password || 'Invalid email or password');
            },
        });
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
            <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md">
                <div className="text-center">
                    <img src="/logo.png" alt="Logo" className="mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-800">Super Admin Login</h2>
                </div>
                <form className="mt-6" onSubmit={submit}>
                    <div className="mb-4">
                        <Label htmlFor="email">Email address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="email@example.com"
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Password"
                        />
                    </div>
                    <button type="submit" className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700">
                        Login
                    </button>
                </form>
            </div>
            <Toaster position="top-right" />
        </div>
    );
}
