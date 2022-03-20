//=====================================================
// Liste des script à charger
//=====================================================

var Scripts = [

    "Programmes/Base/Color.js",
    "Programmes/Base/Polygone.js",
    "Programmes/Base/Vecteur.js",

    "Programmes/Elements/UI/UIElement.js",
    "Programmes/Elements/UI/Panneau.js",
    "Programmes/Elements/UI/Toggle.js",
    "Programmes/Elements/UI/Boutton.js",
    "Programmes/Elements/UI/CheckBox.js",
    "Programmes/Elements/UI/Slider.js",
    "Programmes/Elements/UI/TextBox.js",
    "Programmes/Elements/UI/TextBlock.js",
    "Programmes/Elements/UI/Liste.js",

    "Programmes/Elements/NinePatch.js",
    "Programmes/Elements/Scene.js",
    "Programmes/Elements/Lutin/BulleDialogue.js",
    "Programmes/Elements/Lutin/Lutin.js",
    "Programmes/Elements/Lutin/Lutin_SC.js",
    "Programmes/Elements/Tilemap/Tiles/Tile.js",
    "Programmes/Elements/Tilemap/Tiles/MultiTile.js",
    "Programmes/Elements/Tilemap/TileMap.js",
    "Programmes/Elements/Tilemap/MenuEditionTileMap.js",

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

    "Jeu_Base.js",
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

    Initialisation();
}

function MainScriptLoaded(Name)
{
    console.log("Le Fichier " + Name + ".js n'est pas présent dans le dossier Fichiers. Il doit être créé, pour cela copier le fichier existant depuis 'Moteur de jeu/Base Fichier/" + Name + ".js'");
}

console.log("[INFO] - Chargement des modules terminé")