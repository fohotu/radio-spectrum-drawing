<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Document extends Model
{
    protected $table = 'documents';

     protected $fillable = [
        'title',
    ];

    // Один Document -> много Group
    public function groups(): HasMany
    {
        return $this->hasMany(Group::class);
    }
}
