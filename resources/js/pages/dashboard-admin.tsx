import { useForm } from '@inertiajs/react';
import { Toaster } from 'react-hot-toast';

export default function DashboardAdmin({ races, members, city, grouped, bestTimePerRace }: any) {
    const { data, setData, post, processing, errors } = useForm({
        city_id: city.id,
        race_id: '',
        member_id: '',
        time: '',
    });

    const handleTimeChange = (e) => {
        let raw = e.target.value.replace(/[^0-9]/g, ''); // Hanya angka

        // Batasi panjang hanya sampai 8 digit angka
        if (raw.length > 8) {
            raw = raw.slice(0, 8);
        }

        let mm = raw.slice(0, 2);
        let ss = raw.slice(2, 4);
        let xx = raw.slice(4, 6);

        // Validasi nilai
        if (mm.length === 2 && parseInt(mm) > 59) mm = '59';
        if (ss.length === 2 && parseInt(ss) > 59) ss = '59';
        if (xx.length === 2 && parseInt(xx) > 99) xx = '99';

        // Gabungkan dengan : dan .
        let formatted = '';
        if (mm) formatted += mm;
        if (ss) formatted += ':' + ss;
        if (xx) formatted += '.' + xx;

        setData((prevData) => ({
            ...prevData,
            time: formatted,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Ganti route ini sesuai dengan route backend kamu
        post(route('scores.store'), {
            preserveScroll: true,
        });
    };

    const handleLogout = () => {
        post(route('admins.logout'));
    };

    return (
        <>
            <div className="bg-gray-50 p-6">
                <h2 className="mb-6 text-center text-3xl font-semibold">Penilaian Lomba</h2>
                <h2 className="mb-6 text-center text-2xl font-semibold">Best Time - {city.name}</h2>
                <button
                    className="my-4 flex items-center justify-center rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
                    onClick={handleLogout}
                >
                    Logout
                </button>

                {/* Best Time Cards */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {bestTimePerRace.map((item, index) => (
                        <div key={index} className="rounded-md bg-white p-4 shadow-md transition duration-200 hover:shadow-lg">
                            <h3 className="text-lg font-medium text-gray-800">Best Time - {item.raceName}</h3>
                            <p className="text-sm text-gray-600">
                                No Pasukan: <span className="font-semibold text-gray-900">{item.member?.number_member ?? '-'}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                                Total Waktu: <span className="font-semibold text-gray-900">{item.time ?? '-'}</span>
                            </p>
                        </div>
                    ))}
                </div>

                {errors.member_id && <div className="text-sm text-red-600">{errors.member_id}</div>}

                {/* Form Input */}
                <form onSubmit={handleSubmit} className="mb-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="lomba" className="block text-sm font-medium text-gray-700">
                                Pilih Jenis Lomba
                            </label>
                            <select
                                id="race_id"
                                value={data.race_id}
                                onChange={(e) => setData('race_id', e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm"
                            >
                                <option value="">Pilih Lomba</option>
                                {races.map((race: any) => (
                                    <option key={race.id} value={race.id}>
                                        {race.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="pasukan" className="block text-sm font-medium text-gray-700">
                                No Pasukan
                            </label>
                            <select
                                id="member_id"
                                value={data.member_id}
                                onChange={(e) => setData('member_id', e.target.value)}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm"
                            >
                                <option value="">Pilih Pasukan</option>
                                {members.map((pasukan, index) => (
                                    <option key={index} value={pasukan.id}>
                                        {pasukan.number_member}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label htmlFor="waktuLomba" className="block text-sm font-medium text-gray-700">
                            Waktu Lomba (MM:SS.MS)
                        </label>
                        <input
                            type="text"
                            id="time"
                            value={data.time}
                            onChange={handleTimeChange}
                            placeholder="01:23.45"
                            maxLength={8}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="mt-4 w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : 'Submit'}
                    </button>
                </form>

                {/* Tabel Data Input */}
                <div className="mt-6 overflow-x-auto rounded-md bg-white shadow-md">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="border-b bg-gray-100">
                                <th className="px-4 py-2 text-left">No Pasukan</th>
                                {races.map((race) => (
                                    <th key={race.id} className="px-4 py-2 text-left">
                                        {race.name}
                                    </th>
                                ))}
                                <th className="px-4 py-2 text-left">Area</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.values(grouped).map((group: any, index) => (
                                <tr key={index} className="border-b">
                                    <td className="px-4 py-2">{group.member.number_member}</td>
                                    {races.map((race) => (
                                        <td key={race.id} className="px-4 py-2">
                                            {group.scores[race.code] || '-'}
                                        </td>
                                    ))}
                                    <td className="px-4 py-2">{group.member.city.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Toaster position="top-right" />
        </>
    );
}
