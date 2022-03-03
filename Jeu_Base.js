//============================================================================================
//  Gestion principal de la boucle de jeu.
//  Ici ce trouve les parametre d'écran et de FPS.
//============================================================================================


// Variable définissant la taille de la fenêtre du jeu
const Ecran_Largeur = 16 * 64;
const Ecran_Hauteur = 9 * 64;
const Diagonal = Math.sqrt(Ecran_Largeur * Ecran_Largeur + Ecran_Hauteur * Ecran_Hauteur)
// Définition du nombre de FPS souhaité (Pour le calcul du temps nombre frame écoulé)
const FPS = 60;
const MAXFrameJump = 2;
// Variable lié au canvas;
var canvas, ctx;
var TotalFrame = 0;
// Vraible lié au temps;
let dpi = window.devicePixelRatio;
var TempsPrecedent = Date.now();

/**
 * Initialisation du programme
 */
 function Initialisation()
 {
    console.clear();
    Datas.ChargerData();
    CreationCanvas();
    InitEvenements();
    InitObjets();
 
    //setInterval(BouclePrincipale, 1000 / FPS);
    window.requestAnimationFrame(BouclePrincipale);
 }
 
/**
 * Boucle principale du jeu
 */
 function BouclePrincipale()
 {
    // Ajoute 1 au total des frames
    TotalFrame += 1;
    // Calcul du nombre de frame écoulé depuis la dernière mise a jour (vis à vis des FPS définit)
    // EX: 
    // dt = 1 si le jeu tourne au nombre de FPS convenue
    // dt = 0.5 si le jeu tourne deux fois plus vite que le nombre de FPS convenue (120 FPS au lieu de 60 par exemple)
    // dt = 2 si le jeu tourne deux fois moins vite que le nombre de FPS convenue (30 FPS au lieu de 60 par exemple)
    // dt ne peut pas depasser la variable MAXFrameJump pour eviter les problèmes de colission (a ajuster et tester)
    let now = Date.now();
    let dt = Math.min((now - TempsPrecedent) * FPS / 1000.0, MAXFrameJump);

    let TempContext = document.createElement("canvas").getContext("2d");
    TempContext.canvas.width = Ecran_Largeur; // Modification taille
    TempContext.canvas.height = Ecran_Hauteur; // Modification taille

    // Action du DEBUGGEUR avant calcul général (Déplacement camera par exemple)
    Debug.UPDATE(TempContext, "PreCalcul", dt);

    // Lancement de la boucle de calcul;
    Calcul(dt);
    UIElement.Calcul(dt);

    // Fix pour la résolution d'écran (voir plus bas)
    fix_dpi()

    //Efface l'écran
    TempContext.fillStyle = "black"
    TempContext.fillRect(0,0,Ecran_Largeur, Ecran_Hauteur);

    // Action du DEBUGGEUR avant Dessin général (Dessin de la grille par exemple)
    Debug.UPDATE(TempContext, "Pre", dt);

    
    TempContext.imageSmoothingEnabled = false;
    // Lancement de la boucle de dessin;
    Dessin(TempContext);
    UIElement.Dessin(TempContext);

    if (Clavier.ToucheJusteBasse("Escape"))
    {
        if (document.fullscreenElement != null)
        {
            if (Camera.FullScreen)
            {
                //Camera.PleinEcran();
            }
        }
    }

    // Mise a jour de l'appuie des touches
    Clavier.Update();
    Souris.Update();

    // Action du DEBUGGEUR après Dessin général (Ecriture des informations par exemple)
    Debug.UPDATE(TempContext, "Post", dt);

    ctx.imageSmoothingEnabled = false;
    ctx.scale(canvas.width / Ecran_Largeur, canvas.height / Ecran_Hauteur);
    ctx.drawImage(TempContext.canvas, 0, 0)

    // Enregistrement du temps
    TempsPrecedent = now;

    // Relance de cette fonction
    window.requestAnimationFrame(BouclePrincipale);
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
    
    canvas.style.width = Ecran_Largeur + 'px';
    canvas.style.height = Ecran_Hauteur + 'px';

    // Desactive le clic droit sur le canvas
    canvas.oncontextmenu = () => false;

    // Récupération du context de dessin
    ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = false;
    ctx.scale(2,2);
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
var mousescroll = function(e){
    Souris.MouseScroll(e);
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
    canvas.addEventListener("mousewheel", mousescroll);
    canvas.addEventListener("DOMMouseScroll", mousescroll);
    
    document.addEventListener('fullscreenchange', event => {  Camera.RecalculPleinEcran(); });
}
//=====================================================