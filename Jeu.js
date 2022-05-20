

//============================================================================================
// Ajouter ici les variables à créer

var Player

//============================================================================================


/**
 * Initialisation des objets du jeu.
 */
function InitObjets()
{
    this.LoadTilemap();
    
    // Ajouter ici les objets à creer

    //SceneActuel = new JeuMoto()
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
 * Lance le chargement des tilemaps
 */
LoadTilemap()
{
    Tilesets.Add_Auto("Images/Tilemap/A1_Eau1.png", "A1");
    Tilesets.Add_Auto("Images/Tilemap/A1_Eau2.png", "A1");
    Tilesets.Add_Auto("Images/Tilemap/A2_Extérieur2.png", "A2");
    Tilesets.Add_Auto("Images/Tilemap/A3_Mur3.png", "A3");
    Tilesets.Add_Auto("Images/Tilemap/A4_Mur3.png", "A4");
    Tilesets.Add_Auto("Images/Tilemap/A5_Extérieur12.png", "A5");
    Tilesets.Add_Auto("Images/Tilemap/A5_Extérieur8.png", "A5");
    Tilesets.Add_Auto("Images/Tilemap/A5_Intérieur9.png", "A5");
    Tilesets.Add_Auto("Images/Tilemap/A5_Donjon4.png", "A5");
    Tilesets.Add_Auto("Images/Tilemap/A5_Extérieur6.png", "A5");
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
        SceneActuel.RemoveChildren(Player);
    SceneActuel = new Scene()
    Player.X = X
    Player.Y = Y
    SceneActuel.AddChildren(Player)
}