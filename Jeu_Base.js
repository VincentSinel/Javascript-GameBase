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
let dpi = window.devicePixelRatio;

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
    fix_dpi()
    ctx.fillStyle = "black"
    ctx.fillRect(0,0,Ecran_Largeur, Ecran_Hauteur);
    Debug.Dessin(ctx, "Pre");
    Dessin();
    Clavier.Update();
    Souris.Update();
    Debug.Dessin(ctx, "Post");
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
    ctx.imageSmoothingEnabled = false;
}

/**
 * Modifie la taille du canvas pour respecter le DPI de l'écran
 * Explication : https://medium.com/wdstack/fixing-html5-2d-canvas-blur-8ebe27db07da
 */
function fix_dpi() {
    //get CSS height
    //the + prefix casts it to an integer
    //the slice method gets rid of "px"let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);//get CSS width
    let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);//scale the canvascanvas.setAttribute('height', style_height * dpi);
    canvas.setAttribute('width', style_width * dpi);
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