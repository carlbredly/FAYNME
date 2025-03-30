<?php
header('Content-Type: application/json');
require_once __DIR__ . '/config.php';

// Activer les logs
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Créer la connexion à la base de données
function getDbConnection() {
    global $db_config;
    $conn = new mysqli($db_config['host'], $db_config['username'], $db_config['password'], $db_config['database']);
    if ($conn->connect_error) {
        error_log("Erreur de connexion à la base de données: " . $conn->connect_error);
        die("Erreur de connexion");
    }
    $conn->set_charset("utf8mb4");
    return $conn;
}

// GET - récupérer tous les liens courts
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    error_log("Requête GET reçue - Récupération des URLs");
    $conn = getDbConnection();
    $result = $conn->query("SELECT short_id, long_url, created_at FROM short_urls");
    
    $urls = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $urls[$row['short_id']] = [
                'url' => $row['long_url'],
                'createdAt' => $row['created_at']
            ];
        }
    }
    
    error_log("URLs récupérées : " . json_encode($urls));
    echo json_encode($urls);
    $conn->close();
} 
// POST - ajouter un nouveau lien court
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    error_log("Requête POST reçue - Sauvegarde d'une nouvelle URL");
    $data = json_decode(file_get_contents('php://input'), true);
    error_log("Données reçues : " . json_encode($data));
    
    $conn = getDbConnection();
    
    $stmt = $conn->prepare("INSERT INTO short_urls (short_id, long_url) VALUES (?, ?)");
    
    foreach ($data as $shortId => $urlData) {
        if (!isset($urlData['url'])) {
            error_log("URL manquante pour l'ID : " . $shortId);
            continue;
        }
        
        // Vérifier si l'ID existe déjà
        $checkStmt = $conn->prepare("SELECT id FROM short_urls WHERE short_id = ?");
        $checkStmt->bind_param("s", $shortId);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if ($checkResult->num_rows === 0) {
            // Nouvel enregistrement
            $stmt->bind_param("ss", $shortId, $urlData['url']);
            if ($stmt->execute()) {
                error_log("Nouvelle URL sauvegardée avec succès - ID : " . $shortId);
            } else {
                error_log("Erreur lors de la sauvegarde de l'URL - ID : " . $shortId . " - Erreur : " . $stmt->error);
            }
        } else {
            error_log("L'ID existe déjà : " . $shortId);
        }
    }
    
    echo json_encode(['success' => true]);
    $conn->close();
}
?> 