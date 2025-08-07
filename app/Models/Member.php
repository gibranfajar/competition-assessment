<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    protected $table = 'members';
    protected $guarded = [];

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function raceScores()
    {
        return $this->hasMany(Score::class);
    }
}
