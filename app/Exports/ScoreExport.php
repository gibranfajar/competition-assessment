<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class ScoreExport implements FromArray, WithHeadings, WithStyles
{
    protected $rows;
    protected $races;

    public function __construct($rows, $races)
    {
        $this->rows = $rows;
        $this->races = $races;
    }

    public function array(): array
    {
        return $this->rows->map(function ($row) {
            $data = [
                $row['Area'],
                $row['No Pasukan'],
            ];

            // Tambahkan kolom lomba
            foreach ($this->races as $race) {
                $data[] = $row[$race->code] ?? '-';
            }

            $data[] = $row['Total Waktu'];
            $data[] = $row['PE Poin'];
            $data[] = $row['DDay Poin'];
            $data[] = $row['Total Poin'];

            return $data;
        })->toArray();
    }

    public function headings(): array
    {
        $headings = ['Area', 'No Pasukan'];

        foreach ($this->races as $race) {
            $headings[] = $race->code;
        }

        return array_merge($headings, ['Total Waktu', 'PE Poin', 'DDay Poin', 'Total Poin']);
    }

    public function styles(Worksheet $sheet)
    {
        // Header bold
        $sheet->getStyle('A1:' . $sheet->getHighestColumn() . '1')->getFont()->setBold(true);

        // Warna top 5 (baris 2-6)
        $colors = [
            'FFD60A', // Gold
            'FFD60A', // Silver
            'FFD60A', // Bronze
            'FF8FAB', // Blue
            'FF8FAB', // Green
        ];

        foreach ($colors as $i => $color) {
            $rowIndex = $i + 2; // header = 1
            if ($rowIndex <= $sheet->getHighestRow()) {
                $sheet->getStyle("A{$rowIndex}:" . $sheet->getHighestColumn() . "{$rowIndex}")
                    ->getFill()
                    ->setFillType(Fill::FILL_SOLID)
                    ->getStartColor()
                    ->setARGB($color);
            }
        }
    }
}
