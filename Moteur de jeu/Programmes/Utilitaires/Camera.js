/**
 * Module de gestion de la Camera. Les fonctions principales sont :
 * Camera.AdapteX(posX)
 * Camera.AdapteY(posY)
 * Camera.AdapteZoom(zoom)
 * Camera.DeplacerCanvas(Context)
 * Camera.CameraVersEcran(P)
 * Camera.EcranVersCamera(P)
 * Camera.PleinEcran()
 * @class
 * @static
 */
class Camera
{
    static X = 0;
    static Y = 0;
    static Z = 0;
    static Zoom = 1.0;
    static FullScreen = false;
    static #Direction = 0;
    static #Viewport = undefined;

    /**
     * Renvoie le rectangle de vue de la camera
     */
    static get Viewport()
    {
        if (Camera.#Viewport)
        {
            return Camera.#Viewport;
        }
        else
        {
            let p = new Vector(-Game.Ecran_Largeur / 2 / this.Zoom, -Game.Ecran_Hauteur / 2 / this.Zoom);
            p = p.rotate(-Camera.#Direction).add(new Vector(Camera.X, Camera.Y));
            Camera.#Viewport = new Rectangle(p, Game.Ecran_Largeur / this.Zoom, Game.Ecran_Hauteur / this.Zoom, -Camera.#Direction)
            return Camera.#Viewport;
        }
    }
    /**
     * Renvoie le rectangle de vue de la camera sans prendre en compte le zoom
     */
    static get ViewPortZoomLess()
    {
        let p = new Vector(-Game.Ecran_Largeur / 2, -Game.Ecran_Hauteur / 2);
        p = p.rotate(-Camera.#Direction).add(new Vector(Camera.X, Camera.Y));
        return new Rectangle(p, Game.Ecran_Largeur, Game.Ecran_Hauteur, -Camera.#Direction)

    }
    
    //#region STATIC GETTER SETTER

    /**
     * Angle de la camera en radian 
     * @type {float}
     */
    static get RadDirection()
    {
        return Camera.#Direction;
    }
    /**
     * Angle de la camera en degré
     * @type {float}
     */
    static get Direction()
    {
        return Camera.#Direction * 180 / Math.PI;
    }
    static set Direction(value)
    {
        Camera.#Viewport = undefined;
        Camera.#Direction = value * Math.PI / 180;
    }

    //#endregion

    /**
     * Adapte une position X à celle de la camera
     * @param {float} posX 
     * @returns Position X vis à vis de la camera
     */
    static AdapteX(posX)
    {
        return posX - Camera.X;
    }
    /**
     * Adapte une position Y à celle de la camera
     * @param {float} posY 
     * @returns Position Y vis à vis de la camera
     */
    static AdapteY(posY)
    {
        return posY - Camera.Y;
    }
    /**
     * Déplace le context au centre de la camera
     * @param {CanvasRenderingContext2D} Context 
     */
    static DeplacerCanvas(Context)
    {
        //// Sauvegarde la position actuel du canvas 
        //Context.save();
        // Translate le canvas au centre de l'écran
        Context.translate(Game.Ecran_Largeur / 2, Game.Ecran_Hauteur / 2); 
        // Tourne le canvas de l'angle pour la camera
        Context.rotate(Camera.#Direction);
        // Zoom le canvas celon le zoom de camera
        Context.scale(Camera.Zoom, Camera.Zoom)
        // Déplace la camera a son centre
        Context.translate(-Camera.X, -Camera.Y);
    }
    /**
     * Transforme un point dans le repère de la camera en un point dans le repère du canvas.
     * @param {Vector} P Point à déplacer
     * @returns {Vector} Vecteur représentant la Position à l'écran dans le repère du canvas
     */
    static CameraVersEcran(P)
    {
        let cos = Math.cos(- Camera.#Direction);
        let sin = Math.sin(- Camera.#Direction);
        let disX = P.x * Camera.Zoom;
        let disY = P.y * Camera.Zoom;
        let x = Game.Ecran_Largeur / 2 + disX * cos + disY * sin;
        let y = Game.Ecran_Hauteur / 2 - disX * sin + disY * cos;

        return new Vector(x,y)
    }
    /**
     * Transforme un point dans le repère du canvas en un point dans le repère de la camera.
     * @param {Vector} P Point à déplacer
     * @returns {Vector} Vecteur représentant la Position dans le repère de la camera
     */
     static EcranVersCamera(P)
     {
        let cos = Math.cos(Camera.#Direction);
        let sin = Math.sin(Camera.#Direction);
        let disX = (P.x - Game.Ecran_Largeur / 2) / Camera.Zoom;
        let disY = (P.y - Game.Ecran_Hauteur / 2) / Camera.Zoom;

        let x = Camera.X + disX * cos + disY * sin;
        let y = Camera.Y - disX * sin + disY * cos;
 
         return new Vector(x,y)
     }

     /**
      * Lance le plein écran du canvas
      */
     static PleinEcran()
     {
         if (document.fullscreenElement)
         {  
            if (document.exitFullscreen)
            {
                document.exitFullscreen();
            }
            else if(document.webkitCancelFullScreen) 
            {
                document.webkitCancelFullScreen(); //Chrome
            }
            else
            {
                document.mozCancelFullScreen();
            }
         }
         else
         {
            if (Game.MainContext.canvas.requestFullscreen)
            {
                Game.MainContext.canvas.requestFullscreen();
            }
            else if(Game.MainContext.canvas.webkitRequestFullScreen) 
            {
                Game.MainContext.canvas.webkitRequestFullScreen();
            }
            else 
            {
                Game.MainContext.canvas.mozRequestFullScreen();
            }
         }
     }

     /**
      * Recalcul les dimension du canvas pour le plein écran
      */
     static RecalculPleinEcran()
     {
        if (document.fullscreenElement)
        {
            Camera.RedefinirTailleCanvas()
        }
        else
        {
            Game.MainContext.canvas.style.width = Game.Ecran_Largeur + 'px';
            Game.MainContext.canvas.style.height = Game.Ecran_Hauteur + 'px';
            Game.MainContext.canvas.width = Game.Ecran_Largeur;
            Game.MainContext.canvas.height = Game.Ecran_Hauteur;
            Game.MainContext.scale(1,1);
        }
     }

     /**
      * Redefinit la taille du canvas
      */
     static RedefinirTailleCanvas() 
     {
        var canvasRatio = Game.Ecran_Hauteur / Game.Ecran_Largeur;
        var windowRatio = screen.height / screen.width;
        var width;
        var height;

        if (windowRatio < canvasRatio) {
            height = screen.height;
            width = height / canvasRatio ;
        } else {
            width = screen.width;
            height = width * canvasRatio;
        }
    
        Game.MainContext.canvas.style.width = screen.width//width + 'px';
        Game.MainContext.canvas.style.height = screen.height//height + 'px';

        Game.MainContext.canvas.width = screen.width//width;
        Game.MainContext.canvas.height = screen.height//height;
    }
}