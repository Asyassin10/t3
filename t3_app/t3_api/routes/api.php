<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\Api\AbsenceController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ApplicationDataController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientCommercialDataController;
use App\Http\Controllers\Api\ForgetPasswordController;
use App\Http\Controllers\Api\JourferiersController;
use App\Http\Controllers\Api\LanguageController;
use App\Http\Controllers\Api\ManagerController;
use App\Http\Controllers\Api\ModuleController;
use App\Http\Controllers\Api\TimeTrackingController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\ClientB2BController;
use App\Http\Controllers\ClientEsoftController;
use App\Http\Controllers\ConsultantController;
use App\Http\Controllers\FactureController;
use App\Http\Controllers\PaymentFactureController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SearchController;
use App\Models\ClientB2B;
use App\Models\User;
use App\Services\FactureService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

Route::post("/initClientEsoft", [
    AuthController::class,
    "initClientEsoft",
])->name("initClientEsoft");
Route::post("/login", [AuthController::class, "loginUser"])->name("loginUser");
Route::post("/active_account", [
    UserController::class,
    "activateAccount",
])->name("activateAccount");
// forget pwds
Route::post("/forgot-password", [
    ForgetPasswordController::class,
    "CheckEmailAndSendCode",
])->name("CheckEmailAndSendCode");
Route::post("/validate-code", [
    ForgetPasswordController::class,
    "ValidateCode",
])->name("ValidateCode");
Route::post("/reset-code", [
    ForgetPasswordController::class,
    "resetPassword",
])->name("resetPassword");
//Route::post("/reset_password", [AuthController::class, "resetPassword"])->name("resetPassword");
// time_sheet routes
Route::middleware(["auth:sanctum", "setLocale", "check.paye"])->group(function () {

    Route::get(
        uri: "/global-search",
        action: [SearchController::class, "GlobalSearch"],
    )->name(name: "GlobalSearch");

    Route::post("/logout", [AuthController::class, "logout"])->name("logout");
    Route::get("/me", [AuthController::class, "me"])->name("me");
    Route::get("/profile", [ProfileController::class, "showProfile"])->name(
        "profile",
    );
    Route::post("/update-profile-data", [
        ProfileController::class,
        "updateUserData",
    ])->name("updateUserData");
    Route::post("/update-profile-password", [
        ProfileController::class,
        "updatePassword",
    ])->name("updatePassword");




    Route::get("/users/get_assigned_users", [
        UserController::class,
        "GetAssignedUsers",
    ]);
    // test cra module

    Route::prefix("/application-data")->group(function () {
        Route::get(
            uri: "/get-application-data",
            action: [ApplicationDataController::class, "getApplicationData"],
        )->name("getApplicationData");
        Route::post("/update-application-data", [
            ApplicationDataController::class,
            "updateApplicationData",
        ])->name(name: "updateApplicationData");
        Route::post("/update-application-logo", [
            ApplicationDataController::class,
            "updateLogo",
        ])->name("updateLogo");
    });

    // Route::middleware(['ModuleMiddleware:CRA'])->group(function () {
    Route::get("/time_sheet/get_cra_of_me", [
        TimeTrackingController::class,
        "getCrasOfMe",
    ])->name("getCrasOfMe");

    Route::post("/time_sheet/create_sheet_ligne", [
        TimeTrackingController::class,
        "CreateTimeLigne",
    ]);
    Route::delete("/time_sheet/delete_sheet_ligne", [
        TimeTrackingController::class,
        "DeleteTimeLigne",
    ])->name("DeleteTimeLigne");
    Route::post("/time_sheet/get_time_sheet_of_user", [
        TimeTrackingController::class,
        "getTimeSheetOfUserBasedOnDate",
    ])->name("getTimeSheetOfUserBasedOnDate");
    Route::post("/time_sheet/update_comment_of_time_sheet", [
        TimeTrackingController::class,
        "UpdateCommentOfTimeLigne",
    ])->name("UpdateCommentOfTimeLigne");
    Route::post("/time_sheet/send_cra_to_validation", [
        TimeTrackingController::class,
        "SendCraToValidation",
    ])->name("SendCraToValidation");
    Route::post("/time_sheet/undo_send_cra_to_validation", [
        TimeTrackingController::class,
        "UndoSendCraToValidation",
    ])->name("UndoSendCraToValidation");
    Route::post("/time_sheet/init_cra", [
        TimeTrackingController::class,
        "initCra",
    ])->name("initCra");
    Route::get("/time_sheet/get_cra/{id}", [
        TimeTrackingController::class,
        "getCra",
    ])->name("getCra");
    Route::post("/time_sheet/validate_cra", [
        TimeTrackingController::class,
        "ValidateCra",
    ])->name("ValidateCra");

    Route::get("/time_sheet/does_it_have_data_in_the_current_time", [
        TimeTrackingController::class,
        "doasItHqveCraForTheCurrentTime",
    ])->name("doasItHqveCraForTheCurrentTime");
    Route::post("/time_sheet/UpdateNumbersDaysOfCra", [
        TimeTrackingController::class,
        "UpdateNumbersDaysOfCra",
    ])->name("UpdateNumbersDaysOfCra");
    //    });

    Route::post("/absence/create_absence_request", [
        AbsenceController::class,
        "CreateAbsenceRequest",
    ]);
    Route::post("/absence/get_absence_of_date_month_and_year", [
        AbsenceController::class,
        "GetAbsenceOfDateMonthAndYear",
    ]);
    Route::get("/absence/get_absence_of_user", [
        AbsenceController::class,
        "GetAbsenceOfMe",
    ]);
    Route::get("/absence/get_absence_types", [
        AbsenceController::class,
        "GetListOfAbsenceTypes",
    ]);
    Route::post(
        uri: "/absence/update_absence",
        action: [AbsenceController::class, "updateAbsence"],
    );
    Route::get("/absence/get_all_absence_status", [
        AbsenceController::class,
        "GetAllAbsenceStatus",
    ]);


    //  });

    // manager routes
    Route::get("/manager/get_concultants_of_manager", [
        ManagerController::class,
        "GetConcultantsOfManager",
    ])->name("GetConcultantsOfManager");
    Route::post("/manager/get_manager_profile", [
        ManagerController::class,
        "GetManagerProfileData",
    ])->name("GetManagerProfileData");
    Route::post("/manager/create_manager", [
        ManagerController::class,
        "CreateManager",
    ])->name("CreateManager");
    Route::post("/manager/update_manager", [
        ManagerController::class,
        "updateManager",
    ])->name("updateManager");
    Route::post("/manager/re_notify_manager", [
        ManagerController::class,
        "ReNotifyManager",
    ])->name("ReNotifyManager");
    Route::get("/manager/get_managers", [
        ManagerController::class,
        "GetManagers",
    ])->name("GetManagers");
    Route::get("/manager/get_managers_non_paginated", [
        ManagerController::class,
        "getManagersNonPaginated",
    ])->name("getManagersNonPaginated");

    // client b2b routes
    Route::post("/client_b2b/get_clientB2b_details", [
        ClientB2BController::class,
        "GetClientB2bDetails",
    ])->name("GetClientB2bDetails");
    // tested
    Route::post("/client_b2b/create_client_b2b", [
        ClientB2BController::class,
        "CreateB2BClient",
    ])->name("CreateB2BClient");
    Route::post("/client_b2b/update_client_b2b/{id}", [
        ClientB2BController::class,
        "UpdateB2BClient",
    ])->name("UpdateB2BClient");
    // tested
    Route::get("/client_b2b/get_all_client_b2b", [
        ClientB2BController::class,
        "GetAllClientB2B",
    ])->name("GetAllClientB2B");
    // projects routes


    Route::post("/projects/create_project", [
        ProjectController::class,
        "CreateProject",
    ])->name("CreateProject");
    Route::get("/projects/get_projects", [
        ProjectController::class,
        "GetAllProjects",
    ])->name("GetAllProjects");
    Route::get("/projects/get_projects_non_paginated", [
        ProjectController::class,
        "GetAllProjectsNonPaginated",
    ])->name("GetAllProjectsNonPaginated");
    Route::get("/projects/get_projectsQuery", [
        ProjectController::class,
        "GetAllProjectsQuery",
    ])->name("GetAllProjectsQuery");
    Route::get("/projects/get_all_project_status", [
        ProjectController::class,
        "GetAllProjectStatus",
    ])->name("GetAllProjectStatus");
    Route::post("/projects/assign_project_to_manager", [
        ProjectController::class,
        "AssignProjectToManager",
    ])->name("AssignProjectToManager");
    Route::post("/projects/unassign_project_to_manager", [
        ProjectController::class,
        "UnAssignProjectToManager",
    ])->name("UnAssignProjectToManager");

    // lang routes
    Route::post("/language/set", [
        LanguageController::class,
        "setLanguage",
    ])->name("setLang");
    Route::get("/language/get", [
        LanguageController::class,
        "getLanguage",
    ])->name("getLang");

    // consultant routes
    Route::post("/consultant/create_consultant", [
        ConsultantController::class,
        "CreateConsultant",
    ])->name("CreateConsultant");
    Route::post("/consultant/assign_concultant_to_project", [
        ConsultantController::class,
        "AssignConcultantToProject",
    ])->name("AssignConcultantToProject");
    Route::get("/consultant/get_consultants", [
        ConsultantController::class,
        "GetConsultants",
    ])->name("GetConsultants");
    Route::get("/consultant/get_consultants_non_paginated", [
        ConsultantController::class,
        "GetConsultantsNonPaginated",
    ])->name("GetConsultantsNonPaginated");


    // activity routes
    Route::put("/activity/update_activity/{id}", [
        ActivityController::class,
        "UpdateActivity",
    ])->name("UpdateActivity");
    Route::delete("/activity/delete_activity/{id}", [
        ActivityController::class,
        "deleteActivity",
    ])->name("deleteActivity");
    Route::post("/activity/create_activity", [
        ActivityController::class,
        "CreateActivity",
    ])->name("CreateActivity");
    Route::get("/activity/get_activities", [
        ActivityController::class,
        "GetAllActivities",
    ])->name("GetAllActivities");

    Route::get("/holidays/current-month", [
        JourferiersController::class,
        "getCurrentMonthHolidays",
    ]);

    Route::middleware(["admin"])->group(function () {
        Route::post("/admin/accept_account_request", [
            AdminController::class,
            "accept_account_request",
        ])->name(name: "accept_account_request");
    });
    Route::middleware(["clientEsoft"])->group(function () {
        Route::post("/updateKbisFile", [
            AuthController::class,
            "updateKbisFile",
        ])->name("updateKbisFile");
        Route::get("/holidays/index", [
            JourferiersController::class,
            "index",
        ]);
        Route::post("/holidays/store", [
            JourferiersController::class,
            "store",
        ]);

        Route::get("/holidays/show/{jourferier}", [
            JourferiersController::class,
            "show",
        ]);

        Route::post("/holidays/update/{jourferier}", [
            JourferiersController::class,
            "update",
        ]);
        Route::delete("/holidays/destroy/{jourferier}", [
            JourferiersController::class,
            "destroy",
        ]);


        Route::get("/modules/ListAccessibleModules", [
            ModuleController::class,
            "ListAccessibleModules",
        ])->name("ListAccessibleModules");




        Route::prefix("payments_factures")->group(function () {
            Route::post("save", [
                PaymentFactureController::class,
                "savePaymentForFacture",
            ]);
        });
        Route::post("/facture/generate-pdf", [
            FactureController::class,
            "generatePdf",
        ])->name("generatePdf");
        Route::post("/facture/generate", [
            FactureController::class,
            "generate",
        ])->name("generate");
        Route::get("/facture/get_factures", [
            FactureController::class,
            "GetFactures",
        ])->name("GetFactures");
        Route::post("/facture/save_facture", [
            FactureController::class,
            "saveFacture",
        ])->name("saveFacture");
        Route::post("/facture/save_factures_of_clients", [
            FactureController::class,
            "saveFacturesOfClient",
        ])->name("saveFacturesOfClient");
        Route::post("/facture/deletePdf", [
            FactureController::class,
            "deletePdf",
        ])->name("deletePdf");
        Route::post("/facture/save-note", [
            FactureController::class,
            "setNote",
        ])->name("setNote");
        Route::post("/facture/make-it-paid", [
            FactureController::class,
            "MakeFacturePaid",
        ])->name("MakeFacturePaid");
        Route::post("/manager/delete-manager/{id}", [
            ManagerController::class,
            "deleteManager",
        ])->name("deleteManager");
        Route::post("/client_b2b/delete/{id}", [
            ClientEsoftController::class,
            "deleteB2BClient",
        ])->name("deleteB2BClient");
        Route::post("/project/delete/{id}", [
            ProjectController::class,
            "Delete_Project",
        ])->name("deleteProject");





        Route::post("/sync-client-commercial-data", [
            ClientCommercialDataController::class,
            "syncClientCommercialDataWithClient",
        ])->name("syncClientCommercialDataWithClient");
        Route::get("/get-app-commercial-data", [
            ClientCommercialDataController::class,
            "getAppCommercialData",
        ])->name("getAppCommercialData");
        Route::post(
            uri: "/set-app-commercial-data",
            action: [
                ClientCommercialDataController::class,
                "syncClientCommercialDataForApp",
            ],
        )->name(name: "syncClientCommercialDataForApp");
    });
});
