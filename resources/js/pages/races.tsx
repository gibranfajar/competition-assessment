import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Lomba', href: '/races' }];

export default function Races({ races }: any) {
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
        code: '',
        name: '',
    });

    const openModal = (race: any = null) => {
        if (race) {
            setEditId(race.id);
            setData({
                code: race.code,
                name: race.name,
            });
        } else {
            setEditId(null);
            reset();
        }
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editId) {
            put(route('races.update', editId), {
                onSuccess: () => {
                    reset();
                    setShowModal(false);
                    setEditId(null);
                },
            });
        } else {
            post(route('races.store'), {
                onSuccess: () => {
                    reset();
                    setShowModal(false);
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus lomba ini?')) {
            destroy(route('races.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lomba" />

            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Data Lomba</h2>
                    <button onClick={() => openModal()} className="rounded bg-blue-500 px-4 py-2 text-white">
                        Tambah Lomba
                    </button>
                </div>

                {/* Table */}
                <table className="w-full table-auto border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-4 py-2">No</th>
                            <th className="border px-4 py-2">Kode</th>
                            <th className="border px-4 py-2">Nama Lomba</th>
                            <th className="border px-4 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {races.map((item: any, index: number) => (
                            <tr key={item.id}>
                                <td className="border px-4 py-2">{index + 1}</td>
                                <td className="border px-4 py-2">{item.code}</td>
                                <td className="border px-4 py-2">{item.name}</td>
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
                                <h2 className="mb-4 text-lg font-bold">{editId ? 'Edit Lomba' : 'Tambah Lomba'}</h2>
                                <div className="space-y-4">
                                    <div>
                                        <Label>Kode Lomba (3 huruf)</Label>
                                        <Input
                                            name="code"
                                            maxLength={3}
                                            value={data.code}
                                            onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                        />
                                        {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
                                    </div>
                                    <div>
                                        <Label>Nama Lomba</Label>
                                        <Input name="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            reset(); // kosongin form dulu
                                            setEditId(null);
                                            setShowModal(false); // baru tutup modal
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
