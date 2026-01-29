<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\FocusFlow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class FocusFlowController extends Controller
{
    public function index()
    {
        $tasks = FocusFlow::where('user_id', auth()->id())
                         ->orderBy('order')
                         ->get();

        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'in:low,medium,high'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $task = FocusFlow::create([
            'user_id' => auth()->id(),
            'title' => $request->title,
            'description' => $request->description,
            'priority' => $request->priority ?? 'medium',
            'order' => FocusFlow::where('user_id', auth()->id())->count()
        ]);

        return response()->json($task, 201);
    }

    public function update(Request $request, FocusFlow $focusFlow)
    {
        $this->authorize('update', $focusFlow);

        $validator = Validator::make($request->all(), [
            'title' => 'string|max:255',
            'description' => 'nullable|string',
            'priority' => 'in:low,medium,high',
            'completed' => 'boolean',
            'focus_time' => 'integer|min:0',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $focusFlow->update($request->all());

        return response()->json($focusFlow);
    }

    public function updateOrder(Request $request)
    {
        $request->validate([
            'tasks' => 'required|array',
            'tasks.*.id' => 'required|exists:focus_flows,id',
            'tasks.*.order' => 'required|integer'
        ]);

        foreach ($request->tasks as $task) {
            if ($task['user_id'] === auth()->id()) {
                FocusFlow::where('id', $task['id'])->update(['order' => $task['order']]);
            }
        }

        return response()->json(['message' => 'Order updated successfully']);
    }

    public function destroy(FocusFlow $focusFlow)
    {
        $this->authorize('delete', $focusFlow);

        $focusFlow->delete();

        return response()->json(null, 204);
    }
}
