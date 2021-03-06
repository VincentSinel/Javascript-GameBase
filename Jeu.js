

//============================================================================================
// Ajouter ici les variables global à créer


//============================================================================================


/**
 * Initialisation des objets du jeu.
 */
function InitObjets()
{
    LoadTilemap();
    
    // Ajouter ici les objets à creer
    new Joueur(0,0);

    //Scene.ChangeScene(JeuPong, Game.Ecran_Largeur / 2 - JeuPong.BordL, -Game.Ecran_Hauteur / 2)
    //Scene.ChangeScene(JeuMoto,0,0)
    Scene.ChangeScene(Scene1,0,0)
    //Scene.ChangeScene(Niveau1,0,0)
    //Debug.Parametre.Camera = false;
    Debug.Parametre.Grille = false;


    let win = new UI_Window(Game.Ecran_Largeur - 75,5, 1000000000,70,25);
    let UI2 = new UI_Button();
    UI2.H = UI_Element_Alignement.STRETCH;
    UI2.SetTexte("Plein Ecran");
    UI2.ClicAction = function(){ Camera.PleinEcran()};
    win.AddChildren(UI2);
    win.Show();
    
    //let UI = new UI_Toggle(Ecran_Largeur - 130,0, 1000000000,60,25, "Grille");
    //UI.ClicAction = function(){ Debug.Parametre.Grille = !Debug.Parametre.Grille }
    //UI.Toggle = Debug.Parametre.Grille;

    //let UI2 = new UI_Button(Game.Ecran_Largeur - 60, 0, 1000000000, 60, 25, "Plein Ecran")
    //UI2.ClicAction = function(){ Camera.PleinEcran()};
}

/**
 * Lance le chargement des tilemaps
 */
function LoadTilemap()
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