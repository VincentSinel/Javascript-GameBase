class Game
{
    // Variable définissant la taille de la fenêtre du jeu
    static #Ecran_Largeur = 16 * 64;
    static #Ecran_Hauteur = 9 * 64;
    static #DPI = window.devicePixelRatio;
    // Définition du nombre de FPS souhaité (Pour le calcul du temps nombre frame écoulé)
    static #FPS = 60;
    static #MAXFrameJump = 60;

    static #canvas;
    static #ctx;
    static #RealContext;
    static #Ratio = 1;
    static #OffSetX = 0;
    static #OffSetY = 0;

    static #TotalFrame = 0
    static #TotalTime = 0
    static #DepartTime = 0
    static #TempsPrecedent = Date.now();
    static #Pause_All = 0;
    static #Pause_UI = 0;
    static #Pause_Game = 0;

    static #GameSpeed = 1;
    static #CouleurFond = "black";
    static #SceneActuel

    static #Fade = 1.0;
    static #Fading = 0;

    // // Variable lié au canvas;
    // var canvas, ctx;
    // var TotalFrame = 0;
    // var TotalTime = 0;
    // var DepartTime = 0;

    // // Information supplémentaire;
    // var dpi = window.devicePixelRatio;
    // var TempsPrecedent = Date.now();
    // var fade = 1.0; var fading = 0;
    // var SceneActuel;
    // var Pause = false;

    //#region GETTER SETTER
    
    static get Ecran_Largeur()
    {
        return Game.#Ecran_Largeur;
    }
    static get Ecran_Hauteur()
    {
        return Game.#Ecran_Hauteur;
    }
    static get Diagonal()
    {
        return Math.sqrt(Game.Ecran_Largeur * Game.Ecran_Largeur + Game.Ecran_Hauteur * Game.Ecran_Hauteur)
    }
    static get FPS()
    {
        return Game.#FPS
    }
    static get DPI()
    {
        return Game.#DPI
    }
    static get MAXFrameJump()
    {
        return Game.#MAXFrameJump
    }
    static get TotalFrame()
    {
        return Math.floor(Game.#TotalFrame)
    }
    static get TotalTime()
    {
        return Game.#TotalTime
    }
    static get DepartTime()
    {
        return Game.#DepartTime
    }
    static get TempsPrecedent()
    {
        return Game.#TempsPrecedent
    }



    static get Pause_All()
    {
        return Game.Pause_Game && Game.Pause_UI
    }
    static set Pause_All(v)
    {
        if (typeof(v) === "boolean")
        {
            if (v)
                Game.#Pause_All += 1;
            else
                Game.#Pause_All = Math.max(0, Game.#Pause_All - 1);
        }
        else
        {
            Debug.LogErreurType("Pause", "Boolean", v)
        }
    }
    static get Pause_Game()
    {
        return (Game.#Pause_Game > 0) || (Game.#Pause_All > 0)
    }
    static set Pause_Game(v)
    {
        if (typeof(v) === "boolean")
        {
            if (v)
                Game.#Pause_Game += 1;
            else
                Game.#Pause_Game = Math.max(0, Game.#Pause_Game - 1);
        }
        else
        {
            Debug.LogErreurType("Pause", "Boolean", v)
        }
    }
    static get Pause_UI()
    {
        return (Game.#Pause_UI > 0) || (Game.#Pause_All > 0)
    }
    static set Pause_UI(v)
    {
        if (typeof(v) === "boolean")
        {
            if (v)
                Game.#Pause_UI += 1;
            else
                Game.#Pause_UI = Math.max(0, Game.#Pause_UI - 1);
        }
        else
        {
            Debug.LogErreurType("Pause", "Boolean", v)
        }
    }




    static get GameSpeed()
    {
        return Game.#GameSpeed
    }
    static set GameSpeed(v)
    {
        if (typeof(v) === "number")
        {
            Game.#GameSpeed = v
        }
        else
        {
            Debug.LogErreurType("GameSpeed", "Number", v)
        }
    }
    static get Fade()
    {
        return Game.#Fade
    }
    static set Fade(v)
    {
        if (typeof(v) === "number")
        {
            if (v >= 0 && v <= 1)
                Game.#Fade = v
            else
                Debug.Log("La valeur choisie pour Fade n'est pas correct. Celle-ci doit être compris entre 0 et 1  valeur ► " + v, 1)
        }
        else
        {
            Debug.LogErreurType("Fade", "Number", v)
        }
    }
    static get Fading()
    {
        return Game.#Fading
    }
    static set Fading(v)
    {
        if (typeof(v) === "number")
        {
            if (v === 0 || v === 1 || v === -1)
                Game.#Fading = v
            else
                Debug.Log("La valeur choisie pour Fading n'est pas correct. Celle-ci doit être -1, 0 ou 1  valeur ► " + v, 1)
        }
        else
        {
            Debug.LogErreurType("Fading", "Number", v)
        }
    }


    static get CouleurFond()
    {
        return Game.#CouleurFond
    }
    static set CouleurFond(v)
    {
        if (typeof(v) === "string")
        {
            Game.#CouleurFond = v
        }
        else
        {
            Debug.LogErreurType("CouleurFond", "string", v)
        }
    }

    static get SceneActuel()
    {
        return Game.#SceneActuel
    }
    static set SceneActuel(v)
    {
        if (v instanceof Scene)
        {
            Game.#SceneActuel = v
        }
        else
        {
            Debug.LogErreurType("SceneActuel", "Scene", v)
        }
    }
    static get RealContext()
    {
        return Game.#RealContext;
    }
    static get MainContext()
    {
        return Game.#ctx;
    }
    static get Ratio()
    {
        return Game.#Ratio;
    }
    static get OffSetX()
    {
        return Game.#OffSetX;
    }
    static get OffSetY()
    {
        return Game.#OffSetY;
    }

    //#endregion

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
    }

    /**
     * Initialise les objest utilisateur et lance la boucle principal après 
     * le chargement des différents fichier par la class LoadScreen
     */
     static DemarrerBouclePrincipal()
    {
        Game.#DepartTime = Date.now();
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
        if (Game.Pause_All)
        {
            window.requestAnimationFrame(Game.BouclePrincipale);
            return;
        }

        // Calcul du nombre de frame écoulé depuis la dernière mise a jour (vis à vis des FPS définit)
        // EX: 
        // dt = 1 si le jeu tourne au nombre de FPS convenue
        // dt = 0.5 si le jeu tourne deux fois plus vite que le nombre de FPS convenue (120 FPS au lieu de 60 par exemple)
        // dt = 2 si le jeu tourne deux fois moins vite que le nombre de FPS convenue (30 FPS au lieu de 60 par exemple)
        // dt ne peut pas depasser la variable MAXFrameJump pour eviter les problèmes de colission (a ajuster et tester)
        let now = Date.now();
        let dt = Math.min((now - Game.#TempsPrecedent) * Game.FPS / 1000.0, Game.MAXFrameJump) * Game.GameSpeed;
        Game.#TotalTime = (now - Game.#DepartTime) / 1000.0;
        // Ajoute dt au total des frames
        Game.#TotalFrame += dt;


        // Action du DEBUGGEUR avant calcul général (Déplacement camera par exemple)
        Debug.UPDATE(Game.RealContext, "PreCalcul", dt);

        Sons.Update();
        Game.MiseAJourFade();
        Tilesets.Update(dt);
        Scene.Update(dt);
        GameObject.Update(dt);
        // Lancement de la boucle de calcul;
        if (Game.SceneActuel && !Game.Pause_Game)
            Game.SceneActuel.Update(dt);
        
        if (!Game.Pause_UI)
        {
            UI_Window.Update(dt);
            //UIElement.Calcul(dt);
        }

        // Fix pour la résolution d'écran (voir plus bas)
        Game.fix_dpi();

        //Efface l'écran
        Game.RealContext.fillStyle = Game.CouleurFond;
        Game.RealContext.fillRect(0,0,Game.Ecran_Largeur, Game.Ecran_Hauteur);
        Game.RealContext.imageSmoothingEnabled = false;

        // Action du DEBUGGEUR avant Dessin général (Dessin de la grille par exemple)
        Debug.UPDATE(Game.RealContext, "Pre", dt);

        // Lancement de la boucle de dessin;
        Game.SceneActuel.Draw(Game.RealContext);
        UI_Window.Draw(Game.RealContext);
        //UIElement.Dessin(Game.RealContext);

        // Mise a jour des modules tardif
        Clavier.Update();
        Souris.Update();

        // Action du DEBUGGEUR après Dessin général (Dessin vecteur et forme 2D)
        Debug.UPDATE(Game.RealContext, "Post", dt);

        // Dessine le rendu sur le canvas principal
        Game.#ctx.imageSmoothingEnabled = false;
        Game.#Ratio = Math.min(Game.#canvas.width / Game.Ecran_Largeur, Game.#canvas.height / Game.Ecran_Hauteur);
        Game.#OffSetX = (Game.#canvas.width - Game.#Ratio * Game.Ecran_Largeur) / 2
        Game.#OffSetY = (Game.#canvas.height - Game.#Ratio * Game.Ecran_Hauteur) / 2
        //Game.#ctx.scale(Game.#Ratio,Game.#Ratio)//Game.#canvas.width / Game.Ecran_Largeur, Game.#canvas.height / Game.Ecran_Hauteur);
        Game.#ctx.drawImage(Game.RealContext.canvas, 
            0,0,Game.Ecran_Largeur,Game.Ecran_Hauteur,
            Game.OffSetX,Game.OffSetY,
            Game.#ctx.canvas.width - 2 * Game.#OffSetX, 
            Game.#ctx.canvas.height - 2 * Game.#OffSetY);

        // Met en place le dégradé d'affichage
        Game.#ctx.fillStyle = Color.Couleur(0, 0, 0, Game.#Fade);
        Game.#ctx.fillRect(0, 0, Game.#ctx.canvas.width, Game.#ctx.canvas.height);

        // Action du DEBUGGEUR après Dessin maincontext (Ecriture des informations par exemple)
        Debug.UPDATE(Game.MainContext, "Final", dt);

        // Enregistrement du temps
        Game.#TempsPrecedent = now;

        // Relance de cette fonction
        window.requestAnimationFrame(Game.BouclePrincipale);

    }
    /**==========================================================================================================================================
     * Gestion du dégradé d'écran
     *///=======================================================================================================================================
    static MiseAJourFade()
    {
        if (Game.Fading === 1)
        {
            if (Game.Fade < 1.0)
            {
                Game.Fade = Math.min(Game.Fade + 0.05, 1.0)
            }
            else
            {
                Game.Fading = 0;
            }
        }
        else if (Game.Fading === -1)
        {
            if (Game.Fade > 0.0)
            {
                Game.Fade = Math.max(Game.#Fade - 0.05, 0.0)
            }
            else
            {
                Game.Fading = 0;
            }
        }
    }

    /**==========================================================================================================================================
     * Création du canvas sur la page HTML
     *///==========================================================================================================================================
    static CreationCanvas()
    {
        // Création du canvas
        Game.#canvas = document.createElement("canvas");
        // Ajout à la page
        document.body.appendChild(Game.#canvas);
        // Modification des dimensions
        Game.#canvas.width = Game.Ecran_Largeur; // la largeur
        Game.#canvas.height = Game.Ecran_Hauteur; // la hauteur
        
        Game.#canvas.style.width = Game.Ecran_Largeur + 'px';
        Game.#canvas.style.height = Game.Ecran_Hauteur + 'px';

        // Desactive le clic droit sur le canvas
        Game.#canvas.oncontextmenu = () => false;

        // Récupération du context de dessin
        Game.#ctx = Game.#canvas.getContext("2d");
        Game.#ctx.imageSmoothingEnabled = false;
        Game.#ctx.scale(2,2);
        

        Game.#RealContext = document.createElement("canvas").getContext("2d");
        Game.#RealContext.canvas.width = Game.Ecran_Largeur; // Modification taille
        Game.#RealContext.canvas.height = Game.Ecran_Hauteur; // Modification taille
    }

    /**
     * Modifie la taille du canvas pour respecter le DPI de l'écran
     * @see {@link https://medium.com/wdstack/fixing-html5-2d-canvas-blur-8ebe27db07da}
     */
    static fix_dpi() {
        //get CSS height
        //the + prefix casts it to an integer
        //the slice method gets rid of "px"
        let style_height = +getComputedStyle(Game.#canvas).getPropertyValue("height").slice(0, -2);//get CSS width
        let style_width = +getComputedStyle(Game.#canvas).getPropertyValue("width").slice(0, -2);//scale the canvas
        Game.#canvas.setAttribute('height', style_height * Game.#DPI);
        Game.#canvas.setAttribute('width', style_width * Game.#DPI);
        Game.#canvas.style.width = Game.Ecran_Largeur + 'px';
        Game.#canvas.style.height = Game.Ecran_Hauteur + 'px';
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

        Game.#canvas.addEventListener('mousedown', Souris.MouseDownHandle);
        Game.#canvas.addEventListener('mouseup', Souris.MouseUpHandle);
        Game.#canvas.addEventListener('mousemove', Souris.MouseMoveHandle);
        Game.#canvas.addEventListener("wheel", Souris.MouseScroll);
        Game.#canvas.addEventListener('contextmenu', event => event.preventDefault());

        document.addEventListener('fullscreenchange', event => {  Camera.RecalculPleinEcran(); });
    }
    //===============================================================================
}

//============================================================================================
// Ajouter ici les variables global à créer

// var Player

//============================================================================================

/**
 * Initialisation des objets du jeu.
 */
 function InitObjets()
 {
 }
 
 /**
  * Lance le chargement des tilemaps
  */
 function LoadTilemap()
 {
    //Tilesets.Add_Auto("Images/Tilemap/A1_Eau1.png", "A1");
 }