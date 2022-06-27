//==========================================================================================================================================
//  Gestion principal de la boucle de jeu.
//  Ici ce trouve les parametre d'écran et de FPS.
//==========================================================================================================================================


// // Variable définissant la taille de la fenêtre du jeu
// const Ecran_Largeur = 16 * 64;
// const Ecran_Hauteur = 9 * 64;
// const Diagonal = Math.sqrt(Ecran_Largeur * Ecran_Largeur + Ecran_Hauteur * Ecran_Hauteur)
// var CouleurFond = "black";
// // Définition du nombre de FPS souhaité (Pour le calcul du temps nombre frame écoulé)
// const FPS = 60;
// const MAXFrameJump = 60;
// // Variable lié au canvas;
// var canvas, ctx;
// var TotalFrame = 0;
// var TotalTime = 0;
// var DepartTime = 0;
// var GameSpeed = 1;
// // Information supplémentaire;
// var dpi = window.devicePixelRatio;
// var TempsPrecedent = Date.now();
// var fade = 1.0; var fading = 0;
// var SceneActuel;
// var Pause = false;

/**
 * Class gérant le jeu
 */
class Game
{
    static #TempContext;

    /**
     * Initialisation du programme
     */
    static Initialisation()
    {
        Game.CreationCanvas();
        Datas.ChargerData();
        Sons.Initialisation();
        Textures.Initialisation();
        Game.InitEvenements();

        Game.#TempContext = document.createElement("canvas").getContext("2d");
        Game.#TempContext.canvas.width = Ecran_Largeur; // Modification taille
        Game.#TempContext.canvas.height = Ecran_Hauteur; // Modification taille
    }

    /**
     * Initialise les objest utilisateur et lance la boucle principal après 
     * le chargement des différents fichier par la class LoadScreen
     */
     static DemarrerBouclePrincipal()
    {
        DepartTime = Date.now();
        InitObjets();
        Debug.StartMesure();
        window.requestAnimationFrame(Game.BouclePrincipale);
    }
    
    /**
     * Boucle principale du jeu
     */
     static BouclePrincipale()
    {
        Debug.EndMesure();
        Debug.StartMesure();
        if (Pause)
        {
            window.requestAnimationFrame(Game.BouclePrincipale);
            return;
        }
        // Ajoute 1 au total des frames
        TotalFrame += 1;
        // Calcul du nombre de frame écoulé depuis la dernière mise a jour (vis à vis des FPS définit)
        // EX: 
        // dt = 1 si le jeu tourne au nombre de FPS convenue
        // dt = 0.5 si le jeu tourne deux fois plus vite que le nombre de FPS convenue (120 FPS au lieu de 60 par exemple)
        // dt = 2 si le jeu tourne deux fois moins vite que le nombre de FPS convenue (30 FPS au lieu de 60 par exemple)
        // dt ne peut pas depasser la variable MAXFrameJump pour eviter les problèmes de colission (a ajuster et tester)
        let now = Date.now();
        let dt = Math.min((now - TempsPrecedent) * FPS / 1000.0, MAXFrameJump) * GameSpeed;
        TotalTime = (now - DepartTime) / 1000.0;

        // Action du DEBUGGEUR avant calcul général (Déplacement camera par exemple)
        Debug.UPDATE(Game.#TempContext, "PreCalcul", dt);

        Tilesets.Update(dt);

        Scene.Update(dt);
        GameObject.Update(dt);
        // Lancement de la boucle de calcul;
        if (SceneActuel)
            SceneActuel.Update(dt);
        //Calcul(dt);
        UIElement.Calcul(dt);

        // Fix pour la résolution d'écran (voir plus bas)
        Game.fix_dpi();

        //Efface l'écran
        Game.#TempContext.fillStyle = CouleurFond;
        Game.#TempContext.fillRect(0,0,Ecran_Largeur, Ecran_Hauteur);
        Game.#TempContext.imageSmoothingEnabled = false;

        // Action du DEBUGGEUR avant Dessin général (Dessin de la grille par exemple)
        Debug.UPDATE(Game.#TempContext, "Pre", dt);

        // Lancement de la boucle de dessin;
        SceneActuel.Draw(Game.#TempContext);
        //Dessin(Game.#TempContext);
        UIElement.Dessin(Game.#TempContext);

        // Mise a jour des modules
        Clavier.Update();
        Souris.Update();
        Sons.Update();
        Game.MiseAJourFade();

        // Action du DEBUGGEUR après Dessin général (Ecriture des informations par exemple)
        Debug.UPDATE(Game.#TempContext, "Post", dt);

        // Dessine le rendu sur le canvas principal
        ctx.imageSmoothingEnabled = false;
        ctx.scale(canvas.width / Ecran_Largeur, canvas.height / Ecran_Hauteur);
        ctx.drawImage(Game.#TempContext.canvas, 0,0);

        // Met en place le dégradé d'affichage
        ctx.fillStyle = Color.Couleur(0, 0, 0, fade);
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Enregistrement du temps
        TempsPrecedent = now;

        // Relance de cette fonction
        window.requestAnimationFrame(Game.BouclePrincipale);

    }
    /**==========================================================================================================================================
     * Gestion du dégradé d'écran
     *///=======================================================================================================================================
    static MiseAJourFade()
    {
        if (fading === 1)
        {
            if (fade < 1.0)
            {
                fade = Math.min(fade + 0.05, 1.0)
            }
            else
            {
                fading = 0;
            }
        }
        else if (fading === -1)
        {
            if (fade > 0.0)
            {
                fade = Math.max(fade - 0.05, 0.0)
            }
            else
            {
                fading = 0;
            }
        }
    }

    /**==========================================================================================================================================
     * Création du canvas sur la page HTML
     *///==========================================================================================================================================
    static CreationCanvas()
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
     * @see {@link https://medium.com/wdstack/fixing-html5-2d-canvas-blur-8ebe27db07da}
     */
    static fix_dpi() {
        //get CSS height
        //the + prefix casts it to an integer
        //the slice method gets rid of "px"
        let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);//get CSS width
        let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);//scale the canvas
        canvas.setAttribute('height', style_height * dpi);
        canvas.setAttribute('width', style_width * dpi);
        canvas.style.width = Ecran_Largeur + 'px';
        canvas.style.height = Ecran_Hauteur + 'px';
    }

    /** ==========================================================================================================================================
     * Ajoute les différents test d'événement (Appuye d'une touche ou de la souris, Position de la souris)
     *///========================================================================================================================================
    static InitEvenements(){
        var keydown = function (e) {
            Clavier.KeyDown(e);
        };
        var keyup = function (e) {
            Clavier.KeyUp(e);
        };

        window.addEventListener('keydown', keydown);
        window.addEventListener('keyup', keyup);

        canvas.addEventListener('mousedown', Souris.MouseDownHandle);
        canvas.addEventListener('mouseup', Souris.MouseUpHandle);
        canvas.addEventListener('mousemove', Souris.MouseMoveHandle);
        canvas.addEventListener("wheel", Souris.MouseScroll);
        canvas.addEventListener('contextmenu', event => event.preventDefault());

        document.addEventListener('fullscreenchange', event => {  Camera.RecalculPleinEcran(); });
    }
    //===============================================================================

}




