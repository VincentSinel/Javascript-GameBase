//=====================================================
// Liste des script à charger
//=====================================================

var Scripts = [
    //"Modules/Matter (RigidBody).js",

    "Programmes/Class/Color.js",
    "Programmes/Class/Polygone.js",
    "Programmes/Class/Vector.js",
    "Programmes/Class/Rectangle.js",
    "Programmes/Class/Matrix.js",
    //"Programmes/Class/Vecteur.js",

    "Jeu_Base.js",

    "Programmes/GameObject/GameObject.js",
    "Programmes/GameObject/RootObject.js",
    "Programmes/GameObject/Drawable.js",
    "Programmes/GameObject/Scene.js",

    "Programmes/GameObject/UIElements (WIP)/UIElement.js",
    "Programmes/GameObject/UIElements (WIP)/UI_Panel.js",
    "Programmes/GameObject/UIElements (WIP)/UI_ScrollBar.js",
    "Programmes/GameObject/UIElements (WIP)/UI_Button.js",
    "Programmes/GameObject/UIElements (WIP)/UI_Label.js",
    "Programmes/GameObject/UIElements (WIP)/UI_ListView.js",
    "Programmes/GameObject/UIElements (WIP)/UI_CheckBox.js",
    "Programmes/GameObject/UIElements (WIP)/UI_Toggle.js",
    "Programmes/GameObject/UIElements (WIP)/UI_Slider.js",
    "Programmes/GameObject/UIElements (WIP)/UI_Image.js",
    "Programmes/GameObject/UIElements (WIP)/UI_TextBox.js",


    "Programmes/GameObject/Tilemap/UI_EditionTileMap.js",
    //"Programmes/GameObject/UI/Panneau.js",
    //"Programmes/GameObject/UI/Toggle.js",
    //"Programmes/GameObject/UI/Boutton.js",
    //"Programmes/GameObject/UI/CheckBox.js",
    //"Programmes/GameObject/UI/Slider.js",
    //"Programmes/GameObject/UI/TextBox.js",
    //"Programmes/GameObject/UI/TextBlock.js",
    //"Programmes/GameObject/UI/Liste.js",

    "Programmes/GameObject/NinePatch.js",
    "Programmes/GameObject/Lutin/BulleDialogue.js",
    "Programmes/GameObject/Lutin/Lutin.js",
    "Programmes/GameObject/Lutin/Lutin_SC.js",
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

function MainScriptLoaded(Name)
{
    console.log("Le Fichier " + Name + ".js n'est pas présent dans le dossier Fichiers. Il doit être créé, pour cela copier le fichier existant depuis 'Moteur de jeu/Base Fichier/" + Name + ".js'");
}

console.log("[INFO] - Chargement des modules terminé")