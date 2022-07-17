//=====================================================
// Liste des script à charger
// Moteur V2.0;
//=====================================================

var Scripts = [
    //"Modules/Matter (RigidBody).js",

    "Programmes/Class/Color.js",
    "Programmes/Class/Vector.js",
    "Programmes/Class/Matrix.js",

    "Programmes/Class/2DShape/SAT.js",
    "Programmes/Class/2DShape/Shape.js",
    "Programmes/Class/2DShape/Polygon.js",
    "Programmes/Class/2DShape/Rectangle.js",
    "Programmes/Class/2DShape/Circle.js",

    //"Jeu_Base.js",
    "Game.js",

    "Programmes/GameObject/Default/GameObject.js",
    "Programmes/GameObject/Default/RootObject.js",
    "Programmes/GameObject/Default/Drawable.js",
    "Programmes/GameObject/Default/Scene.js",
    "Programmes/GameObject/Default/NinePatch.js",

    "Programmes/Menu/UIElements/UI_Element.js",
    "Programmes/Menu/UIElements/UI_Selectable.js",
    "Programmes/Menu/UIElements/UI_Draggable.js",
    "Programmes/Menu/UIElements/UI_ViewPort.js",
    "Programmes/Menu/UIElements/UI_Stack.js",
    "Programmes/Menu/UIElements/UI_Grid.js",
    "Programmes/Menu/UIElements/UI_Panel.js",
    "Programmes/Menu/UIElements/UI_ScrollBar.js",
    "Programmes/Menu/UIElements/UI_ScrollView.js",
    "Programmes/Menu/UIElements/UI_Button.js",
    "Programmes/Menu/UIElements/UI_Label.js",
    "Programmes/Menu/UIElements/UI_ListView.js",
    "Programmes/Menu/UIElements/UI_CheckBox.js",
    "Programmes/Menu/UIElements/UI_Toggle.js",
    "Programmes/Menu/UIElements/UI_Slider.js",
    "Programmes/Menu/UIElements/UI_Image.js",
    "Programmes/Menu/UIElements/UI_Rectangle.js",
    "Programmes/Menu/UIElements/UI_TextBox.js",
    "Programmes/Menu/UI_Root.js",
    "Programmes/Menu/UI_Window_Style.js",
    "Programmes/Menu/UI_Window.js",


    "Programmes/GameObject/Tilemap/UI_EditionTileMap.js",


    "Programmes/GameObject/BulleDialogue/BulleDialogue.js",

    "Programmes/GameObject/Lutin/Lutin.js",
    "Programmes/GameObject/Lutin/Lutin_SC.js",
    "Programmes/GameObject/Lutin/Lutin_RPGMaker.js",
    "Programmes/GameObject/Lutin/PNJ.js",
    "Programmes/GameObject/Lutin/Actor.js",

    "Programmes/GameObject/Tilemap/Tiles/Tile.js",
    "Programmes/GameObject/Tilemap/Tiles/Tile_Multi.js",
    "Programmes/GameObject/Tilemap/Tiles/Tile_Animation.js",
    "Programmes/GameObject/Tilemap/Tiles/Tile_Auto.js",
    "Programmes/GameObject/Tilemap/Tiles/Tilesets.js",
    "Programmes/GameObject/Tilemap/TileMap.js",
    "Programmes/GameObject/Tilemap/TileMap_Layer.js",

    "Programmes/Utilitaires/Camera.js",
    "Programmes/Utilitaires/Clavier.js",
    "Programmes/Utilitaires/Contacts.js",
    "Programmes/Utilitaires/Datas.js",
    "Programmes/Utilitaires/Debug.js",
    "Programmes/Utilitaires/Souris.js",
    "Programmes/Utilitaires/Utilitaires.js",
    "Programmes/Utilitaires/Sons.js",
    "Programmes/Utilitaires/LoadScreen.js",
    "Programmes/Utilitaires/Textures.js",
    "Programmes/Utilitaires/Drawing.js",

]

//=====================================================
// Création des liens dans la page parents
//=====================================================

console.clear();

document.write('<script src="Fichiers/DataBase.js" charset="utf-8" onerror="MainScriptLoaded(\'DataBase\')"></script>')
document.write('<script src="Fichiers/Librairie_Sons.js" charset="utf-8" onerror="MainScriptLoaded(\'Librairie_Sons\')"></script>')
document.write('<script src="Fichiers/Librairie_Textures.js" charset="utf-8" onerror="MainScriptLoaded(\'Librairie_Textures\')"></script>')
for (let s = 0; s < Scripts.length; s++) 
{
    document.write('<script src="' + "Moteur de Jeu/" + Scripts[s] + '" charset="utf-8"></script>')
}

/**
 * Initialisation du moteur de jeu
 */
function InitMoteur()
{
    let file = document.createElement("input");
    file.id = "inp";
    file.type = 'file';
    file.style.visibility = "hidden";
    file.onchange = function(e) {readFile(e); console.log("click")};
    document.body.appendChild(file);

    let link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "Moteur de Jeu/Style.css"
    document.head.appendChild(link);

    Game.Initialisation();
}
/**
 * Charge un fichiers data
 * @param {string} Name Nom du fichier data
 */
function MainScriptLoaded(Name)
{
    console.log("Le Fichier " + Name + ".js n'est pas présent dans le dossier Fichiers. Il doit être créé, pour cela copier le fichier existant depuis 'Moteur de jeu/Base Fichier/" + Name + ".js'");
}

//Debug.Log("Chargement des modules terminé")
console.log("[INFO]      - Chargement des modules terminé")