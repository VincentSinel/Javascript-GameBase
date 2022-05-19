

//============================================================================================
// Ajouter ici les variables à créer

var Player

//============================================================================================


/**
 * Initialisation des objets du jeu.
 */
function InitObjets()
{
    // Ajouter ici les objets à creer

    Player = new Joueur(0,0);

    Teleportation(Niveau1,0, 0)

    Debug.Parametre.Camera = true;
    Debug.Parametre.Grille = true;

    
    let UI = new UI_Toggle(Ecran_Largeur - 60,0, 1000000000,60,25, "Grille");
    UI.ClicAction = function(){ Debug.Parametre.Grille = !Debug.Parametre.Grille }
    UI.Toggle = Debug.Parametre.Grille;

    let UI2 = new UI_Button(Ecran_Largeur - 130, 0, 1000000000, 60, 25, "Plein Ecran")
    UI2.ClicAction = function(){ Camera.PleinEcran()};
}

/**
 * Mise a jour des calculs (Position, collision, etc ...) 
 */
function Calcul(Delta)
{
    // Ajouter ici la mise a jour des calculs d'objets
}

/**
 * Mise a jour du visuel (Dessin dans le canvas)
 */
function Dessin(Context)
{
    // Ajouter ici la mise a jour des dessin d'objets
}

function Teleportation(Scene, X,Y)
{
    if (SceneActuel)
        SceneActuel.SupprimerEnfant(Player);
    SceneActuel = new Scene()
    Player.X = X
    Player.Y = Y
    SceneActuel.AjoutEnfant(Player)
}