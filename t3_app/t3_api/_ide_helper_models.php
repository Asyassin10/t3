<?php

// @formatter:off
// phpcs:ignoreFile
/**
 * A helper file for your Eloquent Models
 * Copy the phpDocs from this file to the correct Model,
 * And remove them from this file, to prevent double declarations.
 *
 * @author Barry vd. Heuvel <barryvdh@gmail.com>
 */


namespace App\Models{
/**
 * @property int $id
 * @property int $nombre_des_jours
 * @property string|null $date_debut
 * @property string|null $date_fin
 * @property string|null $date_exacte
 * @property string|null $date_validation
 * @property bool $is_valid
 * @property int $type_absence_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $user_id
 * @property string|null $reason
 * @property string $status
 * @property-read \App\Models\AbsenceRequestType $type_absence
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\AbsenceRequestFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|AbsenceRequest newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AbsenceRequest newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AbsenceRequest query()
 * @method static \Illuminate\Database\Eloquent\Builder|AbsenceRequest whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AbsenceRequest whereDateDebut($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AbsenceRequest whereDateExacte($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AbsenceRequest whereDateFin($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AbsenceRequest whereDateValidation($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AbsenceRequest whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AbsenceRequest whereIsValid($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AbsenceRequest whereNombreDesJours($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AbsenceRequest whereReason($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AbsenceRequest whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AbsenceRequest whereTypeAbsenceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AbsenceRequest whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AbsenceRequest whereUserId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperAbsenceRequest {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $label_type_absence
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\AbsenceRequestTypeFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|AbsenceRequestType newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AbsenceRequestType newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AbsenceRequestType query()
 * @method static \Illuminate\Database\Eloquent\Builder|AbsenceRequestType whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AbsenceRequestType whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AbsenceRequestType whereLabelTypeAbsence($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AbsenceRequestType whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperAbsenceRequestType {}
}

namespace App\Models{
/**
 * @method static \Illuminate\Database\Eloquent\Builder|AccountCreationRequest newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AccountCreationRequest newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AccountCreationRequest query()
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperAccountCreationRequest {}
}

namespace App\Models{
/**
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $project_id
 * @property string $activity_name
 * @property int $user_id
 * @property-read \App\Models\Project $project
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\ActiviteFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|Activite newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Activite newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Activite query()
 * @method static \Illuminate\Database\Eloquent\Builder|Activite whereActivityName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Activite whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Activite whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Activite whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Activite whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Activite whereUserId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperActivite {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $key
 * @property string $value
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|AppCommercialData newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AppCommercialData newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AppCommercialData query()
 * @method static \Illuminate\Database\Eloquent\Builder|AppCommercialData whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AppCommercialData whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AppCommercialData whereKey($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AppCommercialData whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AppCommercialData whereValue($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperAppCommercialData {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $date_of_start_sending_notifications
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $logo
 * @method static \Database\Factories\ApplicationDataFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|ApplicationData newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ApplicationData newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ApplicationData query()
 * @method static \Illuminate\Database\Eloquent\Builder|ApplicationData whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ApplicationData whereDateOfStartSendingNotifications($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ApplicationData whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ApplicationData whereLogo($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ApplicationData whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperApplicationData {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $assigned_module_name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|AssignedModules newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AssignedModules newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AssignedModules query()
 * @method static \Illuminate\Database\Eloquent\Builder|AssignedModules whereAssignedModuleName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AssignedModules whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AssignedModules whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AssignedModules whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperAssignedModules {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $siren
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|BankInfoClientB2b newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BankInfoClientB2b newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BankInfoClientB2b query()
 * @method static \Illuminate\Database\Eloquent\Builder|BankInfoClientB2b whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BankInfoClientB2b whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BankInfoClientB2b whereSiren($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BankInfoClientB2b whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperBankInfoClientB2b {}
}

namespace App\Models{
/**
 * @property int $id
 * @property float $number_of_days_filled
 * @property int|null $number_of_days_available
 * @property int $user_id
 * @property int $is_sent_to_validation
 * @property int $is_validated
 * @property string|null $date_sent_to_validation
 * @property string|null $date_validation
 * @property string $status
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $progress
 * @property int $is_notified
 * @property string|null $date_of_notified
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TimeSheet> $time_sheet
 * @property-read int|null $time_sheet_count
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\CRAFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|CRA newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CRA newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|CRA query()
 * @method static \Illuminate\Database\Eloquent\Builder|CRA whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CRA whereDateOfNotified($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CRA whereDateSentToValidation($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CRA whereDateValidation($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CRA whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CRA whereIsNotified($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CRA whereIsSentToValidation($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CRA whereIsValidated($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CRA whereNumberOfDaysAvailable($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CRA whereNumberOfDaysFilled($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CRA whereProgress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CRA whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CRA whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|CRA whereUserId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperCRA {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $client_esoft_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $client_b2b_name
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\ClientCommercialData> $commercialData
 * @property-read int|null $commercial_data_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Facture> $factures
 * @property-read int|null $factures_count
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Project> $projects
 * @property-read int|null $projects_count
 * @property-read \App\Models\User|null $user
 * @method static \Database\Factories\ClientB2BFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|ClientB2B newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ClientB2B newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ClientB2B query()
 * @method static \Illuminate\Database\Eloquent\Builder|ClientB2B whereClientB2bName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClientB2B whereClientEsoftId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClientB2B whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClientB2B whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClientB2B whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperClientB2B {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $client_b2b_id
 * @property string $key
 * @property string $value
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\ClientB2B $clientB2b
 * @method static \Illuminate\Database\Eloquent\Builder|ClientCommercialData newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ClientCommercialData newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ClientCommercialData query()
 * @method static \Illuminate\Database\Eloquent\Builder|ClientCommercialData whereClientB2bId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClientCommercialData whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClientCommercialData whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClientCommercialData whereKey($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClientCommercialData whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClientCommercialData whereValue($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperClientCommercialData {}
}

namespace App\Models{
/**
 * @property int $id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $user_id
 * @property string|null $kbis_file
 * @property string|null $app_api_key
 * @property string|null $user_subscriptionplan_date_start
 * @property string|null $user_subscriptionplan_date_end
 * @property-read \App\Models\User|null $user
 * @method static \Database\Factories\ClientEsoftFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|ClientEsoft newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ClientEsoft newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ClientEsoft query()
 * @method static \Illuminate\Database\Eloquent\Builder|ClientEsoft whereAppApiKey($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClientEsoft whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClientEsoft whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClientEsoft whereKbisFile($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClientEsoft whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClientEsoft whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClientEsoft whereUserSubscriptionplanDateEnd($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ClientEsoft whereUserSubscriptionplanDateStart($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperClientEsoft {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $consultant_id
 * @property int $project_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $price_per_day
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\Activite> $activite
 * @property-read int|null $activite_count
 * @property-read \App\Models\Consultant|null $concultants
 * @method static \Illuminate\Database\Eloquent\Builder|ConsultantProject newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ConsultantProject newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ConsultantProject query()
 * @method static \Illuminate\Database\Eloquent\Builder|ConsultantProject whereConsultantId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ConsultantProject whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ConsultantProject whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ConsultantProject wherePricePerDay($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ConsultantProject whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ConsultantProject whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperConsultantProject {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $year
 * @property int $month
 * @property string $date_facture
 * @property int $nombre_consultant
 * @property string $numero_facture
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $client_b2b_id
 * @property string $facture_path
 * @property \App\Enums\FactureStatus $status
 * @property \Illuminate\Support\Carbon|null $paid_at
 * @property string|null $note
 * @method static \Illuminate\Database\Eloquent\Builder|Facture newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Facture newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Facture query()
 * @method static \Illuminate\Database\Eloquent\Builder|Facture whereClientB2bId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Facture whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Facture whereDateFacture($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Facture whereFacturePath($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Facture whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Facture whereMonth($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Facture whereNombreConsultant($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Facture whereNote($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Facture whereNumeroFacture($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Facture wherePaidAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Facture whereStatus($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Facture whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Facture whereYear($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperFacture {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $jourferiers_date
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $description
 * @property int|null $number_days
 * @method static \Illuminate\Database\Eloquent\Builder|Jourferier newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Jourferier newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Jourferier query()
 * @method static \Illuminate\Database\Eloquent\Builder|Jourferier whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Jourferier whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Jourferier whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Jourferier whereJourferiersDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Jourferier whereNumberDays($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Jourferier whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperJourferier {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $module_name
 * @property string|null $description
 * @property string $full_name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|Module newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Module newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Module query()
 * @method static \Illuminate\Database\Eloquent\Builder|Module whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Module whereDescription($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Module whereFullName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Module whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Module whereModuleName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Module whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperModule {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $facture_id
 * @property string|null $reference
 * @property string $amount
 * @property string $currency
 * @property string $payment_method
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Facture $facture
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentFacture newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentFacture newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentFacture query()
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentFacture whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentFacture whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentFacture whereCurrency($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentFacture whereFactureId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentFacture whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentFacture wherePaymentMethod($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentFacture whereReference($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PaymentFacture whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperPaymentFacture {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $permission_name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|Permission newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Permission newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Permission query()
 * @method static \Illuminate\Database\Eloquent\Builder|Permission whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Permission whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Permission wherePermissionName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Permission whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperPermission {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $role_id
 * @property int $permission_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|PermissionRole newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PermissionRole newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|PermissionRole query()
 * @method static \Illuminate\Database\Eloquent\Builder|PermissionRole whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PermissionRole whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PermissionRole wherePermissionId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PermissionRole whereRoleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|PermissionRole whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperPermissionRole {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $project_id
 * @property int $manager_id
 * @property int $project_manager_price_per_day
 * @property string|null $date_of_start
 * @property string|null $date_of_end
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Database\Factories\ProjectManagerFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|ProjectManager newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ProjectManager newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ProjectManager query()
 * @method static \Illuminate\Database\Eloquent\Builder|ProjectManager whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProjectManager whereDateOfEnd($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProjectManager whereDateOfStart($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProjectManager whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProjectManager whereManagerId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProjectManager whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProjectManager whereProjectManagerPricePerDay($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProjectManager whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperProjectManager {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $role_name
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|Role newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Role newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|Role query()
 * @method static \Illuminate\Database\Eloquent\Builder|Role whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Role whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Role whereRoleName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|Role whereUpdatedAt($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperRole {}
}

namespace App\Models{
/**
 * @property int $id
 * @property int $project_id
 * @property int $user_id
 * @property int $activite_id
 * @property mixed $ids_of_days
 * @property float $count_of_days
 * @property string $date
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string|null $comment
 * @property int $cra_id
 * @property-read \App\Models\Activite $activite
 * @property-read \App\Models\CRA $cra
 * @property-read \App\Models\Project $project
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\TimeSheetLigne> $time_sheet_ligne
 * @property-read int|null $time_sheet_ligne_count
 * @property-read \App\Models\User $user
 * @method static \Database\Factories\TimeSheetFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|TimeSheet newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TimeSheet newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TimeSheet query()
 * @method static \Illuminate\Database\Eloquent\Builder|TimeSheet whereActiviteId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TimeSheet whereComment($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TimeSheet whereCountOfDays($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TimeSheet whereCraId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TimeSheet whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TimeSheet whereDate($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TimeSheet whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TimeSheet whereIdsOfDays($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TimeSheet whereProjectId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TimeSheet whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TimeSheet whereUserId($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperTimeSheet {}
}

namespace App\Models{
/**
 * @property int $id
 * @property mixed|null $value
 * @property bool $is_week_end
 * @property bool $is_disabled
 * @property float $rest_acceptable
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int $time_sheet_id
 * @property int $app_id
 * @method static \Illuminate\Database\Eloquent\Builder|TimeSheetLigne newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TimeSheetLigne newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|TimeSheetLigne query()
 * @method static \Illuminate\Database\Eloquent\Builder|TimeSheetLigne whereAppId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TimeSheetLigne whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TimeSheetLigne whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TimeSheetLigne whereIsDisabled($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TimeSheetLigne whereIsWeekEnd($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TimeSheetLigne whereRestAcceptable($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TimeSheetLigne whereTimeSheetId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TimeSheetLigne whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|TimeSheetLigne whereValue($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperTimeSheetLigne {}
}

namespace App\Models{
/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property \Illuminate\Support\Carbon|null $email_verified_at
 * @property mixed $password
 * @property string|null $remember_token
 * @property string|null $account_token
 * @property bool $is_active
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property int|null $role_id
 * @property int $is_valid
 * @property string|null $user_uuid
 * @property string $language
 * @property bool $is_user_completed_profile
 * @property int $dailly_price
 * @property string|null $code_otp
 * @property string|null $token_change_mdp
 * @property-read \Illuminate\Notifications\DatabaseNotificationCollection<int, \Illuminate\Notifications\DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @property-read \App\Models\Role|null $role
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Laravel\Sanctum\PersonalAccessToken> $tokens
 * @property-read int|null $tokens_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static \Illuminate\Database\Eloquent\Builder|User newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|User query()
 * @method static \Illuminate\Database\Eloquent\Builder|User whereAccountToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereCodeOtp($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereDaillyPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmail($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereEmailVerifiedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereIsUserCompletedProfile($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereIsValid($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereLanguage($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User wherePassword($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereRememberToken($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereRoleId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereTokenChangeMdp($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|User whereUserUuid($value)
 * @mixin \Eloquent
 */
	#[\AllowDynamicProperties]
	class IdeHelperUser {}
}

