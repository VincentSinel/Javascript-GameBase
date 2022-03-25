/**
 * Module de Debuggage. Les fonctions principales sont :
 * Debug.AjoutInfo("texte")
 * Debug.AjoutRectangle(rect)
 * Debug.AjoutVecteur(centre, direction)
 * 
 * Variable :
 * Debug.Parametre
 */
class Debug
{
    static FPS_Reel = [];
    static FPS_Mesure = FPS
    static GridSize = 32;
    static Textes = [];
    static Vecteurs = []; // Les vecteur sont des vecteurs 4
    static Rectangles = [] // Les rectangles sont un tableau [X, Y, W, H]
    static Parametre = {Grille: false, Info: true, Cible: false, Vecteur: true, Camera: true, Rectangle: true}
    static InfoPosition = 3; // Position des info de débuggage (0 haut gauche / 1 haut droit / 2 bas gauche / 3 bas droit)
    static UPDATE(Context, etape, Delta)
    {
        if (etape == "PreCalcul")
        {
            if (Debug.Parametre.Camera)
            {
                Debug.#DeplaceCamera()
            }
        }
        else if (etape == "Pre")
        {
            if (Debug.Parametre.Grille)
            {
                this.#Grid(Context, Math.floor(Debug.GridSize))
            }
        }
        else
        {
            if (Debug.Parametre.Info)
            {
                // Calcul des FPS
                Debug.FPS_Reel.push(FPS / Delta);
                if (Debug.FPS_Reel.length > this.FPS_Mesure)
                    Debug.FPS_Reel.shift()
                let total = 0;
                for (let a = 0; a < Debug.FPS_Reel.length; a++) {
                    total += Debug.FPS_Reel[a];
                }
                Debug.Textes.push("FPS : " + Math.round(total / Debug.FPS_Reel.length))

                Debug.Textes.push("Camera X : " + Camera.X.toFixed(2))
                Debug.Textes.push("Camera Y : " + Camera.Y.toFixed(2))
                Debug.Textes.push("Camera O : " + Camera.Direction)
                Debug.Textes.push("Camera Z : " + Camera.Zoom.toFixed(2))
                Debug.Textes.push("Souris X : " + Souris.X.toFixed(2))
                Debug.Textes.push("Souris Y : " + Souris.Y.toFixed(2))
                Debug.Textes.push("Grid Siz : " + Math.floor(Debug.GridSize))
                this.#DessinInfo(Context, Debug.Textes)
                Debug.Textes = [];
            }
    
            if (Debug.Parametre.Cible)
            {
                this.#Cible(Context)
            }
    
            if (Debug.Parametre.Vecteur)
            {
                for (let v = 0; v < Debug.Vecteurs.length; v++) 
                {
                    Debug.#Vecteur(Context, Debug.Vecteurs[v]);
                }
                Debug.Vecteurs = []
            }

            if (Debug.Parametre.Rectangle)
            {
                for (let v = 0; v < Debug.Rectangles.length; v++) 
                {
                    Debug.#DessinRectangle(Context, Debug.Rectangles[v]);
                }
                Debug.Rectangles = []
            }
        }   
    }


    static #DeplaceCamera()
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

    /**
     * Ajoute un vecteur dans la liste de dessin
     * @param {Vecteur2} centre Point de départ du vecteur
     * @param {Vecteur2} direction Sens de déplacement relatif au centre
     */
    static AjoutVecteur(centre,direction)
    {
        Debug.Vecteurs.push(
            {
                x0: Camera.AdapteX(centre.X), 
                y0: Camera.AdapteY(centre.Y), 
                x1: Camera.AdapteX(centre.X + direction.X), 
                y1: Camera.AdapteY(centre.Y - direction.Y)
            })
    }

    /**
     * Dessin 
     * @param {context} Context Context de dessin
     * @param {Array} vec Informations sur le vecteur à tracé
     */
    static #Vecteur(Context, vec)
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
     * Dessine le rectangle voulu sur le canvas en prenant en compte la position de la camera
     * @param {context} Context Context de dessin
     * @param {Array} rect Rectangle à dessiner.
     */
    static #DessinRectangle(Context, rect)
    {
        Context.save();
        Camera.DeplacerCanvas(Context)

        Context.fillStyle = Color.Couleur(255,0,0,0.2)
        Context.fillRect(Camera.AdapteX(rect[0]), Camera.AdapteY(rect[1]), rect[2], rect[3])

        Context.restore();
    }


    /**
     * Créer une cible au centre de l'écran
     * @param {context} Context Context de dessin
     */
    static #Cible(Context)
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
    static #Grid(Context, Size)
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
    static #DessinInfo(Context,Texte)
    {
        Context.fillStyle = "white"
        Context.font = "12px Arial";
        if (Debug.InfoPosition == 0)
        {
            Context.textAlign = "start";
            for (let index = 0; index < Texte.length; index++) 
            {
                Context.fillText(Texte[index], 5, 17 + 13 * index)
            }
        }
        else if (Debug.InfoPosition == 1)
        {
            Context.textAlign = "end";
            for (let index = 0; index < Texte.length; index++) 
            {
                Context.fillText(Texte[index], Ecran_Largeur - 5, 17 + 13 * index)
            }
        }
        else if (Debug.InfoPosition == 2)
        {
            Context.textAlign = "start";
            for (let index = 0; index < Texte.length; index++) 
            {
                Context.fillText(Texte[index], 5, Ecran_Hauteur - 5 - 13 * (Texte.length - 1 - index))
            }
        }
        else if (Debug.InfoPosition == 3)
        {
            Context.textAlign = "end";
            for (let index = 0; index < Texte.length; index++) 
            {
                Context.fillText(Texte[index], Ecran_Largeur - 5, Ecran_Hauteur - 5 - 13 * (Texte.length - 1 - index))
            }
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

    /**
     * Ajoute un rectangle à tracé dans la liste des rectangles
     * @param {Array} rect Tableau avec X, Y, Largeur, Hauteur
     */
    static AjoutRectangle(rect)
    {
        Debug.Rectangles.push(rect);
    }
}