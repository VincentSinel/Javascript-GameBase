

//============================================================================================
// Ajouter ici les variables à créer

var lutin

//============================================================================================


/**
 * Initialisation des objets du jeu.
 */
function InitObjets()
{
    // Ajouter ici les objets à creer

    lutin = new Niveau2();

    Debug.Parametre.Camera = true;
    Debug.Parametre.Grille = false;

    
    let UI = new Toggle(Ecran_Largeur - 60,0,60,25, "Grille");
    UI.ClicAction = function(){ Debug.Parametre.Grille = !Debug.Parametre.Grille }
    UI.Toggle = Debug.Parametre.Grille;

    let UI2 = new Boutton(Ecran_Largeur - 130, 0, 60, 25, "Plein Ecran")
    UI2.ClicAction = function(){ Camera.PleinEcran()};
}

/**
 * Mise a jour des calculs (Position, collision, etc ...) 
 */
function Calcul(Delta)
{
    if (TotalFrame == 2)
    {
    }
    // Ajouter ici la mise a jour des calculs d'objets
    lutin.Calcul(Delta)

    if (Clavier.ToucheJusteBasse("e"))
    {
        Datas.Charger();
    }
}


/**
 * Mise a jour du visuel (Dessin dans le canvas)
 */
function Dessin(Context)
{
    // Ajouter ici la mise a jour des dessin d'objets
    lutin.Dessin(Context)
}