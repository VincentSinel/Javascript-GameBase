//============================================================================================
// Ajouter ici les variables à créer

var lutin
var UI

//============================================================================================


/**
 * Initialisation des objets du jeu.
 */
function InitObjets()
{
    lutin = new Niveau2();

    Debug.Parametre.Camera = true;
    // Ajouter ici les objets à creer
    Debug.Parametre.Grille = false;
    //UI = new TextBlock(100,100,200, 200,"I would like to print a status message to my German users, which contains umlauts (ä/ü/ö). I also would like them be in the source file rather than having to download and parse some extra file just for the messages.");
    UI = new Toggle(Ecran_Largeur - 60,0,60,25, "Grille");
    UI.ClicAction = function(){ Debug.Parametre.Grille = !Debug.Parametre.Grille }
    UI.Toggle = Debug.Parametre.Grille;
}

/**
 * Mise a jour des calculs (Position, collision, etc ...) 
 */
function Calcul(Delta)
{
    // Ajouter ici la mise a jour des calculs d'objets
    lutin.Calcul(Delta)
}


/**
 * Mise a jour du visuel (Dessin dans le canvas)
 */
function Dessin(Context)
{
    // Ajouter ici la mise a jour des dessin d'objets
    lutin.Dessin(Context)
}