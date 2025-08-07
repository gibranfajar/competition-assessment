import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Dashboard', href: '/dashboard' }];

// Helper: HH:MM:SS → detik
const parseTimeToSeconds = (value: string | number | null | undefined): number => {
    if (!value) return 0;
    const timeStr = String(value);
    const parts = timeStr.split(':').map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) return 0;
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
};

// Helper: detik → HH:MM:SS
const formatTime = (totalSeconds: number): string => {
    const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const s = String(totalSeconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
};

export default function Dashboard({ scores, races, cities }: any) {
    const [cityFilter, setCityFilter] = useState<string>('all');

    const grouped = scores.reduce((acc: any, score: any) => {
        const memberId = score.member.id;

        if (!acc[memberId]) {
            acc[memberId] = {
                id: score.member.id,
                area: score.member.city.name,
                noPasukan: score.member.number_member,
                lombaTimes: {},
                totalSeconds: 0,
                pePoin: score.pe_point || 0,
                acePoin: score.ace_point || 0,
                dDayPoin: score.dday_point || 0,
            };
        }

        const raceCode = score.race.code;
        acc[memberId].lombaTimes[raceCode] = score.time || '-';
        acc[memberId].totalSeconds += parseTimeToSeconds(score.time);

        return acc;
    }, {});

    const rows = Object.values(grouped).map((item: any) => ({
        ...item,
        totalWaktu: formatTime(item.totalSeconds),
        totalPoin: item.pePoin + item.acePoin + item.dDayPoin,
    }));

    const filteredRows = cityFilter === 'all' ? rows : rows.filter((item: any) => item.area === cityFilter);

    const cityOptions = useMemo(() => {
        const unique = Array.from(new Set(cities.map((c: any) => c.name)));
        return ['all', ...unique];
    }, [cities]);

    const bestTimePerRace = races.map((race: any) => {
        const filtered = scores.filter((score: any) => score.race.code === race.code && score.time);

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

        const fastest = result.sort((a, b) => a.time - b.time)[0];

        return {
            raceName: race.name,
            raceCode: race.code,
            member: fastest?.member,
            time: fastest?.time,
        };
    });

    function formatTime(totalSeconds: number): string {
        const hours = Math.floor(totalSeconds / 3600)
            .toString()
            .padStart(2, '0');
        const minutes = Math.floor((totalSeconds % 3600) / 60)
            .toString()
            .padStart(2, '0');
        const seconds = (totalSeconds % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

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

                {/* Placeholder Cards */}
                <div className="mb-6 grid gap-4 md:grid-cols-3">
                    {bestTimePerRace.map((item, index) => (
                        <div key={index} className="rounded-lg border bg-white p-4 shadow-md">
                            <h3 className="mb-2 text-lg font-semibold">Best Time National - {item.raceName}</h3>
                            <p className="text-sm text-gray-700">
                                No Pasukan: <span className="font-medium">{item.member?.number_member ?? '-'}</span>
                            </p>
                            <p className="text-sm text-gray-700">
                                Total Waktu: <span className="font-medium">{item.time ? formatTime(item.time) : '-'}</span>
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
                                                {item[field] > 0 ? (
                                                    <span>{item[field]}</span>
                                                ) : (
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
                                                    >
                                                        <input
                                                            name="value"
                                                            type="number"
                                                            className="mr-1 w-16 rounded border px-1 py-0.5"
                                                            placeholder="0"
                                                        />
                                                        <button
                                                            type="submit"
                                                            className="rounded bg-blue-500 px-2 py-0.5 text-xs text-white hover:bg-blue-600"
                                                        >
                                                            Add
                                                        </button>
                                                    </form>
                                                )}
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
