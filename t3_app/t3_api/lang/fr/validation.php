<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */
    /*
    'accepted' => 'The :attribute field must be accepted.',
    'accepted_if' => 'The :attribute field must be accepted when :other is :value.',
    'active_url' => 'The :attribute field must be a valid URL.',
    'after' => 'The :attribute field must be a date after :date.',
    'after_or_equal' => 'The :attribute field must be a date after or equal to :date.',
    'alpha' => 'The :attribute field must only contain letters.',
    'alpha_dash' => 'The :attribute field must only contain letters, numbers, dashes, and underscores.',
    'alpha_num' => 'The :attribute field must only contain letters and numbers.',
    'array' => 'The :attribute field must be an array.',
    'ascii' => 'The :attribute field must only contain single-byte alphanumeric characters and symbols.',
    'before' => 'The :attribute field must be a date before :date.',
    'before_or_equal' => 'The :attribute field must be a date before or equal to :date.',
    'between' => [
        'array' => 'The :attribute field must have between :min and :max items.',
        'file' => 'The :attribute field must be between :min and :max kilobytes.',
        'numeric' => 'The :attribute field must be between :min and :max.',
        'string' => 'The :attribute field must be between :min and :max characters.',
    ],
    'boolean' => 'The :attribute field must be true or false.',
    'can' => 'The :attribute field contains an unauthorized value.',
    'confirmed' => 'The :attribute field confirmation does not match.',
    'current_password' => 'The password is incorrect.',
    'date' => 'The :attribute field must be a valid date.',
    'date_equals' => 'The :attribute field must be a date equal to :date.',
    'date_format' => 'The :attribute field must match the format :format.',
    'decimal' => 'The :attribute field must have :decimal decimal places.',
    'declined' => 'The :attribute field must be declined.',
    'declined_if' => 'The :attribute field must be declined when :other is :value.',
    'different' => 'The :attribute field and :other must be different.',
    'digits' => 'The :attribute field must be :digits digits.',
    'digits_between' => 'The :attribute field must be between :min and :max digits.',
    'dimensions' => 'The :attribute field has invalid image dimensions.',
    'distinct' => 'The :attribute field has a duplicate value.',
    'doesnt_end_with' => 'The :attribute field must not end with one of the following: :values.',
    'doesnt_start_with' => 'The :attribute field must not start with one of the following: :values.',
    'email' => 'The :attribute field must be a valid email address.',
    'ends_with' => 'The :attribute field must end with one of the following: :values.',
    'enum' => 'The selected :attribute is invalid.',
    'exists' => 'The selected :attribute is invalid.',
    'extensions' => 'The :attribute field must have one of the following extensions: :values.',
    'file' => 'The :attribute field must be a file.',
    'filled' => 'The :attribute field must have a value.',
    'gt' => [
        'array' => 'The :attribute field must have more than :value items.',
        'file' => 'The :attribute field must be greater than :value kilobytes.',
        'numeric' => 'The :attribute field must be greater than :value.',
        'string' => 'The :attribute field must be greater than :value characters.',
    ],
    'gte' => [
        'array' => 'The :attribute field must have :value items or more.',
        'file' => 'The :attribute field must be greater than or equal to :value kilobytes.',
        'numeric' => 'The :attribute field must be greater than or equal to :value.',
        'string' => 'The :attribute field must be greater than or equal to :value characters.',
    ],
    'hex_color' => 'The :attribute field must be a valid hexadecimal color.',
    'image' => 'The :attribute field must be an image.',
    'in' => 'The selected :attribute is invalid.',
    'in_array' => 'The :attribute field must exist in :other.',
    'integer' => 'The :attribute field must be an integer.',
    'ip' => 'The :attribute field must be a valid IP address.',
    'ipv4' => 'The :attribute field must be a valid IPv4 address.',
    'ipv6' => 'The :attribute field must be a valid IPv6 address.',
    'json' => 'The :attribute field must be a valid JSON string.',
    'lowercase' => 'The :attribute field must be lowercase.',
    'lt' => [
        'array' => 'The :attribute field must have less than :value items.',
        'file' => 'The :attribute field must be less than :value kilobytes.',
        'numeric' => 'The :attribute field must be less than :value.',
        'string' => 'The :attribute field must be less than :value characters.',
    ],
    'lte' => [
        'array' => 'The :attribute field must not have more than :value items.',
        'file' => 'The :attribute field must be less than or equal to :value kilobytes.',
        'numeric' => 'The :attribute field must be less than or equal to :value.',
        'string' => 'The :attribute field must be less than or equal to :value characters.',
    ],
    'mac_address' => 'The :attribute field must be a valid MAC address.',
    'max' => [
        'array' => 'The :attribute field must not have more than :max items.',
        'file' => 'The :attribute field must not be greater than :max kilobytes.',
        'numeric' => 'The :attribute field must not be greater than :max.',
        'string' => 'The :attribute field must not be greater than :max characters.',
    ],
    'max_digits' => 'The :attribute field must not have more than :max digits.',
    'mimes' => 'The :attribute field must be a file of type: :values.',
    'mimetypes' => 'The :attribute field must be a file of type: :values.',
    'min' => [
        'array' => 'The :attribute field must have at least :min items.',
        'file' => 'The :attribute field must be at least :min kilobytes.',
        'numeric' => 'The :attribute field must be at least :min.',
        'string' => 'The :attribute field must be at least :min characters.',
    ],
    'min_digits' => 'The :attribute field must have at least :min digits.',
    'missing' => 'The :attribute field must be missing.',
    'missing_if' => 'The :attribute field must be missing when :other is :value.',
    'missing_unless' => 'The :attribute field must be missing unless :other is :value.',
    'missing_with' => 'The :attribute field must be missing when :values is present.',
    'missing_with_all' => 'The :attribute field must be missing when :values are present.',
    'multiple_of' => 'The :attribute field must be a multiple of :value.',
    'not_in' => 'The selected :attribute is invalid.',
    'not_regex' => 'The :attribute field format is invalid.',
    'numeric' => 'The :attribute field must be a number.',
    'password' => [
        'letters' => 'The :attribute field must contain at least one letter.',
        'mixed' => 'The :attribute field must contain at least one uppercase and one lowercase letter.',
        'numbers' => 'The :attribute field must contain at least one number.',
        'symbols' => 'The :attribute field must contain at least one symbol.',
        'uncompromised' => 'The given :attribute has appeared in a data leak. Please choose a different :attribute.',
    ],
    'present' => 'The :attribute field must be present.',
    'present_if' => 'The :attribute field must be present when :other is :value.',
    'present_unless' => 'The :attribute field must be present unless :other is :value.',
    'present_with' => 'The :attribute field must be present when :values is present.',
    'present_with_all' => 'The :attribute field must be present when :values are present.',
    'prohibited' => 'The :attribute field is prohibited.',
    'prohibited_if' => 'The :attribute field is prohibited when :other is :value.',
    'prohibited_unless' => 'The :attribute field is prohibited unless :other is in :values.',
    'prohibits' => 'The :attribute field prohibits :other from being present.',
    'regex' => 'The :attribute field format is invalid.',
    'required' => 'The :attribute field is required.',
    'required_array_keys' => 'The :attribute field must contain entries for: :values.',
    'required_if' => 'The :attribute field is required when :other is :value.',
    'required_if_accepted' => 'The :attribute field is required when :other is accepted.',
    'required_unless' => 'The :attribute field is required unless :other is in :values.',
    'required_with' => 'The :attribute field is required when :values is present.',
    'required_with_all' => 'The :attribute field is required when :values are present.',
    'required_without' => 'The :attribute field is required when :values is not present.',
    'required_without_all' => 'The :attribute field is required when none of :values are present.',
    'same' => 'The :attribute field must match :other.',
    'size' => [
        'array' => 'The :attribute field must contain :size items.',
        'file' => 'The :attribute field must be :size kilobytes.',
        'numeric' => 'The :attribute field must be :size.',
        'string' => 'The :attribute field must be :size characters.',
    ],
    'starts_with' => 'The :attribute field must start with one of the following: :values.',
    'string' => 'The :attribute field must be a string.',
    'timezone' => 'The :attribute field must be a valid timezone.',
    'unique' => 'The :attribute has already been taken.',
    'uploaded' => 'The :attribute failed to upload.',
    'uppercase' => 'The :attribute field must be uppercase.',
    'url' => 'The :attribute field must be a valid URL.',
    'ulid' => 'The :attribute field must be a valid ULID.',
    'uuid' => 'The :attribute field must be a valid UUID.', */

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    /*     'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ], */

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    /*     'attributes' => [], */

    'accepted' => 'Le champ :attribute doit être accepté.',
    'accepted_if' => 'Le champ :attribute doit être accepté lorsque :other vaut :value.',
    'active_url' => 'Le champ :attribute n\'est pas une URL valide.',
    'after' => 'Le champ :attribute doit être une date postérieure au :date.',
    'after_or_equal' => 'Le champ :attribute doit être une date après ou égale à :date.',
    'alpha' => 'Le champ :attribute doit seulement contenir des lettres.',
    'alpha_dash' => 'Le champ :attribute doit seulement contenir des lettres, des chiffres et des tirets.',
    'alpha_num' => 'Le champ :attribute doit seulement contenir des chiffres et des lettres.',
    'array' => 'Le champ :attribute doit être un tableau.',
    'ascii' => 'Le champ :attribute ne doit contenir que des caractères alphanumériques à un octet et des symboles.',
    'before' => 'Le champ :attribute doit être une date antérieure au :date.',
    'before_or_equal' => 'Le champ :attribute: doit être une date avant ou égale à :date.',
    'between' => [
        'array' => 'Le tableau :attribute doit avoir entre :min et :max éléments.',
        'file' => 'Le fichier :attribute doit avoir une taille entre :min et :max kilo-octets.',
        'numeric' => 'La valeur de :attribute doit être comprise entre :min et :max.',
        'string' => 'Le texte :attribute doit avoir entre :min et :max caractères.',
    ],
    'boolean' => 'Le champ :attribute doit être vrai ou faux.',
    'can' => 'Le champ :attribute contient une valeur non autorisée.', // added
    'confirmed' => 'Le champ de confirmation :attribute ne correspond pas.',
    'current_password' => 'Le mot de passe est incorrect.',
    'date' => 'Le champ :attribute n\'est pas une date valide.',
    'date_equals' => 'Le champ :attribute doit être une date égale à :date.',
    'date_format' => 'Le champ :attribute ne correspond pas au format :format.',
    'decimal' => 'Le champ :attribute doit avoir des décimales :decimal.',
    'declined' => 'Le champ :attribute doit être refusé.',
    'declined_if' => 'Le champ :attribute doit être refusé lorsque :other vaut :value.',
    'different' => 'Les champs :attribute et :other doivent être différents.',
    'digits' => 'Le champ :attribute doit avoir :digits chiffres.',
    'digits_between' => 'Le champ :attribute doit avoir entre :min and :max chiffres.',
    'dimensions' => 'Le champ :attribute a des dimensions d\'image non valides.',
    'distinct' => 'Le champ a une valeur en double.',
    'doesnt_end_with' => 'Le champ :attribute ne peut pas se terminer par l\'un des éléments suivants : :values.',
    'doesnt_start_with' => 'Le champ :attribute ne peut pas se commencer par l\'un des éléments suivants : :values.',
    'email'  => "Le champ :attribute doit être une adresse email valide.",
    'ends_with' => 'Le champ :attribute doit se terminer par l\'une des valeurs suivantes : :values.',
    'enum' => 'Le champ :attribute sélectionné est invalide.',
    'exists' => 'Le champ :attribute sélectionné est invalide.',
    'extensions' => "Le champ :attribute doit avoir l'une des extensions suivantes: :values.", //added
    'file' => 'Le champ :attribute doit être un fichier.',
    'filled' => "Le champ :attribute est obligatoire.",
    'gt' => [
        'array'  => 'Le champ :attribute doit avoir plus de :value éléments.',
        'file' => 'Le champ :attribute doit être supérieur à :value kilobytes.',
        'numeric' => 'Le champ :attribute doit être supérieur à :value.',
        'string' => 'Le champ :attribute doit être supérieur à :value caractères.',
    ],
    'gte' => [
        'array' => 'Le champ :attribute doit avoir :value éléments ou plus.',
        'file' => 'Le champ :attribute doit être supérieur ou égal à :value kilobytes.',
        'numeric' => 'Le champ :attribute doit être supérieur ou égal à :value.',
        'string' => 'Le champ :attribute doit être supérieur ou égal à :value caractères.',
    ],
    'hex_color' => 'Le champ :attribute doit être une couleur hexadécimale valide.', //added
    'image' => 'Le champ :attribute doit être une image.',
    'in' => 'Le champ :attribute est invalide.',
    'in_array' => 'Le champ :attribute n\'existe pas dans :other.',
    'integer' => 'Le champ :attribute doit être un entier (un nombre sans virgule).',
    'ip' => 'Le champ :attribute doit être une adresse IP valide.',
    'ipv4' => 'Le champ :attribute doit être une adresse IPv4 valide.',
    'ipv6' => 'Le champ :attribute doit être une adresse IPv6 valide.',
    'json' => 'Le champ :attribute doit être une chaîne JSON valide.',
    'lowercase' => 'Le champ :attribute doit être en minuscules.',
    'lt' => [
        'array' => 'Le champ :attribute doit avoir moins de :value éléments.',
        'file' => 'Le champ :attribute doit être inférieur à :value kilobytes.',
        'numeric' => 'Le champ :attribute doit être inférieur à :value.',
        'string' => 'Le champ :attribute doit être inférieur à :value caractères.',
    ],
    'lte' => [
        'array' => 'Le champ :attribute ne doit pas avoir plus de :value éléments.',
        'file' => 'Le champ :attribute doit être inférieur ou égal à :value kilobytes.',
        'numeric' => 'Le champ :attribute doit être inférieur ou égal à :value.',
        'string' => 'Le champ :attribute doit être inférieur ou égal à :value caractères.',
    ],
    'mac_address' => 'Le champ :attribute doit être une adresse MAC valide.',
    'max' => [
        'array' => 'Le tableau :attribute ne peut avoir plus de :max éléments.',
        'file' => 'La taille du fichier :attribute ne peut être supérieure à :max kilo-octets.',
        'numeric' => 'La valeur de :attribute ne peut être supérieure à :max.',
        'string' => 'Le texte de :attribute ne peut contenir plus de :max caractères.',
    ],
    'max_digits' => 'Le champ :attribute ne doit pas avoir plus de :max chiffres.',
    'mimes' => 'Le champ :attribute doit être un fichier de type : :values.',
    'mimetypes' => 'Le champ :attribute doit être un fichier de type : :values.',
    'min' => [
        'array' => 'Le tableau :attribute doit avoir au moins :min éléments.',
        'file' => 'La taille du fichier :attribute ne peut être inférieure à :min kilo-octets.',
        'numeric' => 'La valeur de :attribute ne peut être inférieure à :min.',
        'string' => 'Le texte du champ :attribute doit contenir au moins :min caractères.',
    ],
    'min_digits' => 'Le champ :attribute doit avoir au moins :min chiffres.',
    'missing' => 'Le champ :attribute doit être manquant.',
    'missing_if' => 'Le champ :attribute doit être manquant lorsque :other vaut :value.',
    'missing_unless' => 'Le champ :attribute doit être manquant sauf si :other est :value.',
    'missing_with' => 'Le champ :attribute doit être manquant lorsque :value est présent.',
    'missing_with_all' => 'Le champ :attribute doit être manquant lorsque :values sont présents.',
    'multiple_of' => 'Le champ :attribute doit être un multiple de :value.',
    'not_in' => 'Le champ :attribute sélectionné n\'est pas valide.',
    'not_regex' => 'Le champ :attribute a un format invalide.',
    'numeric' => 'Le champ :attribute doit contenir un nombre.',
    'password' => [
        'letters' => 'Le champ :attribute doit contenir au moins une lettre.',
        'mixed' => 'Le champ :attribute doit contenir au moins une majuscule et une minuscule.',
        'numbers' => 'Le champ :attribute doit contenir au moins un chiffre.',
        'symbols' => 'Le champ :attribute doit contenir au moins un symbole.',
        'uncompromised' => 'Le :attribute donné est apparu dans une fuite de données. Veuillez choisir un autre :attribute.',
    ],
    'present' => 'Le champ :attribute doit être present.',
    'present_if' => 'Le champ :attribute doit être présent lorsque :other est :value.',   // add
    'present_unless' => 'Le champ :attribute doit être présent, sauf si :other est :value.', // add
    'present_with' => 'Le champ :attribute doit être présent lorsque :values est present.', // add
    'present_with_all' => 'Le champ :attribute doit être présent lorsque :values sont présents.', // add
    'prohibited' => 'Le champ :attribute est interdit.',
    'prohibited_if' => 'Le champ :attribute est interdit lorsque :other vaut :value.',
    'prohibited_unless' => 'Le champ :attribute est interdit sauf si :other est dans :values.',
    'prohibits' => 'Le champ :attribute interdit la présence de :other.',
    'regex' => 'Le format du champ :attribute est invalide.',
    'required' => 'Le champ :attribute est obligatoire.',
    'required_array_keys' => 'Le champ :attribute doit contenir des entrées pour : :values.',
    'required_if' => 'Le champ :attribute est obligatoire quand la valeur de :other est :value.',
    'required_if_accepted' => 'Le champ :attribute est obligatoire lorsque :other est accepté.',
    'required_unless' => 'Le champ :attribute est obligatoire sauf si :other est dans :values.',
    'required_with' => 'Le champ :attribute est obligatoire quand :values est présent.',
    'required_with_all' => 'Le champ :attribute est obligatoire quand :values est présent.',
    'required_without' => 'Le champ :attribute est obligatoire quand :values n\'est pas présent.',
    'required_without_all' => 'Le champ :attribute est requis quand aucun de :values n\'est présent.',
    'same' => 'Les champs :attribute et :other doivent être identiques.',
    'size' => [
        'numeric' => 'La valeur de :attribute doit être :size.',
        'file' => 'La taille du fichier de :attribute doit être de :size kilo-octets.',
        'string' => 'Le texte de :attribute doit contenir :size caractères.',
        'array' => 'Le tableau :attribute doit contenir :size éléments.',
    ],
    'starts_with' => 'Le :attribute doit commencer par l\'un des éléments suivants : :values.',
    'string' => 'Le :attribute doit être une chaîne.',
    'timezone' => 'Le :attribute doit être un fuseau horaire valide.',
    'unique' => 'Le :attribute a déjà été pris.',
    'uploaded' => 'Le :attribute n\'a pas pu être téléchargé.',
    'uppercase' => 'Le :attribute doit être en majuscule.',
    'url' => 'Le :attribute doit être une URL valide.',
    'ulid' => 'Le :attribute doit être un ULID valide.',
    'uuid' => 'Le :attribute doit être un UUID valide.',

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Language Lines
    |--------------------------------------------------------------------------
    |
    | Here you may specify custom validation messages for attributes using the
    | convention "attribute.rule" to name the lines. This makes it quick to
    | specify a specific custom language line for a given attribute rule.
    |
    */

    'custom' => [
        'attribute-name' => [
            'rule-name' => 'custom-message',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Custom Validation Attributes
    |--------------------------------------------------------------------------
    |
    | The following language lines are used to swap our attribute placeholder
    | with something more reader friendly such as "E-Mail Address" instead
    | of "email". This simply helps us make our message more expressive.
    |
    */

    'attributes' => [
        "activity" => "activité",
        "activities" => "activités",
        "address" => "adresse",
        "addresses" => "adresses",
        "age" => "âge",
        "ages" => "âges",
        "amount" => "montant",
        "amounts" => "montants",
        "answer" => "réponse",
        "answers" => "réponses",
        "available" => "disponible",
        "availables" => "disponibles",
        "barcode" => "code-barres",
        "barcodes" => "codes-barres",
        "birth_date" => "date de naissance",
        "brand" => "marque",
        "brands" => "marques",
        "brand_name" => "nom de la marque",
        "buying_price" => "prix d'achat",
        "category" => "catégorie",
        "categories" => "catégories",
        "city" => "ville",
        "cities" => "villes",
        "civility" => "civilité",
        "civilities" => "civilités",
        "comment" => "commentaire",
        "comments" => "commentaires",
        "company" => "entreprise",
        "companies" => "entreprises",
        "confirmed" => "confirmé",
        "confirmed_at" => "confirmé le",
        "content" => "contenu",
        "contents" => "contenus",
        "country" => "pays",
        "countries" => "pays",
        "customer" => "client",
        "customers" => "clients",
        "day" => "jour",
        "days" => "jours",
        "date_end" => "date de fin",
        "date_start" => "date de début",
        "directory" => "dossier",
        "directory_name" => "nom du dossier",
        "directories" => "dossiers",
        "directories_name" => "nom des dossiers",
        "directories_names" => "noms des dossiers",
        "email_banned" => "email banni",
        "email_confirmed" => "email confirmé",
        "email_validated" => "email validé",
        "email_prohibited" => "email inerdit",
        "emails_banned" => "emails bannis",
        "emails_confirmed" => "emails confirmés",
        "emails_validated" => "emails validés",
        "emails_prohibited" => "emails inerdits",
        "file" => "fichier",
        "files" => "fichiers",
        "first_name" => "prénom",
        "first_names" => "prénoms",
        "gender" => "genre",
        "genders" => "genres",
        "hour" => "heure",
        "hours" => "heures",
        "is_active" => "est actif ?",
        "is_banned" => "bannir ?",
        "job" => "métier",
        "jobs" => "métiers",
        "last_name" => "nom de famille",
        "last_names" => "noms de famille",
        "link" => "lien",
        "links" => "liens",
        "month" => "mois",
        "name" => "nom",
        "names" => "noms",
        "office" => "bureau",
        "offices" => "bureaux",
        "other" => "autre",
        "others" => "autres",
        "paid_at" => "payé le",
        "password" => "mot de passe",
        "password_confirmation" => "confirmation du mot de passe",
        "password_current" => "mot de passe actuel",
        "passwords" => "mots de passe",
        "phone" => "téléphone",
        "phones" => "téléphones",
        "postal_code" => "code postal",
        "price" => "prix",
        "published_at" => "publié le",
        "quantity" => "quantité",
        "quantities" => "quantités",
        "rate" => "taux",
        "rates" => "taux",
        "response" => "réponse",
        "responses" => "réponses",
        "role" => "rôle",
        "roles" => "rôles",
        "second" => "seconde",
        "seconds" => "secondes",
        "siren_number" => "numéro de siren",
        "siret_number" => "numéro de siret",
        "size" => "taille",
        "sizes" => "tailles",
        "status" => "statut",
        "statuses" => "statuts",
        "street" => "rue",
        "subfolder" => "sous-dossier",
        "subfolders" => "sous-dossiers",
        "subdirectory" => "sous-dossier",
        "subdirectories" => "sous-dossiers",
        "subject" => "sujet",
        "subjects" => "sujets",
        "summary" => "chapô",
        "summarys" => "chapôs",
        "supplier" => "fournisseur",
        "suppliers" => "fournisseurs",
        "tax" => "taxe",
        "time" => "heure",
        "title" => "titre",
        "titles" => "titres",
        "user" => "utilisateur",
        "users" => "utilisateurs",
        "username" => "pseudo",
        "usernames" => "pseudos",
        "value" => "valeur",
        "values" => "valeurs",
        "vat" => "TVA",
        "vat_rate" => "taux de TVA",
        "website" => "site web",
        "websites" => "sites web",
        "year" => "année",
        "years" => "années",
    ],

];
