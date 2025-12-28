<?php

namespace App\Http\Controllers\Api;


use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Controller;
use App\Models\Jourferier;
use Carbon\Carbon;
use Illuminate\Http\Request;

class JourferiersController extends Controller
{
    public function getCurrentMonthHolidays()
    {
        $currentMonth = Carbon::now()->month;
        $currentYear = Carbon::now()->year;

        $holidays = Jourferier::whereYear('jourferiers_date', $currentYear)
            ->whereMonth('jourferiers_date', $currentMonth)
            ->get();
        foreach ($holidays as $holiday) {
            $holiday->jourferiers_date = Carbon::createFromFormat('Y-m-d', $holiday->jourferiers_date)->day;
        }

        return response()->json($holidays);
    }
    public function index(): JsonResponse
    {
        $jourferiers = Jourferier::all();
        return response()->json($jourferiers);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'jourferiers_date' => 'required|date',
            'description' => 'required|string|max:255',
            'number_days' => 'required|integer'
        ]);

        $jourferier = Jourferier::create($request->all());

        return response()->json($jourferier, 201);
    }

    public function show(Jourferier $jourferier): JsonResponse
    {
        return response()->json($jourferier);
    }

    public function update(Request $request, Jourferier $jourferier): JsonResponse
    {
        $request->validate([
            'jourferiers_date' => 'required|date',
            'description' => 'required|string|max:255',
            'number_days' => 'required|integer'
        ]);

        $jourferier->update($request->all());

        return response()->json($jourferier);
    }

    public function destroy(Jourferier $jourferier): JsonResponse
    {
        $jourferier->delete();

        return response()->json(['message' => 'Jourferier deleted successfully.']);
    }
}
