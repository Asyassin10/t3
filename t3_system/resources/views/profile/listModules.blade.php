<x-app-layout>
    <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('app.listModules') }}
        </h2>

    </x-slot>

    <div class="py-12">
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
            <div class="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                @foreach ($subscription_plans as $subscription_plan)
                    <div class="w-full flex items-center justify-between mb-4">
                        <div class="font-bold text-xl">
                            {{ __('app.' . $subscription_plan->subscription_plan_name) }}
                        </div>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        @foreach ($subscription_plan->modules as $module)
                            <div class="bg-white dark:bg-gray-800 shadow sm:rounded-lg overflow-hidden">
                                <div class="p-4">
                                    <div class="font-bold text-xl mb-2">
                                        {{ $module->module_name }}
                                    </div>
                                    <p class="text-gray-700 text-sm">
                                        {{ $module->description }}
                                    </p>
                                </div>
                            </div>
                        @endforeach
                    </div>
                    <br>
                    @if (!$subscription_plan->is_payed)
                        <a href="{{ route('crateCheckout', ['plan_id' => $subscription_plan->id]) }}"
                            class="bg-slate-900 hover:bg-dark-400 text-gray-50 font-bold py-2 px-4 rounded inline-flex items-center">
                            <span>Payer</span>
                        </a>
                    @endif
                @endforeach
            </div>
        </div>
    </div>


</x-app-layout>
