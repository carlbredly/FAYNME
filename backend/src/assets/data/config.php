<?php
// Configuration de la base de données
define('DB_HOST', 'sql201.infinityfree.com');  // Hôte de la base de données
define('DB_USER', 'if0_38637705');             // Nom d'utilisateur InfinityFree
define('DB_PASS', 'iEkcpO5gf8b');             // Mot de passe InfinityFree
define('DB_NAME', 'if0_38637705_faynme');      // Nom de la base de données

// Configuration du site
define('SITE_URL', 'https://faynme.42web.io');  // URL InfinityFree
define('SITE_NAME', 'FAYNME');

// Configuration des emails
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'carlbredlyrefuse@gmail.com');
define('SMTP_PASS', '');  // À remplir avec votre mot de passe d'application Gmail

// Gestion des erreurs
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Connexion à la base de données
try {
    $conn = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME, DB_USER, DB_PASS);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Erreur de connexion : " . $e->getMessage());
}
?> 