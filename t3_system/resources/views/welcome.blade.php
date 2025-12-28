<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Team Time Tracking</title>
    <link rel="icon" type="image/svg+xml" href="{{ asset('clean_logo.png') }}">

    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>

<body>

    <div class="flex min-h-[100dvh] flex-col">
        <header class="flex items-center justify-between bg-background px-4 py-4 lg:px-6">
            <a class="flex items-center gap-2" href="#">
                <img src="{{ asset('clean_logo.png') }}" width="60" height="50" alt="Logo"
                    style="aspect-ratio:32/32;object-fit:cover" />
                <span class="text-xl font-bold">Team Time Tracking</span>
            </a>
            <nav class="hidden items-center gap-6 lg:flex">
                <a class="text-sm font-medium underline-offset-4 hover:underline" href="#caractéristiques">
                    Caractéristiques </a>
                <a class="text-sm font-medium underline-offset-4 hover:underline" href="#aboutus"> Qui sommes-nous ?
                </a>
                <a class="text-sm font-medium underline-offset-4 hover:underline" href="#Tarifs"> Tarifs </a>
                <a class="text-sm font-medium underline-offset-4 hover:underline" href="#FAQ"> FAQ </a>
            </nav>

            <div class="flex space-x-4">
                <button
                    class="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">Commencer</button>
                <a class="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-background ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                    style="color: black !important" href="{{ route('login') }}">Espace client</a>
            </div>

        </header>
        <main class="flex-1">
            <section id="home" class="bg-gradient-to-r from-primary to-primary-foreground py-20 md:py-32 lg:py-40">
                <div class="container grid grid-cols-1 items-center gap-8 px-4 md:grid-cols-2 md:px-6">
                    <div class="space-y-4">
                        <h1 class="text-4xl font-bold text-background md:text-5xl lg:text-6xl">Streamline Your
                            Consulting Firm with Team Time Tracking</h1>
                        <p class="text-lg text-background md:text-xl">Unlock the power of our cloud-based CRM ERP system
                            to manage your commercial, HR, and administrative operations with ease.</p> <br>
                        <div class="flex gap-4">
                            <button
                                class="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                                Commencer</button>
                            <a href="#aboutus"
                                class="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-background ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                                style="color: black !important">En savoir plus</a>
                        </div>
                    </div>
                    <img src="{{ asset('home1.png') }}" width="1300" height="600" alt="Hero"
                        class="mx-auto rounded-xl shadow-xl" style="aspect-ratio:600/400;object-fit:cover" />
                </div>
            </section>

            <section id="caractéristiques" class="bg-muted py-20 md:py-32 lg:py-40">
                <div class="container mx-auto px-4 md:px-6">
                    <div class="mb-12 space-y-4 text-center">
                        <p class="text-lg text-muted-foreground md:text-xl">Streamline your consulting firm's operations
                            with our powerful CRM ERP system.</p>
                    </div>
                    <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <div class="space-y-4 rounded-xl bg-background p-6 shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="h-8 w-8 text-primary">
                                <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"></path>
                                <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
                                <path d="M12 2v2"></path>
                                <path d="M12 22v-2"></path>
                                <path d="m17 20.66-1-1.73"></path>
                                <path d="M11 10.27 7 3.34"></path>
                                <path d="m20.66 17-1.73-1"></path>
                                <path d="m3.34 7 1.73 1"></path>
                                <path d="M14 12h8"></path>
                                <path d="M2 12h2"></path>
                                <path d="m20.66 7-1.73 1"></path>
                                <path d="m3.34 17 1.73-1"></path>
                                <path d="m17 3.34-1 1.73"></path>
                                <path d="m11 13.73-4 6.93"></path>
                            </svg>
                            <h3 class="text-xl font-bold">Commercial Management</h3>
                            <p class="text-muted-foreground">Manage your sales pipeline, client relationships, and
                                invoicing with ease.</p>
                        </div>
                        <div class="space-y-4 rounded-xl bg-background p-6 shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="h-8 w-8 text-primary">
                                <path
                                    d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z">
                                </path>
                                <path d="m14.5 12.5 2-2"></path>
                                <path d="m11.5 9.5 2-2"></path>
                                <path d="m8.5 6.5 2-2"></path>
                                <path d="m17.5 15.5 2-2"></path>
                            </svg>
                            <h3 class="text-xl font-bold">HR Management</h3>
                            <p class="text-muted-foreground">Streamline your HR processes, from onboarding to
                                performance reviews.</p>
                        </div>
                        <div class="space-y-4 rounded-xl bg-background p-6 shadow-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="h-8 w-8 text-primary">
                                <rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect>
                                <rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect>
                                <line x1="6" x2="6.01" y1="6" y2="6"></line>
                                <line x1="6" x2="6.01" y1="18" y2="18"></line>
                            </svg>
                            <h3 class="text-xl font-bold">Administrative Management</h3>
                            <p class="text-muted-foreground">Centralize your administrative tasks, from project
                                management to resource allocation.</p>
                        </div>
                    </div>
                    <br>
                    <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <div class="space-y-4 rounded-xl bg-background p-6 shadow-md">
                            <svg data-id="31" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" class="h-8 w-8 text-primary">
                                <path d="M5 7 3 5"></path>
                                <path d="M9 6V3"></path>
                                <path d="m13 7 2-2"></path>
                                <circle cx="9" cy="13" r="3"></circle>
                                <path
                                    d="M11.83 12H20a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2.17">
                                </path>
                                <path d="M16 16h2"></path>
                            </svg>
                            <h3 class="text-xl font-bold">Commercial Management</h3>
                            <p class="text-muted-foreground">Manage your sales pipeline, client relationships, and
                                invoicing with ease.</p>
                        </div>
                        <div class="space-y-4 rounded-xl bg-background p-6 shadow-md">
                            <svg data-id="66" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round" class="  text-primary">
                                <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path>
                                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                                <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path>
                                <path d="M2 7h20"></path>
                                <path
                                    d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7">
                                </path>
                            </svg>
                            <h3 class="text-xl font-bold">HR Management </h3>
                            <p class="text-muted-foreground">Streamline your HR processes, from onboarding to
                                performance reviews.</p>
                        </div>
                        <div class="space-y-4 rounded-xl bg-background p-6 shadow-md">
                            <svg width="24" height="24" viewBox="0 0 24 24"
                                fill="none"xmlns="http://www.w3.org/2000/svg" ">
                            <path
                            d=" M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046
                                20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                strokeLinejoin="round" />
                            <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                strokeLinejoin="round" />
                            <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                strokeLinejoin="round" />
                            <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                strokeLinejoin="round" />
                            <path d="M10 9H9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                strokeLinejoin="round" />
                            </svg>
                            <h3 class="text-xl font-bold">Administrative Management</h3>
                            <p class="text-muted-foreground">Centralize your administrative tasks, from project
                                management to resource allocation.</p>
                        </div>
                    </div>
                </div>
            </section>
            <section id="aboutus" class="  py-12 md:py-24 lg:py-32">
                <div class="container mx-auto px-4 md:px-6">
                    <div class="flex flex-col items-center justify-center space-y-8 text-center">
                        <div class="max-w-3xl mx-auto">
                            <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-gray-900">
                                Qui sommes-nous ?</h2>
                            <p class="mt-4 text-lg text-gray-700">Discover the story behind Acme ERP and what drives
                                us.</p>
                        </div>
                        <div
                            class="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-12 mt-8">
                            <div class="max-w-md text-left">
                                <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                                <p class="text-gray-700">At Acme ERP, our mission is to empower businesses with
                                    powerful, intuitive, and scalable ERP solutions that streamline operations and
                                    foster growth.</p>
                            </div>
                            <div class="max-w-md text-left mt-8 md:mt-0">
                                <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                                <p class="text-gray-700">We envision a future where businesses of all sizes can
                                    leverage advanced technology to achieve operational excellence and drive sustainable
                                    success.</p>
                            </div>
                        </div>
                        <div
                            class="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-12 mt-8">
                            <div class="max-w-md text-left">
                                <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                                <p class="text-gray-700">At Acme ERP, our mission is to empower businesses with
                                    powerful, intuitive, and scalable ERP solutions that streamline operations and
                                    foster growth.</p>
                            </div>
                            <div class="max-w-md text-left mt-8 md:mt-0">
                                <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                                <p class="text-gray-700">We envision a future where businesses of all sizes can
                                    leverage advanced technology to achieve operational excellence and drive sustainable
                                    success.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="Tarifs" class="bg-muted py-20 md:py-32 lg:py-40">
                <div class="container mx-auto px-4 md:px-6">
                    <div class="mb-12 space-y-4 text-center">
                        <h2 class="text-3xl font-bold md:text-4xl lg:text-5xl">Tarifs</h2>
                        <p class="text-lg text-muted-foreground md:text-xl">Choisissez le plan qui correspond le mieux
                            aux besoins de votre cabinet de conseil.</p>
                    </div>
                    <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
                        <div class="space-y-4 rounded-xl border bg-background p-6 text-card-foreground shadow-md"
                            data-v0-t="card">
                            <div class="flex flex-col space-y-1.5 p-6">
                                <h3 class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">PLAN 1
                                </h3>
                                <p class="text-sm text-muted-foreground">3,5 euros par utilisateur par mois, durée
                                    d'engagement 12 mois. Peu importe le profil (Manager ou Consultant)</p>
                            </div>
                            <div class="p-6">
                                <div class="space-y-2">
                                    <p class="text-4xl font-bold">3,5€</p>
                                    <p class="text-muted-foreground">par utilisateur par mois</p>
                                </div>
                                <ul class="mt-4 space-y-2">
                                    <li class="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                            class="w-5 h-5 fill-primary">
                                            <path d="M20 6 9 17l-5-5"></path>
                                        </svg>
                                        CRA
                                    </li>
                                    <li class="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                            class="w-5 h-5 fill-primary">
                                            <path d="M20 6 9 17l-5-5"></path>
                                        </svg>

                                        Générateurs de facture
                                    </li>
                                    <li class="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                            class="w-5 h-5 fill-primary">
                                            <path d="M20 6 9 17l-5-5"></path>
                                        </svg>
                                        Déclaration de congé
                                    </li>
                                </ul>
                            </div>
                            <div class="flex items-center p-6">
                                <button
                                    class="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">Commencer</button>
                            </div>
                        </div>
                        <div class="space-y-4 rounded-xl border bg-background p-6 text-card-foreground shadow-md"
                            data-v0-t="card">
                            <div class="flex flex-col space-y-1.5 p-6">
                                <h3 class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">PLAN 2
                                </h3>
                                <p class="text-sm text-muted-foreground">10 euros par utilisateur par mois. Inclut tous
                                    les modules de base et les modules futurs</p>
                            </div>
                            <div class="p-6">
                                <div class="space-y-2">
                                    <p class="text-4xl font-bold">10€</p>
                                    <p class="text-muted-foreground">par utilisateur par mois</p>
                                </div>
                                <ul class="mt-4 space-y-2">
                                    <li class="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                            class="w-5 h-5 fill-primary">
                                            <path d="M20 6 9 17l-5-5"></path>
                                        </svg>
                                        CRA
                                    </li>
                                    <li class="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                            class="w-5 h-5 fill-primary">
                                            <path d="M20 6 9 17l-5-5"></path>
                                        </svg>
                                        Générateurs de facture
                                    </li>
                                    <li class="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                            class="w-5 h-5 fill-primary">
                                            <path d="M20 6 9 17l-5-5"></path>
                                        </svg>
                                        Déclaration de congé
                                    </li>
                                    <li class="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                            class="w-5 h-5 fill-primary">
                                            <path d="M20 6 9 17l-5-5"></path>
                                        </svg>
                                        Modules futurs
                                    </li>
                                </ul>
                            </div>
                            <div class="flex items-center p-6">
                                <button
                                    class="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">Commencer</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section id="FAQ" class="w-full py-12 md:py-24 lg:py-32">
                <div class="container mx-auto px-4 md:px-6">
                    <div class="flex flex-col items-center justify-center space-y-4 text-center">
                        <div class="space-y-2">
                            <h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">FAQ</h2>
                            <br>
                            <p
                                class="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                Get answers to the most common questions about Acme ERP and how it can benefit your
                                business.
                            </p>
                        </div>
                        <div class="mx-auto w-full max-w-3xl space-y-4">
                            <div class="rounded-lg border bg-background p-4 shadow-sm">
                                <button type="button" aria-controls="faq1" aria-expanded="false"
                                    class="flex w-full items-center justify-between toggle-btn">
                                    <h3 class="text-lg font-medium">What is Acme ERP and how does it work?</h3>
                                </button>
                                <div id="faq1" class="hidden">
                                    <br>
                                    <p>Acme ERP is a comprehensive enterprise resource planning software that helps
                                        businesses manage their operations, including finance, human resources, supply
                                        chain, and more.</p>
                                </div>
                            </div>
                            <div class="rounded-lg border bg-background p-4 shadow-sm">
                                <button type="button" aria-controls="faq2" aria-expanded="false"
                                    class="flex w-full items-center justify-between toggle-btn">
                                    <h3 class="text-lg font-medium">What are the key features of Acme ERP?</h3>
                                </button>
                                <div id="faq2" class="hidden">
                                    <br>
                                    <p>Acme ERP offers key features such as real-time data analytics, automated
                                        workflows, customizable dashboards, and seamless integration with other business
                                        tools.</p>
                                </div>
                            </div>
                            <div class="rounded-lg border bg-background p-4 shadow-sm">
                                <button type="button" aria-controls="faq3" aria-expanded="false"
                                    class="flex w-full items-center justify-between toggle-btn">
                                    <h3 class="text-lg font-medium">How much does Acme ERP cost?</h3>
                                </button>
                                <div id="faq3" class="hidden">
                                    <br>
                                    <p>The cost of Acme ERP varies based on the number of users and the specific modules
                                        required. Contact our sales team for a customized quote.</p>
                                </div>
                            </div>
                            <div class="rounded-lg border bg-background p-4 shadow-sm">
                                <button type="button" aria-controls="faq4" aria-expanded="false"
                                    class="flex w-full items-center justify-between toggle-btn">
                                    <h3 class="text-lg font-medium">How secure is Acme ERP?</h3>
                                </button>
                                <div id="faq4" class="hidden">
                                    <br>
                                    <p>Acme ERP is highly secure, with advanced encryption protocols, regular security
                                        updates, and compliance with industry standards to ensure your data is
                                        protected.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


        </main>
        <footer class="bg-gray-100 text-gray-800 py-8">
            <div class="container mx-auto px-4">
                <div class="flex flex-wrap justify-between">
                    <!-- Logo and Company Info -->
                    <div class="w-full md:w-1/3 mb-6 md:mb-0">
                        <img src="{{ asset('clean_logo.png') }}" alt="Company Logo" class="h-12 mb-2">
                    </div>

                    <!-- Contact Information -->
                    <div class="w-full md:w-1/3 mb-6 md:mb-0">
                        <h4 class="text-lg font-semibold mb-2">Contactez-nous</h4>
                        <p class="text-sm">
                            <img class="inline-block w-5 h-5 mr-2"
                                src="https://www.svgrepo.com/show/521128/email-1.svg" />
                            info@teamtimetracking.com
                        </p> <br>
                        <p class="text-sm">
                            <img class="inline-block w-5 h-5 mr-2"
                                src="https://www.svgrepo.com/show/355987/mobile-code.svg" />
                            +1 234 567 890
                        </p><br>
                        <p class="text-sm">
                            <img class="inline-block w-5 h-5 mr-2"
                                src="https://www.svgrepo.com/show/488218/gps.svg" />
                            1234 Street Name, City, Country
                        </p>
                    </div>

                    <!-- Navigation Links -->
                    <div class="w-full md:w-1/3 mb-6 md:mb-0">
                        <h4 class="text-lg font-semibold mb-2">Liens rapides</h4>
                        <ul class="text-sm space-y-2">
                            <u>
                                <li><a href="#home" class="hover:underline">Accueil</a></li>
                            </u>
                            <u>
                                <li><a href="#Tarifs" class="hover:underline">Tarifs</a></li>
                            </u>
                            <u>
                                <li><a href="#aboutus" class="hover:underline">Qui sommes-nous ?</a></li>
                            </u>
                            <u>
                                <li><a href="#caractéristiques" class="hover:underline">caractéristiques</a></li>
                            </u>
                            <u>
                                <li><a href="#FAQ" class="hover:underline">FAQ</a></li>
                            </u>
                        </ul>
                    </div>
                </div>
                <div class="mt-8 border-t border-gray-700 pt-4 flex flex-wrap justify-between items-center">
                    <p>&copy; Team Time Tracking.</p>
                    <p class="text-sm">
                        <a href="/terms" class="hover:underline">Mentions légales</a> |
                        <a href="/policy" class="hover:underline">Politique de confidentialité</a>
                    </p>
                </div>

            </div>
        </footer>

    </div>
    </div>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const toggleButtons = document.querySelectorAll('.toggle-btn');

            toggleButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const content = document.getElementById(button.getAttribute('aria-controls'));
                    const isExpanded = button.getAttribute('aria-expanded') === 'true';

                    button.setAttribute('aria-expanded', !isExpanded);
                    content.classList.toggle('hidden');
                });
            });
        });
    </script>
</body>

</html>
