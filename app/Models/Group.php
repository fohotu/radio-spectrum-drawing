<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Group extends Model
{
    protected $table = 'groups';

     protected $fillable = [
        'document_id',
        'name',
    ];

    // Group принадлежит Document
    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }

    // Один Group -> много Element
    public function elements(): HasMany
    {
        return $this->hasMany(Element::class);
    }
}
