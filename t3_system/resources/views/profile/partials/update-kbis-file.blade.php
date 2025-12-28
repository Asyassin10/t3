<section>
    <header>
        <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">
            {{ __('Profile Information') }}
        </h2>

        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {{ __("Logo") }}
        </p>
    </header>

    <form id="send-verification" method="post" action="{{ route('kbis.verification-kbis') }}">
        @csrf
    </form>

    <form method="post" action="{{ route('kbis.verification-kbis') }}" class="mt-6 space-y-6"  enctype="multipart/form-data">
        @csrf
        @if ($user->logo != null)
        <img src="{{$user->logo }}" alt="logo" width="200" height="100">
    @endif
    <div>
        <x-input-label for="logo" :value="__('Logo')" />
        <x-text-input id="logo" name="logo" type="file" class="mt-1 block w-full"  autofocus autocomplete="name" />
        <x-input-error class="mt-2" :messages="$errors->get('logo')" />
    </div>

    <br>
    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
        {{ __("Kbis File") }}
    </p>
    @method('post')
    @if ($user->kbis_file != null)
        <img src="{{ $user->kbis_file }}" alt="kbis" width="200" height="100">
    @endif
    <div>
        <x-input-label for="kbis" :value="__('Kbis File')" />
        <x-text-input id="kbis" name="kbis" type="file" class="mt-1 block w-full"  autofocus autocomplete="name" />
        <x-input-error class="mt-2" :messages="$errors->get('kbis')" />
    </div>



        <br>
        <div>
            <x-input-label for="organization_name" :value="__('Nom de organisation')" />
            @if ($user->organization_name == null)
            <x-text-input id="organization_name" name="organization_name" type="text"  class="mt-1 block w-full" :value="old('', $user->organization_name)"  placeholder="Ajouter le nom de l'organisation"/>
                @else
                <x-text-input readonly id="organization_name" name="organization_name" type="text"  class="mt-1 block w-full" :value="old('', $user->organization_name)"  placeholder="Ajouter le nom de l'organisation"/>
                    @endif
            <x-input-error class="mt-2" :messages="$errors->get('organization_name')" />

        </div>
        <div class="flex items-center gap-4">
            <x-primary-button>{{ __('Save') }}</x-primary-button>
        </div>
    </form>
</section>
