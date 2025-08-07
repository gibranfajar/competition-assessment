import { useForm } from '@inertiajs/react';

export default function DashboardAdmin({ races, members, city, scores }: any) {
    const { data, setData, post, processing, errors } = useForm({
        city_id: city.id,
        race_id: '',
        member_id: '',
        time: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Ganti route ini sesuai dengan route backend kamu
        post(route('scores.store'), {
            preserveScroll: true,
        });
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let input = e.target.value.replace(/\D/g, ''); // Hapus semua non-angka

        if (input.length > 6) input = input.slice(0, 6); // Maks 6 digit

        let formatted = input;
        if (input.length > 4) {
            formatted = `${input.slice(0, 2)}:${input.slice(2, 4)}:${input.slice(4, 6)}`;
        } else if (input.length > 2) {
            formatted = `${input.slice(0, 2)}:${input.slice(2, 4)}`;
        }

        setData('time', formatted);
    };

    const handleLogout = () => {
        post(route('logout'));
    };

    const parseTimeToSeconds = (value: string | number | null | undefined): number => {
        if (!value) return 0;
        const timeStr = String(value);
        const parts = timeStr.split(':').map(Number);
        if (parts.length !== 3 || parts.some(isNaN)) return 0;
        const [hours, minutes, seconds] = parts;
        return hours * 3600 + minutes * 60 + seconds;
    };

    const formatTime = (totalSeconds: number): string => {
        const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const s = String(totalSeconds % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const groupedByMember = scores.reduce((acc, score) => {
        const memberId = score.member.id;
        if (!acc[memberId]) {
            acc[memberId] = {
                member: score.member,
                scores: {},
            };
        }
        acc[memberId].scores[score.race.code] = score.time;
        return acc;
    }, {});

    const bestTimePerRace = races.map((race: any) => {
        // 1. Filter scores untuk race tertentu & area tertentu
        const filtered = scores.filter(
            (score: any) => score.race.code === race.code && score.time && score.member.city.name === city.name, // filter by area
        );

        // 2. Akumulasi waktu per member
        const grouped = filtered.reduce((acc: any, score: any) => {
            const memberId = score.member.id;

            if (!acc[memberId]) {
                acc[memberId] = {
                    member: score.member,
                    time: 0,
                };
            }

            acc[memberId].time += parseTimeToSeconds(score.time);
            return acc;
        }, {});

        const result = Object.values(grouped) as {
            member: any;
            time: number;
        }[];

        // 3. Ambil peserta tercepat (waktu total terkecil)
        const fastest = result.sort((a, b) => a.time - b.time)[0];

        return {
            raceName: race.name,
            member: fastest?.member,
            time: fastest?.time,
        };
    });

    return (
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
                    <div key={index} className="rounded-md bg-white p-4 shadow-md">
                        <h3 className="text-lg font-medium">Best Time - {item.raceName}</h3>
                        <p>No Pasukan: {item.member?.number_member ?? '-'}</p>
                        <p>Total Waktu: {item.time ? formatTime(item.time) : '-'}</p>
                    </div>
                ))}
            </div>

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
                        {errors.race_id && <div className="text-sm text-red-600">{errors.race_id}</div>}
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
                        {errors.member_id && <div className="text-sm text-red-600">{errors.member_id}</div>}
                    </div>
                </div>

                <div className="mt-4">
                    <label htmlFor="waktuLomba" className="block text-sm font-medium text-gray-700">
                        Waktu Lomba (HH:MM:SS)
                    </label>
                    <input
                        type="text"
                        id="time"
                        value={data.time}
                        onChange={handleTimeChange}
                        placeholder="01:23:45"
                        maxLength={8}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm"
                    />

                    {errors.time && <p className="text-sm text-red-500">{errors.time}</p>}
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
                        {Object.values(groupedByMember).map((group: any, index) => (
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
    );
}
