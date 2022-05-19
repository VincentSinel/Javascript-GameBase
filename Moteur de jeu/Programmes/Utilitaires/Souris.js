/**
 * Module de gestion de la souris. Les fonctions principales sont :
 * Souris.Position()
 * Souris.BoutonClic(index)
 * Souris.BoutonJustClic(index)
 * Souris.BoutonJustDeclic(index)
 * 
 * Variable :
 * Souris.X
 * Souris.X
 * Souris.Scroll
 */
class Souris
{
    static Position = new Vector(0,0);
    static CPosition = new Vector(0,0);
    static get X()
    {
        return Souris.Position.x
    }
    static set X(v)
    {
        Souris.Position.x = v
    }
    static get Y()
    {
        return Souris.Position.y
    }
    static set Y(v)
    {
        Souris.Position.y = v
    }
    static get CX()
    {
        return Souris.CPosition.x
    }
    static set CX(v)
    {
        Souris.CPosition.x = v
    }
    static get CY()
    {
        return Souris.CPosition.y
    }
    static set CY(v)
    {
        Souris.CPosition.y = v
    }

    static ClicDroit = 2;
    static ClicGauche = 0;
    static ClicCentrale = 1;
    static ClicAvant = 3;
    static ClicArriere = 4;


    //                   Droit Centre Gauche Arriere Avant
    static EtatBouton = [false, false, false, false, false];
    static JusteBas =   [false, false, false, false, false];
    static JusteHaut =  [false, false, false, false, false];

    static DragStart = [new Vector(0,0), new Vector(0,0), new Vector(0,0), new Vector(0,0), new Vector(0,0)]
    static Dragging =  [new Vector(0,0), new Vector(0,0), new Vector(0,0), new Vector(0,0), new Vector(0,0)]
    static DraggingEnd =   [new Vector(0,0), new Vector(0,0), new Vector(0,0), new Vector(0,0), new Vector(0,0)]
    static DragState = [0, 0, 0, 0, 0];
    static ScrollX = 0;
    static ScrollY = 0;
    
    static #ClicIsStart = false;

    /**
     * Renvoie si bouton de la souris est enfoncé
     * @param {*} index Numéro du bouton (0 gauche; 1 centre; 2 droite; 3 retour arrière; 4 retour avant)
     * @returns boolean (Vrai-Faux) indiquant si le bouton est cliqué
     */
    static BoutonClic(index)
    {
        return this.EtatBouton[index];
    }
    /**
     * Renvoie si bouton de la souris viens juste d'être enfoncé
     * @param {*} index Numéro du bouton (0 gauche; 1 centre; 2 droite; 3 retour arrière; 4 retour avant)
     * @returns boolean (Vrai-Faux) indiquant si le bouton est cliqué
     */
    static BoutonJustClic(index)
    {
        return this.JusteBas[index];
    }
    /**
     * Renvoie si bouton de la souris viens juste d'être relaché
     * @param {*} index Numéro du bouton (0 gauche; 1 centre; 2 droite; 3 retour arrière; 4 retour avant)
     * @returns boolean (Vrai-Faux) indiquant si le bouton a été relaché
     */
    static BoutonJustDeclic(index)
    {
        return this.JusteHaut[index];
    }

    static MouseDownHandle(e)
    {
        Souris.#ClicIsStart = true;
        Souris.preventDefault(e);
        Souris.MouseDown(e.button, e);
    }
    static MouseUpHandle(e)
    {
        if (Souris.#ClicIsStart)
        {
            Souris.preventDefault(e);
            Souris.MouseUp(e.button, e);
        }
        Souris.#ClicIsStart = false;
    }
    static MouseMoveHandle(e)
    {
        if (Souris.#ClicIsStart)
        {
            Souris.preventDefault(e);
            Souris.EtatBouton[0] = e.buttons % 2 == 1;
            Souris.EtatBouton[1] = e.buttons % 8 >= 4;
            Souris.EtatBouton[2] = e.buttons % 4 >= 2;
            Souris.EtatBouton[3] = e.buttons % 16 >= 8;
            Souris.EtatBouton[4] = e.buttons >= 16;
            
            Souris.MouseMove(e);
            
            for(let i = 0; i < 5; i++)
            {
                if (Souris.EtatBouton[i])
                {
                    UIElement.SHandle_Basse(i, Souris.CPosition);
                }
            }
        }
        else
        {
            Souris.CX = e.offsetX / canvas.width * Ecran_Largeur * dpi
            Souris.CY = e.offsetY / canvas.height * Ecran_Hauteur * dpi

            UIElement.SHandle_MouseMove(Souris.CPosition)
        }
    }

    // Fonction lié au événements
    static MouseDown(id, e)
    {
        Souris.EtatBouton[id] = true;
        if (Souris.DragState[id] == 0)
            Souris.JusteBas[id] = true;
        Souris.DragState[id] = 1;
        UIElement.SHandle_Basse(id, Souris.CPosition);
    }
    static MouseUp(id, e)
    {
        Souris.EtatBouton[id] = false;
        Souris.JusteHaut[id] = true;
        UIElement.SHandle_Relache(id,Souris.CPosition);
        if (Souris.DragState[id] == 1)
        {
            UIElement.SHandle_Clique(id, Souris.CPosition)
        }
        else
        {
            Souris.DragEnd(e, id);
        }
    }
    static MouseMove(e)
    {
        for (let i = 0; i < 5; i++) 
        {
            if (Souris.DragState[i] == 1 && Souris.EtatBouton[i])
            {
                // First move, launch drag
                Souris.DragStr(e, i)
            }
        }

        Souris.CX = e.offsetX / canvas.width * Ecran_Largeur * dpi
        Souris.CY = e.offsetY / canvas.height * Ecran_Hauteur * dpi

        for (let i = 0; i < 5; i++) 
        {
            if (Souris.DragState[i] == 2 && Souris.EtatBouton[i])
            {
                // Moving, drag continue
                Souris.Draging(e, i)
            }
        }

        UIElement.SHandle_MouseMove(Souris.CPosition)
    }
    static DragStr(e, i)
    {
        
        UIElement.SHandle_DragStart(i, Souris.CPosition);

        Souris.DragStart[i] = Souris.CPosition;
        Souris.DragState[i] = 2;
    }
    static DragEnd(e, i)
    {
        if(Souris.DragState[e.button] > 1)
        {
            Souris.DraggingEnd[i] = Souris.CPosition;
            UIElement.SHandle_DragEnd(i, Souris.CPosition);
        }
        Souris.DragState[e.button] = 0;
    }
    static Draging(e, i)
    {
        Souris.Dragging[i] = Souris.CPosition;
        UIElement.SHandle_Dragging(i, Souris.CPosition);
    }


    static MouseScroll(e)
    {
        Souris.ScrollX = Math.max(-1, Math.min(1, e.deltaX));
        Souris.ScrollY = Math.max(-1, Math.min(1, e.deltaY));
        UIElement.SHandle_Scroll(Souris.CPosition, Souris.ScrollX, Souris.ScrollY);
    }

    
    // Mise a jour de la position de la souris et des clics.
    static Update()
    {
        let vec = new Vector(this.CX, this.CY);
        let vec2 = Camera.EcranVersCamera(vec);
        Souris.X = vec2.x
        Souris.Y = vec2.y
        Souris.JusteBas =  [false, false, false, false, false];
        Souris.JusteHaut = [false, false, false, false, false];
        Souris.ScrollX = 0;
        Souris.ScrollY = 0;
    }
    
    static preventDefault(e) {
        e.preventDefault();
        e.stopPropagation();
    }
}