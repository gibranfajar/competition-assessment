<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Score extends Model
{
    protected $table = 'scores';
    protected $guarded = [];

    public function race()
    {
        return $this->belongsTo(Race::class);
    }

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }
}
