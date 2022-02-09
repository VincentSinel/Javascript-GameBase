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
    // Ajouter ici les objets à creer
    Debug.Parametre.Grille = true;
    lutin = new JeuPong()//new ExempleLutin()

    UI = new Toggle(Ecran_Largeur - 60,0,60,25, "Grille");
    //UI.ClicAction = function(){ Debug.Parametre.Grille = !Debug.Parametre.Grille }
    UI.ClicAction = function(){ Camera.PleinEcran() }
    UI.Toggle = true;
}

/**
 * Mise a jour des calculs (Position, collision, etc ...) 
 */
function Calcul()
{
    // Ajouter ici la mise a jour des calculs d'objets
    lutin.Calcul()

    UI.Calcul();
}


/**
 * Mise a jour du visuel (Dessin dans le canvas)
 */
function Dessin()
{
    // Ajouter ici la mise a jour des dessin d'objets
    lutin.Dessin(ctx)

    UI.Dessin(ctx);
}