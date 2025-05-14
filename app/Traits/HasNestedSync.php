<?php

namespace App\Traits;

use Illuminate\Support\Str;

trait HasNestedSync
{
    /**
     * Sync nested relations easily.
     *
     * @param string $relationName The relation method name (e.g., 'addresses', 'languagePairsRates')
     * @param array $items Array of items to sync
     * @param string $primaryKey The primary key column, usually 'id'
     * @return void
     */
    public function syncRelation(string $relationName, array $items, string $primaryKey = 'id'): void
    {
        $relation = $this->{$relationName}();

        $existingIds = collect($items)
            ->pluck($primaryKey)
            ->filter()
            ->toArray();

        $relation->whereNotIn($primaryKey, $existingIds)->delete();

        foreach ($items as $item) {
            if (isset($item[$primaryKey])) {
                $relation->find($item[$primaryKey])?->update($item);
            } else {
                $relation->create($item);
            }
        }
    }

    public function overwriteRelation(string $relationName, array $items): void
    {
        $relation = $this->{$relationName}();
        $relation->delete();

        foreach ($items as $item) {
            $relation->create($item);
        }
    }

    /**
     * NEW:
     * Auto-detect relation names and sync if they exist.
     */
    public function syncRelationsFromRequest(array $validatedData, array $relationsToSync = []): void
    {
        foreach ($relationsToSync as $relation) {
            if (array_key_exists($relation, $validatedData)) {
                $camelRelation = Str::camel($relation); // Convert snake_case to camelCase (Laravel convention)

                if (method_exists($this, $camelRelation)) {
                    if (in_array($relation, [
                        'addresses',
                        'language_pairs_rates',
                    ])) {
                        $this->syncRelation($camelRelation, $validatedData[$relation]);
                    } else {
                        $this->overwriteRelation($camelRelation, $validatedData[$relation]);
                    }
                }
            }
        }
    }
}
