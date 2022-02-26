class Debug
{
    static FPS_Reel = 0;
    static GridSize = 40;
    static Textes = [];
    static Vecteurs = []; // Les vecteur sont des vecteurs 4
    static Parametre = {Grille: false, Info: true, Cible: false, Vecteur: true, Camera: true}
    static UPDATE(Context, etape, Delta)
    {
        if (etape == "PreCalcul")
        {
            if (Debug.Parametre.Camera)
            {
                Debug.DeplaceCamera()
            }
        }
        else if (etape == "Pre")
        {
            if (Debug.Parametre.Grille)
            {
                this.Grid(Context, Math.floor(Debug.GridSize))
            }
        }
        else
        {
            if (Debug.Parametre.Info)
            {
                Debug.FPS_Reel = Math.round((Debug.FPS_Reel * 59 + FPS / Delta) / 60);
                Debug.Textes.push("FPS : " + Debug.FPS_Reel)
                Debug.Textes.push("Camera X : " + Camera.X.toFixed(2))
                Debug.Textes.push("Camera Y : " + Camera.Y.toFixed(2))
                Debug.Textes.push("Camera O : " + Camera.Direction)
                Debug.Textes.push("Camera Z : " + Camera.Zoom.toFixed(2))
                Debug.Textes.push("Souris X : " + Souris.X.toFixed(2))
                Debug.Textes.push("Souris Y : " + Souris.Y.toFixed(2))
                Debug.Textes.push("Grid Siz : " + Math.floor(Debug.GridSize))
                this.DessinInfo(Context, Debug.Textes)
                Debug.Textes = [];
            }
    
            if (Debug.Parametre.Cible)
            {
                this.Cible(Context)
            }
    
            if (Debug.Parametre.Vecteur)
            {
                for (let v = 0; v < Debug.Vecteurs.length; v++) 
                {
                    Debug.Vecteur(Context, Debug.Vecteurs[v]);
                }
                Debug.Vecteurs = []
            }
        }

        
    }


    static DeplaceCamera()
    {
        if (Clavier.ToucheBasse("j"))
        {
            Camera.Direction += 1
            Camera.Direction = Camera.Direction % 360
        }
        if (Clavier.ToucheBasse("l"))
        {
            Camera.Direction -= 1
            Camera.Direction = Camera.Direction % 360
        }
        if (Clavier.ToucheBasse("i"))
        {
            Camera.Zoom += 3 * Camera.Zoom / 100
        }
        if (Clavier.ToucheBasse("k"))
        {
            Camera.Zoom -= 3 * Camera.Zoom / 100
            //Camera.Zoom = Math.max(Camera.Zoom, 0)
        }

        if (Clavier.ToucheBasse("q"))
        {
            Camera.X -= 300 / Camera.Zoom;
        }
        if (Clavier.ToucheBasse("z"))
        {
            Camera.Y += 300 / Camera.Zoom;
        }
        if (Clavier.ToucheBasse("d"))
        {
            Camera.X += 300 / Camera.Zoom;
        }
        if (Clavier.ToucheBasse("s"))
        {
            Camera.Y -= 300 / Camera.Zoom;
        }

        if (Clavier.ToucheJusteBasse("a"))
        {
            Debug.GridSize *= 2;
        }
        if (Clavier.ToucheJusteBasse("e"))
        {
            Debug.GridSize /= 2;
            Debug.GridSize = Math.max(Debug.GridSize, 1)
        }
    }

    static AjoutVecteur(centre,direction)
    {
        Debug.Vecteurs.push(
            {
                x0: centre.X, 
                y0: centre.Y, 
                x1: centre.X + direction.X, 
                y1: centre.Y - direction.Y
            })
    }

    static Vecteur(Context, vec)
    {
        Context.save();
        Camera.DeplacerCanvas(Context)

        Context.strokeStyle = "green"

        Context.beginPath();
        Context.moveTo(vec.x0, vec.y0);
        Context.lineTo(vec.x1, vec.y1);
        Context.stroke();

        Context.strokeRect(vec.x1 - 1, vec.y1 - 1, 2, 2)

        Context.restore();
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
        Context.font = "12px Arial";
        for (let index = 0; index < Texte.length; index++) 
        {
            Context.fillText(Texte[index], 5, 17 + 13 * index)
        }
    }

    /**
     * Ajoute un texte dans la zone info (Haut gauche de l'écran)
     * @param {string} Texte Texte à afficher
     */
    static AjoutInfo(Texte)
    {
        Debug.Textes.push(Texte)
    }
}