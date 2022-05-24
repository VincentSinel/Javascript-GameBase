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
    static Rectangles = []
    static Circles = []
    static Polygones = []

    static Parametre = {
        Grille: false, 
        Info: true, 
        Cible: false, 
        Vecteur: true, 
        Camera: true, 
        Shape: true,
        TimeMesure: true,}
    static #TimeMesures = [];
    static #TimeMesureMax = 200;
    static #StartTime = 0;
    static #TimeMesureVMax = 0;
    static #TimeMesureVMin = 0;
    static InfoPosition = 3; // Position des info de débuggage (0 haut gauche / 1 haut droit / 2 bas gauche / 3 bas droit)
    static UPDATE(Context, etape, Delta)
    {
        if (etape == "PreCalcul")
        {
            if (Debug.Parametre.Camera)
            {
                Debug.#DeplaceCamera(Delta)
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

            if (Debug.Parametre.Shape)
            {
                for (let v = 0; v < Debug.Rectangles.length; v++) 
                {
                    Debug.#DessinRectangle(Context, Debug.Rectangles[v]);
                }
                Debug.Rectangles = []
                for (let v = 0; v < Debug.Circles.length; v++) 
                {
                    Debug.#DessinCercle(Context, Debug.Circles[v]);
                }
                Debug.Circles = []
                for (let v = 0; v < Debug.Polygones.length; v++) 
                {
                    Debug.#DessinPolygone(Context, Debug.Polygones[v]);
                }
                Debug.Polygones = []
            }
    
            if (Debug.Parametre.Vecteur)
            {
                for (let v = 0; v < Debug.Vecteurs.length; v++) 
                {
                    Debug.#Vecteur(Context, Debug.Vecteurs[v]);
                }
                Debug.Vecteurs = []
            }
    
            if (Debug.Parametre.Cible)
            {
                this.#Cible(Context)
            }


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
                Debug.Textes.push("Camera O : " + Camera.Direction.toFixed(2))
                Debug.Textes.push("Camera Z : " + Camera.Zoom.toFixed(2))
                Debug.Textes.push("Souris X : " + Souris.X.toFixed(2))
                Debug.Textes.push("Souris Y : " + Souris.Y.toFixed(2))
                Debug.Textes.push("Grid Siz : " + Math.floor(Debug.GridSize))
                this.#DessinInfo(Context, Debug.Textes)
            }

            if (Debug.Parametre.TimeMesure)
            {
                Debug.#DrawTimeMesure(Context);
            }


            Debug.Textes = [];
        }   
    }


    static StartMesure()
    {
        Debug.#StartTime = Date.now();
    }

    static EndMesure()
    {
        let delta = Date.now() -Debug.#StartTime;
        if (Debug.#TimeMesures.length == Debug.#TimeMesureMax)
        {
            Debug.#TimeMesures.shift();
        }
        Debug.#TimeMesures.push(delta);
    }

    static #DrawTimeMesure(Context)
    {
        if (Debug.#TimeMesures.length < 2)
            return;
        let total = 0;
        let min = 0;
        let max = Debug.#TimeMesures[0];
        for (let a = 0; a < Debug.#TimeMesures.length; a++) {
            let v = Debug.#TimeMesures[a]
            total += v;
            min = Math.min(v, min);
            max = Math.max(v, max);
        }
        total = (total / Debug.#TimeMesures.length).toFixed(2);
        min -= (max - min) * 0.1;
        max += (max - min) * 0.1;

        Debug.#TimeMesureVMax += (max - Debug.#TimeMesureVMax) * 0.01;
        Debug.#TimeMesureVMin += (min - Debug.#TimeMesureVMin) * 0.01;

        let w = 120;
        let h = 30;
        let y = 0;
        let x = 0;

        Context.fillStyle = "white"
        Context.font = "12px Arial";
        Context.textAlign = "start";
        if (Debug.InfoPosition % 2 == 0)
            x = 5;
        else
        {
            x = Ecran_Largeur - 5;
            Context.textAlign = "end";
        }

        if (Debug.InfoPosition > 1)
            y = Ecran_Hauteur - 6 - 13 * (Debug.Textes.length) - h;
        else
            y = 15 + 13 * (Debug.Textes.length + 1);

        Context.fillText(total, x, y);

        if (Debug.InfoPosition % 2 == 1)
            x -= w;

        let imageCtx = document.createElement("canvas").getContext("2d"); // Création d'un canvas temporaire
        imageCtx.canvas.width = w; // Modification taille
        imageCtx.canvas.height = h; // Modification taille


        imageCtx.fillStyle = "black"
        imageCtx.fillRect(0,0,w,h);
        imageCtx.fillStyle = Color.Couleur(0,255,0,0.2);
        imageCtx.strokeStyle = Color.Couleur(0,255,0,1);
        
        let value = Debug.#TimeMesures[0];
        let ox = 0
        let oy = h * (1 - (value - Debug.#TimeMesureVMin) / (Debug.#TimeMesureVMax - Debug.#TimeMesureVMin))
        imageCtx.beginPath();
        imageCtx.moveTo(ox, oy);
        for (let p = 0; p < Debug.#TimeMesures.length; p++) {
            value = Debug.#TimeMesures[p];
            ox = p * w / (Debug.#TimeMesures.length - 1)
            oy = h * (1 - (value - Debug.#TimeMesureVMin) / (Debug.#TimeMesureVMax - Debug.#TimeMesureVMin))
            imageCtx.lineTo(ox, oy);
        }
        imageCtx.stroke();
        imageCtx.lineTo(w, h);
        imageCtx.lineTo(0, h);
        imageCtx.fill();

        Context.drawImage(imageCtx.canvas, x, y);


    }




    static #DeplaceCamera(Delta)
    {
        if (Clavier.ToucheBasse("j"))
        {
            Camera.Direction += Delta
        }
        if (Clavier.ToucheBasse("l"))
        {
            Camera.Direction -= Delta
        }
        if (Clavier.ToucheBasse("i"))
        {
            Camera.Zoom += Delta * 0.03 * Camera.Zoom
        }
        if (Clavier.ToucheBasse("k"))
        {
            Camera.Zoom -= Delta * 0.03 * Camera.Zoom
            //Camera.Zoom = Math.max(Camera.Zoom, 0)
        }

        let direction = Matrix.fromrotation(-Camera.RadDirection);
        let vec = Vector.Zero;
        if (Clavier.ToucheBasse("q"))
        {
            vec.x -= 1;
        }
        if (Clavier.ToucheBasse("z"))
        {
            vec.y -= 1;
        }
        if (Clavier.ToucheBasse("d"))
        {
            vec.x += 1;
        }
        if (Clavier.ToucheBasse("s"))
        {
            vec.y += 1;
        }
        let dir = direction.time(vec.normalize(Delta * 3 / Camera.Zoom));
        Camera.X += dir.x;
        Camera.Y += dir.y;


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
     * Dessin 
     * @param {context} Context Context de dessin
     * @param {Array} vec Informations sur le vecteur à tracé
     */
    static #Vecteur(Context, vec)
    {
        Context.save();
        Camera.DeplacerCanvas(Context)

        Context.strokeStyle = vec.color;
        Context.lineWidth = 2/Camera.Zoom;

        Context.beginPath();
        Context.moveTo(vec.p1.x, vec.p1.y);
        Context.lineTo(vec.p2.x, vec.p2.y);
        Context.stroke();

        Context.strokeRect(vec.p2.x - 1, vec.p2.y - 1, 2, 2)

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

        
        // Translate le canvas au centre de notre lutin 
        Context.translate(rect[0].x, rect[0].y); 
        // Tourne le canvas de l'angle souhaité
        Context.rotate(rect[0].theta); 

        Context.fillStyle = rect[1];
        Context.fillRect(0, 0, rect[0].w, rect[0].h)

        Context.restore();
    }

    /**
     * Dessine le cercle voulu sur le canvas en prenant en compte la position de la camera
     * @param {context} Context Context de dessin
     * @param {Array} circle Cercle à dessiner.
     */
    static #DessinCercle(Context, circle)
    {
        Context.save();
        Camera.DeplacerCanvas(Context)

        
        // Translate le canvas au centre de notre lutin 
        Context.translate(circle[0].x, circle[0].y); 

        Context.fillStyle = circle[1];
        Context.beginPath();
        Context.arc(0, 0, circle[0].radius, 0, 2 * Math.PI);
        Context.fill();

        Context.restore();
    }

    /**
     * Dessine le polygone voulu sur le canvas en prenant en compte la position de la camera
     * @param {context} Context Context de dessin
     * @param {Array} poly Polygone à dessiner.
     */
    static #DessinPolygone(Context, poly)
    {
        Context.save();
        Camera.DeplacerCanvas(Context)

        let x = poly[0].x;
        let y = poly[0].y;
        let vertices = poly[0].getTransformedVerts();
        // Translate le canvas au centre de notre lutin 
        Context.translate(x, y);

        Context.fillStyle = poly[1];
        Context.beginPath();
        Context.moveTo(vertices[0].x, vertices[0].y)
        for (let v = 1; v < vertices.length; v++) {
            Context.lineTo(vertices[v].x, vertices[v].y)
        }
        Context.lineTo(vertices[0].x, vertices[0].y)
        Context.fill();

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
        // Déplace la camera a son centre
        Context.translate(Camera.X, Camera.Y);

        let maxsize = Math.sqrt(Ecran_Largeur * Ecran_Largeur + Ecran_Hauteur * Ecran_Hauteur) / (Camera.Zoom)
        let BorderX = Camera.AdapteX(maxsize / 2);
        let BorderY = Camera.AdapteY(maxsize / 2);
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
                Context.fillText(Texte[index], 5, 15 + 13 * index)
            }
        }
        else if (Debug.InfoPosition == 1)
        {
            Context.textAlign = "end";
            for (let index = 0; index < Texte.length; index++) 
            {
                Context.fillText(Texte[index], Ecran_Largeur - 5, 15 + 13 * index)
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
     * @param {Rectangle} rect Tableau avec X, Y, Largeur, Hauteur (, Couleur) 
     */
    static AjoutCercle(circle, color = "#FF000033")
    {
        Debug.Circles.push([circle, color]);
    }
    /**
     * Ajoute un rectangle à tracé dans la liste des rectangles
     * @param {Polygon} rect Tableau avec X, Y, Largeur, Hauteur (, Couleur) 
     */
    static AjoutPolygone(polygon, color = "#FF000033")
    {
        Debug.Polygones.push([polygon, color]);
    }
    /**
     * Ajoute un rectangle à tracé dans la liste des rectangles
     * @param {Rectangle} rect Tableau avec X, Y, Largeur, Hauteur (, Couleur) 
     */
    static AjoutRectangle(rect, color = "#FF000033")
    {
        Debug.Rectangles.push([rect, color]);
    }

    /**
     * Ajoute un vecteur dans la liste de dessin
     * @param {Vector} centre Point de départ du vecteur
     * @param {Vector} direction Sens de déplacement relatif au centre
     * @param {string} color Couleur du vecteur
     */
     static AjoutVecteur(centre,direction, color = "green")
     {
         Debug.Vecteurs.push(
             {
                 p1: centre, 
                 p2: centre.add(direction),
                 color: color
             })
     }
}