import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Admins', href: '/admins' }];

interface Admin {
    id: number;
    username: string;
    count_access: number;
    name?: string;
}

interface City {
    id: number;
    name: string;
}

interface Props {
    admins: Admin[];
    cities: City[];
}

export default function Admins({ admins: initialData, cities: initialCities }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        username: '',
        password: '',
    });

    const openModal = (admin: Admin | null = null) => {
        if (admin) {
            setEditId(admin.id);
            setData({
                username: admin.username,
                password: '',
            });
        } else {
            setEditId(null);
            reset();
        }
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const options = {
            onSuccess: () => {
                setShowModal(false);
                toast.success('Data admin berhasil diproses');
                reset();
                setEditId(null);
            },
        };

        if (editId) {
            console.log(route('admins.update', editId));
            put(route('admins.update', editId), options);
        } else {
            post(route('admins.store'), options);
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus admin ini?')) {
            destroy(route('admins.destroy', id));
            toast.success('Data admin berhasil dihapus');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admins" />

            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Data Admins</h2>
                    <button onClick={() => openModal()} className="rounded bg-blue-500 px-4 py-2 text-white">
                        Tambah Admin
                    </button>
                </div>

                {/* Table */}
                <table className="w-full table-auto border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-4 py-2">No</th>
                            <th className="border px-4 py-2">Kota</th>
                            <th className="border px-4 py-2">Total Login</th>
                            <th className="border px-4 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {initialData.map((item, index) => (
                            <tr key={item.id}>
                                <td className="border px-4 py-2">{index + 1}</td>
                                <td className="border px-4 py-2">{item.username}</td>
                                <td className="border px-4 py-2">{item.count_access}</td>
                                <td className="space-x-2 border px-4 py-2">
                                    <button onClick={() => openModal(item)} className="rounded bg-yellow-500 px-3 py-1 text-white">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="rounded bg-red-500 px-3 py-1 text-white">
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal */}
                {showModal && (
                    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                        <div className="w-full max-w-md rounded bg-white p-6 shadow-md">
                            <form onSubmit={handleSubmit}>
                                <h2 className="mb-4 text-lg font-bold">{editId ? 'Edit Admin' : 'Tambah Admin'}</h2>

                                <div className="space-y-4">
                                    <div>
                                        <Label>Pilih Kota</Label>
                                        <select
                                            name="username"
                                            value={data.username}
                                            onChange={(e) => setData('username', e.target.value)}
                                            className="w-full rounded border px-3 py-2"
                                        >
                                            <option value="">-- Pilih Kota --</option>
                                            {initialCities.map((city) => (
                                                <option key={city.id} value={city.name}>
                                                    {city.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
                                    </div>

                                    <div>
                                        <Label>Password {editId && <span className="text-xs text-gray-500">(opsional)</span>}</Label>
                                        <Input
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                        />
                                        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            reset();
                                            setEditId(null);
                                        }}
                                        className="rounded bg-gray-300 px-4 py-2"
                                    >
                                        Batal
                                    </button>
                                    <button type="submit" disabled={processing} className="rounded bg-blue-600 px-4 py-2 text-white">
                                        Simpan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
