<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Element extends Model
{
    protected $table = 'elements';

    protected $fillable = [
        'group_id',
        'name',
    ];

    // Element принадлежит Group
    public function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }
}
