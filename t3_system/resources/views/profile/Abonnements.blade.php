<x-app-layout>
    {{--     <x-slot name="header">
        <h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {{ __('Profile') }}
        </h2>
    </x-slot> --}}

    <div class="py-12">

        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
            <div class="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">

                @if (session('success'))
                    <div class="bg-emerald-800 border text-white border-green-400 text-slate-950-700 px-4 py-3 rounded relative"
                        role="alert">
                        <span class="block sm:inline">{{ session('success') }}</span>
                        <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
                            <svg class="fill-current h-6 w-6 text-red-500" role="button"
                                xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <title>Close</title>
                                <path
                                    d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
                            </svg>
                        </span>
                    </div>
                @endif
                @forelse ($data as $d)
                    <div class="w-full flex">
                        <div class="font-bold text-xl mb-2">

                            {{ __('app.' . $d->subscription_plan->subscription_plan_name) }}

                        </div>
                    </div>
                    <div class="w-full flex">


                        @foreach ($d->subscription_plan->modules as $module)
                            <div class="max-w-sm rounded overflow-hidden ">
                                <div class="px-6 py-4">
                                    <div class="font-bold text-xl mb-2">
                                        {{ $module->module_name }}
                                    </div>
                                    <p class="text-gray-700 text-base">
                                        {{ $module->full_name }}
                                    </p>
                                    <p class="text-gray-700 text-base">
                                        {{ $module->description }}
                                    </p>
                                </div>

                            </div>
                        @endforeach


                    </div>
                    <div class="px-6 pt-4 pb-2">
                        <p class="text-gray-700 text-base">
                            valid until {{ $d->user_subscriptionplan_date_end }}
                        </p>
                    </div>
                @empty
                    <div class="w-full flex">
                        <div class="font-bold text-xl mb-2">
                            tu n'as aucun abonnement
                        </div>
                    </div>
                @endforelse
            </div>


        </div>
    </div>
</x-app-layout>
