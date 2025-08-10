import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

type Cities = {
    id: number;
    name: string;
};

interface LoginForm {
    username: string;
    password: string;
}

export default function LoginCities({ cities }: { cities: Cities[] }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        username: '',
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login.logincity'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
                <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md">
                    <div className="text-center">
                        <img src="/logo.png" alt="Logo" className="mx-auto mb-4 w-50" />
                        <h2 className="text-2xl font-semibold text-gray-800">Admin Perkota Login</h2>
                    </div>

                    {errors.username && <p className="mt-2 text-center text-sm text-red-500">{errors.username}</p>}
                    {errors.password && <p className="mt-2 text-center text-sm text-red-500">{errors.password}</p>}

                    <form onSubmit={submit} className="mt-6">
                        <div className="mb-4">
                            <Label htmlFor="city">Select Area/Kota</Label>
                            <select
                                id="username"
                                name="username"
                                required
                                value={data.username}
                                onChange={(e) => setData('username', e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm"
                            >
                                <option value="">Select Area</option>
                                {cities.map((city) => (
                                    <option key={city.id} value={city.name}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="relative mb-4">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Password"
                                className="pr-10"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute top-9 right-2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing ? 'Logging in...' : 'Login'}
                        </button>
                    </form>
                    <div className="mt-8 text-center text-sm text-gray-600">
                        <p>Powered by Ottimo Multima Grup</p>
                    </div>
                </div>
            </div>
        </>
    );
}
