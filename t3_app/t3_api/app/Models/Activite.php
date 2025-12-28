<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @mixin IdeHelperActivite
 */
class Activite extends Model
{
    use HasFactory;
    protected $fillable = ["project_id", "activity_name", 'user_id'];
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * An activity belongs to a user.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
