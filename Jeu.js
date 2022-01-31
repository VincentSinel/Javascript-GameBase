//============================================================================================
// Ajouter ici les variables à créer

var lutin = [];

var patch;

//============================================================================================


/**
 * Initialisation des objets du jeu.
 */
function InitObjets()
{
    // Ajouter ici les objets à creer
    //lutin = new Lutin(0,0,["Images/Chat.png"])
    for (let index = 0; index < 300; index++) 
    {
        lutin.push(new ExempleLutin());
    }

    patch = new BulleDialogue("A string or regular expression to", 250,250)

}

/**
 * Mise a jour des calculs (Position, collision, etc ...)
 */
function Calcul()
{
    // Ajouter ici la mise a jour des calculs d'objets
    //lutin.Calcul();
    for (let index = 0; index < lutin.length; index++) 
    {
        lutin[index].Calcul();
    }
    patch.X += 1
    patch.Y += 1
}


/**
 * Mise a jour du visuel (Dessin dans le canvas)
 */
function Dessin()
{
    // Ajouter ici la mise a jour des dessin d'objets
    //lutin.Dessin(ctx);
    for (let index = 0; index < lutin.length; index++) 
    {
        lutin[index].Dessin(ctx);
    }

    patch.Dessin(ctx)
}

//============================================================================================
//  Ne rien modifier après cette limite
//============================================================================================


// Variable définissant la taille de la fenêtre du jeu
const Ecran_Largeur = 16 * 64;
const Ecran_Hauteur = 9 * 64;
// Définition du nombre de FPS
const FPS = 60;
// Variable lié au canvas;
var canvas, ctx;
var TotalFrame = 0;

/**
 * Initialisation du programme
 */
 function Initialisation()
 {
    CreationCanvas();
    InitEvenements();
    InitObjets();
 
    setInterval(BouclePrincipale, 1000 / FPS);
 }
 
/**
 * Boucle principale du jeu
 */
 function BouclePrincipale()
 {
    TotalFrame += 1;
    Calcul();
    ctx.fillStyle = "black"
    ctx.fillRect(0,0,Ecran_Largeur, Ecran_Hauteur);
    Dessin();
 }

//============================================================================================
/// Création du canvas sur la page HTML
//============================================================================================

function CreationCanvas()
{
    // Création du canvas
    canvas = document.createElement("canvas");
    // Ajout à la page
    document.body.appendChild(canvas);
    // Modification des dimensions
    canvas.width = Ecran_Largeur; // la largeur
    canvas.height = Ecran_Hauteur; // la hauteur
    // Récupération du context de dessin
    ctx = canvas.getContext("2d");
}

//============================================================================================
/// Ajout des test d'événements (Appuye d'une touche ou de la souris, Position de la souris)
//============================================================================================

var keydown = function (e) {
    Clavier.KeyDown(e);
};
var keyup = function (e) {
    Clavier.KeyUp(e);
};
var mousedown = function (e) {
    Souris.MouseDown(e);
};
var mouseup = function (e) {
    Souris.MouseUp(e);
};
var mousemove = function(e){
    Souris.MouseMove(e);
}
//=====================================================
/**
 * Ajoute les différents test d'événement
 */
function InitEvenements(){
    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    
    canvas.addEventListener('mousedown', mousedown);
    canvas.addEventListener('mouseup', mouseup);
    canvas.addEventListener('mousemove', mousemove);
}
//=====================================================