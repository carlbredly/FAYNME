<?php
// Activer l'affichage des erreurs
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Log de début
error_log("Début du script de redirection");

// Afficher le répertoire courant
error_log("Répertoire courant : " . __DIR__);

// Récupérer l'ID court depuis le chemin de l'URL
$requestUri = $_SERVER['REQUEST_URI'];
$shortId = basename($requestUri);
error_log("ID reçu : " . $shortId);

if (empty($shortId)) {
    error_log("Erreur : ID non fourni");
    header('HTTP/1.0 404 Not Found');
    echo 'ID non fourni';
    exit;
}

// Connexion à la base de données
require_once dirname(__DIR__) . '/src/assets/data/config.php';
$conn = new mysqli($db_config['host'], $db_config['username'], $db_config['password'], $db_config['database']);

if ($conn->connect_error) {
    error_log("Erreur de connexion à la base de données: " . $conn->connect_error);
    header('HTTP/1.0 500 Internal Server Error');
    echo 'Erreur de connexion à la base de données';
    exit;
}

// Rechercher l'URL correspondante
$stmt = $conn->prepare("SELECT long_url FROM short_urls WHERE short_id = ?");
$stmt->bind_param("s", $shortId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    error_log("Erreur : ID non trouvé dans la base de données");
    header('HTTP/1.0 404 Not Found');
    echo 'URL non trouvée';
    exit;
}

$row = $result->fetch_assoc();
$targetUrl = $row['long_url'];
error_log("URL trouvée : " . $targetUrl);

// Mettre à jour le compteur de clics et la date d'accès
$updateStmt = $conn->prepare("UPDATE short_urls SET click_count = click_count + 1, last_access = NOW() WHERE short_id = ?");
$updateStmt->bind_param("s", $shortId);
$updateStmt->execute();

// Nettoyer l'URL des caractères d'échappement
$targetUrl = str_replace('\\/', '/', $targetUrl);
error_log("URL nettoyée : " . $targetUrl);

// S'assurer que l'URL commence par le bon préfixe
if (strpos($targetUrl, '/FAYNME/') === false) {
    $targetUrl = '/FAYNME' . $targetUrl;
    error_log("URL corrigée avec préfixe : " . $targetUrl);
}

// Fermer la connexion
$conn->close();

// Rediriger vers l'URL longue avec les paramètres
header('Location: ' . $targetUrl);
exit;
?> 