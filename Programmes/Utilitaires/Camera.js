class Camera
{
    static X = 0;
    static Y = 0;
    static Zoom = 100;
    static Direction = 0;

    static #FullScreen = false;

    /**
     * Adapte une position X à celle de la camera
     * @param {number} posX 
     * @returns Position X vis à vis de la camera
     */
    static AdapteX(posX)
    {
        return posX - this.X;
    }
    /**
     * Adapte une position Y à celle de la camera
     * @param {number} posY 
     * @returns Position Y vis à vis de la camera
     */
    static AdapteY(posY)
    {
        return - (posY - this.Y);
    }
    /**
     * Adapte un Zoom à celui de la camera
     * @param {number} posX 
     * @returns Zoom vis à vis de la camera
     */
    static AdapteZoom(zoom)
    {
        return this.Zoom / 100.0 * zoom / 100.0
    }

    /**
     * Déplace le context au centre de la camera
     * @param {context} Context 
     */
    static DeplacerCanvas(Context)
    {
        // Translate le canvas au centre de l'écran
        Context.translate(Ecran_Largeur / 2, Ecran_Hauteur / 2); 
        // Tourne le canvas de l'angle pour la camera
        Context.rotate(Camera.Direction * Math.PI / 180);
        // Zoom le canvas celon le zoom de camera
        Context.scale(Camera.Zoom / 100.0, Camera.Zoom / 100.0)
    }

    /**
     * Transforme un point dans le repère de la camera en un point dans le repère du canvas.
     * @param {Vecteur2} P Point à déplacer
     * @returns Vecteur représentant la Position à l'écran dans le repère du canvas
     */
    static CameraVersEcran(P)
    {
        let cos = Math.cos(- this.Direction * Math.PI / 180);
        let sin = Math.sin(- this.Direction * Math.PI / 180);
        let zoom = this.Zoom / 100.0;
        let disX = P.X * zoom;
        let disY = -P.Y * zoom;
        let x = Ecran_Largeur / 2 + disX * cos - disY * sin;
        let y = Ecran_Hauteur / 2 - disX * sin - disY * cos;

        return new Vecteur2(x,y)
    }

    /**
     * Transforme un point dans le repère du canvas en un point dans le repère de la camera.
     * @param {Vecteur2} P Point à déplacer
     * @returns Vecteur représentant la Position dans le repère de la camera
     */
     static EcranVersCamera(P)
     {
        let cos = Math.cos(this.Direction * Math.PI / 180);
        let sin = Math.sin(this.Direction * Math.PI / 180);
        let zoom = this.Zoom / 100.0;
        let disX = (P.X - Ecran_Largeur / 2) / zoom;
        let disY = (Ecran_Hauteur / 2 - P.Y) / zoom;

        let x = this.X + disX * cos - disY * sin;
        let y = this.Y + disX * sin + disY * cos;
 
         return new Vecteur2(x,y)
     }


     static PleinEcran()
     {
         if (Camera.#FullScreen)
         {
            if(document.webkitCancelFullScreen) 
            {
                document.webkitCancelFullScreen(); //Chrome
                Camera.#FullScreen = false;
            }
            else
            {
                document.mozCancelFullScreen();
                Camera.#FullScreen = false;
            }
         }
         else
         {
            if(canvas.webkitRequestFullScreen) 
            {
                document.body.webkitRequestFullScreen();
                Camera.#FullScreen = true;
            }
            else 
            {
                document.body.mozRequestFullScreen();
                Camera.#FullScreen = true;
            } 
         }
     }
}