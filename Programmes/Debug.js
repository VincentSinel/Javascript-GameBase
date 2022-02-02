var GridSize = 40
class Debug
{
    static Dessin(Context)
    {
        //this.Cible(Context)
        this.Grid(Context, Math.floor(GridSize))

        var textes = [];
        let vec = Camera.CameraVersEcran(new Vecteur2(Camera.AdapteX(0), Camera.AdapteY(0)))
        textes.push("Camera X : " + Camera.X)
        textes.push("Camera Y : " + Camera.Y)
        textes.push("Camera O : " + Camera.Direction)
        textes.push("Souris X : " + Souris.X)
        textes.push("Souris Y : " + Souris.Y)
        textes.push("Center X : " + vec.X)
        textes.push("Center Y : " + vec.Y)
        textes.push("Grid Siz : " + Math.floor(GridSize))

        this.DessinInfo(Context, textes)
    }

    /**
     * Créer une cible au centre de l'écran
     * @param {context} Context Context de dessin
     */
    static Cible(Context)
    {
        Context.strokeStyle = "Red"
        Context.beginPath();
        Context.moveTo(0,0);
        Context.lineTo(Ecran_Largeur, Ecran_Hauteur);
        Context.stroke();
        Context.beginPath();
        Context.moveTo(Ecran_Largeur,0);
        Context.lineTo(0, Ecran_Hauteur);
        Context.stroke();
        Context.beginPath();
        Context.moveTo(Ecran_Largeur / 2,0);
        Context.lineTo(Ecran_Largeur / 2, Ecran_Hauteur);
        Context.stroke();
        Context.beginPath();
        Context.moveTo(0,Ecran_Hauteur / 2);
        Context.lineTo(Ecran_Largeur,Ecran_Hauteur / 2);
        Context.stroke();
    }

    /**
     * Créer une grille de la taille choisi sur le canvas en prenant en compte la position de la camera
     * @param {context} Context Context de dessin
     * @param {number} Size Taille des cellules en pixel
     */
    static Grid(Context, Size)
    {
        Context.save();
        Camera.DeplacerCanvas(Context)

        let maxsize = Math.sqrt(Ecran_Largeur * Ecran_Largeur + Ecran_Hauteur * Ecran_Hauteur) / (Camera.Zoom / 100.0)
        let BorderX = Camera.AdapteX(maxsize / 2);
        let BorderY = Camera.AdapteY(- maxsize / 2);
        let startX = BorderX % Size
        let startY = BorderY % Size
        while(startX < maxsize)
        {
            Context.strokeStyle = "Gray"
            if (BorderX - startX == 0)
            {
                Context.strokeStyle = "Cyan"
            }
            Context.beginPath();
            Context.moveTo(startX - maxsize / 2, - maxsize / 2);
            Context.lineTo(startX - maxsize / 2, maxsize / 2);
            Context.stroke();
            startX += Size;
        }
        while(startY < maxsize)
        {
            Context.strokeStyle = "Gray"
            if (BorderY - startY == 0)
            {
                Context.strokeStyle = "Cyan"
            }
            Context.beginPath();
            Context.moveTo( - maxsize / 2,startY  - maxsize / 2);
            Context.lineTo(maxsize / 2, startY - maxsize / 2);
            Context.stroke();
            startY += Size;
        }

        Context.restore();  
    }


    /**
     * Ecris dans l'angle de l'écran la position de la camera
     * @param {context} Context Context de dessin
     * @param {Array<string>} Texte Liste des textes à afficher
     */
    static DessinInfo(Context,Texte)
    {
        Context.fillStyle = "white"
        Context.strokeStyle = "Black"
        Context.font = "12px Arial";
        for (let index = 0; index < Texte.length; index++) 
        {
            Context.fillText(Texte[index], 5, 17 + 13 * index)
        }
    }

}