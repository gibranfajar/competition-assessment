import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Anggota', href: '/members' }];

export default function Members({ members, cities }: any) {
    const [showModal, setShowModal] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [selectedCity, setSelectedCity] = useState<string>('');

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
        city_id: '',
        number_member: '',
        qty_member: '',
    });

    const openModal = (member: any = null) => {
        if (member) {
            setEditId(member.id);
            setData({
                city_id: member.city_id,
                number_member: member.number_member,
                qty_member: member.qty_member ?? '',
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
            put(route('members.update', editId), {
                onSuccess: () => {
                    reset();
                    setShowModal(false);
                    setEditId(null);
                    toast.success('Data anggota berhasil diubah');
                },
            });
        } else {
            post(route('members.store'), {
                onSuccess: () => {
                    reset();
                    setShowModal(false);
                    toast.success('Data anggota berhasil ditambahkan');
                },

                onError: () => {
                    toast.error('Data anggota gagal ditambahkan');
                },
            });
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus data anggota ini?')) {
            destroy(route('members.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Anggota" />

            <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Data Anggota</h2>
                    <button onClick={() => openModal()} className="rounded bg-blue-500 px-4 py-2 text-white">
                        Tambah Anggota
                    </button>
                </div>

                <div className="mb-4">
                    <label htmlFor="city" className="mr-2 font-semibold">
                        Filter by Kota:
                    </label>
                    <select id="city" value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="rounded border px-2 py-1">
                        <option value="">Semua Kota</option>
                        {/* Ganti cities dengan array dari data kotamu */}
                        {cities.map((city: any) => (
                            <option key={city.id} value={city.name}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Table */}
                <table className="w-full table-auto border">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border px-4 py-2">No</th>
                            <th className="border px-4 py-2">Kota</th>
                            <th className="border px-4 py-2">Nomor Pasukan</th>
                            <th className="border px-4 py-2">Jumlah</th>
                            <th className="border px-4 py-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {members
                            .filter((item: any) => (selectedCity ? item.city?.name === selectedCity : true))
                            .map((item: any, index: number) => (
                                <tr key={item.id}>
                                    <td className="border px-4 py-2">{index + 1}</td>
                                    <td className="border px-4 py-2">{item.city?.name ?? '-'}</td>
                                    <td className="border px-4 py-2">{item.number_member}</td>
                                    <td className="border px-4 py-2">{item.qty_member ?? '-'}</td>
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
                                <h2 className="mb-4 text-lg font-bold">{editId ? 'Edit Anggota' : 'Tambah Anggota'}</h2>
                                <div className="space-y-4">
                                    <div>
                                        <Label>Kota</Label>
                                        <select
                                            className="w-full rounded border px-2 py-2"
                                            value={data.city_id}
                                            onChange={(e) => setData('city_id', e.target.value)}
                                        >
                                            <option value="">-- Pilih Kota --</option>
                                            {cities.map((city: any) => (
                                                <option key={city.id} value={city.id}>
                                                    {city.name}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.city_id && <p className="text-sm text-red-500">{errors.city_id}</p>}
                                    </div>
                                    <div>
                                        <Label>Nomor Pasukan</Label>
                                        <Input
                                            name="number_member"
                                            value={data.number_member}
                                            onChange={(e) => setData('number_member', e.target.value)}
                                        />
                                        {errors.number_member && <p className="text-sm text-red-500">{errors.number_member}</p>}
                                    </div>
                                    <div>
                                        <Label>Jumlah Anggota (Opsional)</Label>
                                        <Input name="qty_member" value={data.qty_member} onChange={(e) => setData('qty_member', e.target.value)} />
                                        {errors.qty_member && <p className="text-sm text-red-500">{errors.qty_member}</p>}
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            reset();
                                            setEditId(null);
                                            setShowModal(false);
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
