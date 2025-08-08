import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

export default function Dashboard({ scores, races, cities, bestTimePerRace }: any) {
    const [cityFilter, setCityFilter] = useState<string>('all');

    const convertTimeToMilliseconds = (time: string): number => {
        if (!/^\d{2}:\d{2}\.\d{2}$/.test(time)) return 0;

        const [minutes, rest] = time.split(':');
        const [seconds, hundredths] = rest.split('.');

        return parseInt(minutes) * 60 * 1000 + parseInt(seconds) * 1000 + parseInt(hundredths) * 10;
    };

    const grouped = scores.reduce((acc: any, score: any) => {
        const memberId = score.member.id;

        if (!acc[memberId]) {
            acc[memberId] = {
                id: score.member.id,
                area: score.member.city.name,
                noPasukan: score.member.number_member,
                lombaTimes: {},
                totalMilliseconds: 0,
                pePoin: score.pe_point || 0,
                acePoin: score.ace_point || 0,
                dDayPoin: score.dday_point || 0,
            };
        }

        const raceCode = score.race.code;
        const timeString = score.time;

        acc[memberId].lombaTimes[raceCode] = timeString ?? '-';

        if (timeString != null) {
            acc[memberId].totalMilliseconds += convertTimeToMilliseconds(timeString);
        }

        return acc;
    }, {});

    const formatMilliseconds = (ms: number): string => {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        const hundredths = Math.floor((ms % 1000) / 10);

        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(hundredths).padStart(2, '0')}`;
    };

    const rows = Object.values(grouped).map((item: any) => ({
        ...item,
        totalWaktu: formatMilliseconds(item.totalMilliseconds),
        totalPoin: item.pePoin + item.acePoin + item.dDayPoin,
    }));

    const filteredRows = cityFilter === 'all' ? rows : rows.filter((item: any) => item.area === cityFilter);

    const cityOptions = useMemo(() => {
        const unique = Array.from(new Set(cities.map((c: any) => c.name)));
        return ['all', ...unique];
    }, [cities]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Filter by City */}
                <div className="mt-4 flex items-center justify-end">
                    <label className="mr-2 font-semibold">Filter by City:</label>
                    <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="rounded border px-3 py-1">
                        {cityOptions.map((city) => (
                            <option key={city} value={city}>
                                {city === 'all' ? 'All Cities' : city}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Best Time Cards */}
                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {bestTimePerRace.map((item: any, index: number) => (
                        <div key={index} className="rounded-md bg-white p-4 shadow-md transition duration-200 hover:shadow-lg">
                            <h3 className="font-medium text-gray-800">Best Time - {item.raceName}</h3>
                            <p className="text-sm text-gray-600">
                                No Pasukan: <span className="font-semibold text-gray-900">{item.member?.number_member ?? '-'}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                                Total Waktu: <span className="font-semibold text-gray-900">{item.time ?? '-'}</span>
                            </p>
                        </div>
                    ))}
                </div>

                {/* Table */}
                <div className="relative min-h-[100vh] flex-1 overflow-hidden border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <div className="mt-6 overflow-x-auto rounded-md bg-white shadow-md">
                        <table className="min-w-full table-auto text-sm">
                            <thead>
                                <tr className="border-b bg-gray-100 text-sm">
                                    <th className="px-4 py-2 text-left">Area</th>
                                    <th className="px-4 py-2 text-left">Pasukan</th>
                                    {races.map((race: any) => {
                                        return (
                                            <th key={race.id} className="group relative cursor-pointer px-4 py-2 text-left">
                                                {race.code}
                                                <span className="absolute top-full left-1/2 z-10 hidden w-max -translate-x-1/2 rounded bg-black px-2 py-1 text-xs text-white group-hover:block">
                                                    {race.name}
                                                </span>
                                            </th>
                                        );
                                    })}
                                    <th className="px-4 py-2 text-left">Total Waktu</th>
                                    <th className="px-4 py-2 text-left">PE Poin</th>
                                    <th className="px-4 py-2 text-left">ACE Poin</th>
                                    <th className="px-4 py-2 text-left">D-Day Poin</th>
                                    <th className="px-4 py-2 text-left">Total Point</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRows.map((item: any, idx: number) => (
                                    <tr key={idx} className="border-b">
                                        <td className="px-4 py-2">{item.area}</td>
                                        <td className="px-4 py-2">{item.noPasukan}</td>
                                        {races.map((race: any) => (
                                            <td key={race.id} className="px-4 py-2">
                                                {item.lombaTimes[race.code] || '-'}
                                            </td>
                                        ))}
                                        <td className="px-4 py-2">{item.totalWaktu}</td>

                                        {/* PE, ACE, DDAY */}
                                        {(['pePoin', 'acePoin', 'dDayPoin'] as const).map((field) => (
                                            <td key={field} className="px-4 py-2">
                                                <form
                                                    onSubmit={(e) => {
                                                        e.preventDefault();
                                                        const valueInput = e.currentTarget.elements.namedItem('value') as HTMLInputElement;
                                                        const value = parseInt(valueInput.value);

                                                        router.post(route('scores.add-point'), {
                                                            member_id: item.id,
                                                            field,
                                                            value: isNaN(value) ? 0 : value,
                                                        });
                                                    }}
                                                    className="flex items-center gap-1"
                                                >
                                                    <input
                                                        name="value"
                                                        type="number"
                                                        className="w-16 rounded border border-gray-300 px-2 py-1 text-center text-sm shadow-sm focus:border-blue-400 focus:ring-1 focus:ring-blue-300 focus:outline-none"
                                                        placeholder="0"
                                                        defaultValue={item[field] > 0 ? item[field] : ''}
                                                    />
                                                    <button
                                                        type="submit"
                                                        className={`rounded px-2 py-1 text-xs font-semibold text-white shadow-sm ${
                                                            item[field] > 0 ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-500 hover:bg-green-600'
                                                        }`}
                                                    >
                                                        {item[field] > 0 ? 'Update' : 'Add'}
                                                    </button>
                                                </form>
                                            </td>
                                        ))}

                                        <td className="px-4 py-2">{item.totalPoin}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
