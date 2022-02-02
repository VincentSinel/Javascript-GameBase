class Souris
{
    static X = 0;
    static Y = 0;
    //                   Droit Centre Gauche Arriere Avant
    static EtatBouton = [false, false, false, false, false];
    static JusteBas =   [false, false, false, false, false];
    static JusteHaut =  [false, false, false, false, false];

    static #SourisX = 0;
    static #SourisY = 0;

    /**
     * Renvoie si bouton de la souris est enfoncé
     * @param {*} index Numéro du bouton (0 droit; 1 centre; 2 gauche; 3 retour arrière; 4 retour avant)
     * @returns boolean (Vrai-Faux) indiquant si le bouton est cliqué
     */
    static BoutonClic(index)
    {
        return this.EtatBouton[index];
    }
    /**
     * Renvoie si bouton de la souris viens juste d'être enfoncé
     * @param {*} index Numéro du bouton (0 droit; 1 centre; 2 gauche; 3 retour arrière; 4 retour avant)
     * @returns boolean (Vrai-Faux) indiquant si le bouton est cliqué
     */
    static BoutonJustClic(index)
    {
        return this.JusteBas[index];
    }
    /**
     * Renvoie si bouton de la souris viens juste d'être relaché
     * @param {*} index Numéro du bouton (0 droit; 1 centre; 2 gauche; 3 retour arrière; 4 retour avant)
     * @returns boolean (Vrai-Faux) indiquant si le bouton a été relaché
     */
    static BoutonJustDeclic(index)
    {
        return this.JusteHaut[index];
    }


    static MouseDown(e)
    {
        this.EtatBouton[e.button] = true;
        this.JusteBas[e.button] = true;
    }
    static MouseUp(e)
    {
        this.EtatBouton[e.button] = false;
        this.JusteHaut[e.button] = true;
    }
    static MouseMove(e)
    {
        this.#SourisX = e.offsetX
        this.#SourisY = e.offsetY

        this.EtatBouton[0] = e.buttons % 2 == 1;
        this.EtatBouton[1] = e.buttons % 8 >= 4;
        this.EtatBouton[2] = e.buttons % 4 >= 2;
        this.EtatBouton[3] = e.buttons % 16 >= 8;
        this.EtatBouton[4] = e.buttons >= 16;
    }


    static Update()
    {
        let vec = new Vecteur2(this.#SourisX, this.#SourisY);
        let vec2 = Camera.EcranVersCamera(vec);
        this.X = vec2.X
        this.Y = vec2.Y
        this.JusteBas =  [false, false, false, false, false];
        this.JusteHaut = [false, false, false, false, false];
    }
}