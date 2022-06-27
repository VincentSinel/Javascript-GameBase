/**
 * Lutin acceptant un spritesheet de RPG Maker comme texture au lieu d'une liste d'image
 * @class
 * @extends Lutin
 */
class Lutin_RPGMaker extends Lutin
{
    static AnimationSpeed = 6;
    static AnimationTimer = 0;
    #PersoActuel;
    #MaxCostume;
    #AnimationFrame;
    #DirectionVue;


    /**
     * Création d'un lutin manipulable avec des fonction simple
     * @constructor
     * @param {number} X Position X du lutin
     * @param {number} Y Position Y du lutin
     * @param {string} Texture Texture à utiliser;
     * @param {boolean} [Simple = true] Type de texture (true pour une seul perso, false pour 8 perso);
     * @param {int} [IdCostum = 0] ID perso de départ;
     * @param {int} [DirVue = 0] Direction du personnage (0 vers le bas; 1 gauche; 2 droite; 3 bas);
     */
    constructor(X,Y, Texture, Simple = true, IdCostum = 0, DirVue = 0)
    {
        super(X,Y,[Texture])
        this.#MaxCostume = Simple ? 1 : 8;

        this.PersoActuel = IdCostum;
        this.#AnimationFrame = 1;
        this.DirectionVue = DirVue;
    }

    //#region GETTER SETTER

    /**
     * Largeur de la texture du lutin
     * @override
     * @type {float}
     */
    get TextWidth()
    {
        if (this.MaxCostume === 1)
            return this.Image.width / 3;
        return this.Image.width / 12;
    }
    /**
     * Hauteur de la texture du lutin
     * @override
     * @type {float}
     */
    get TextHeight()
    {
        if (this.MaxCostume === 1)
            return this.Image.height / 4;
        return this.Image.height / 8;
    }
    /**
     * ID du perso actuel
     * @type {int}
     */
    get PersoActuel()
    {
        return this.#PersoActuel
    }
    set PersoActuel(v)
    {
        if (typeof(v) === "number")
        {
            this.#PersoActuel =  Math.max(Math.min(v, this.MaxCostume),0);
        }
        else
        {
            Debug.LogErreurType("PersoActuel", "number", v);
        }
    }
    /**
     * ID Maximum du costume
     * @type {int}
     */
    get MaxCostume()
    {
        return this.#MaxCostume
    }
    /**
     * Frame d'animation actuel
     * @type {int}
     */
    get AnimationFrame()
    {
        return this.#AnimationFrame
    }
    /**
     * Direction du personnage
     * @type {int}
     */
    get DirectionVue()
    {
        return this.#DirectionVue
    }
    set DirectionVue(v)
    {
        if (typeof(v) === "number")
        {
            if (v >= 0 && v <= 3)
            {
                this.#DirectionVue =  v;
            }
            else
            {
                Debug.Log("La direction de vue du personnage n'est pas correct. Une valeur entre 0 et 3 est attendue.", 1);
            }
        }
        else
        {
            Debug.LogErreurType("DirectionVue", "number", v);
        }
    }

    //#endregion

    /**
     * Passe l'animation à la frame suivante
     */
    FrameSuivante()
    {
        this.#AnimationFrame = Math.floor(Lutin_RPGMaker.AnimationTimer / Game.FPS * Lutin_RPGMaker.AnimationSpeed) % 4
    }
    /**
     * Passe l'animation sur la frame de pause
     */
    FrameIDLE()
    {
        this.#AnimationFrame = 1;
    }
    /**
     * Selectionne le costume suivant
     * @override
     */
    CostumeSuivant()
    {
        this.CostumeActuel = (this.CostumeActuel + 1) % this.MaxCostume
    }
    /**
     * Selectionne le costume précédent
     * @override
     */
    CostumePrecedent()
    {
        this.CostumeActuel = (this.CostumeActuel + this.MaxCostume - 1) % this.MaxCostume
    }
    /**
     * Selection le costume choisi
     * @override
     * @param {int} index Index du costume
     */
    BasculerCostume(index)
    {
        this.CostumeActuel = Math.round(index) % this.MaxCostume
    }
    /**
     * Effectue les calculs lié au lutin
     * @override
     * @param {float} Delta Frame depuis la précédente mise à jour
     */
    Calcul(Delta)
    {
        super.Calcul(Delta)
    }
    /**
     * Effecue le dessin du lutin
     * @override
     * @param {CanvasRenderingContext2D} Context Contexte de dessin
     */
    Dessin(Context)
    {
        let anim = this.AnimationFrame === 3 ? 1 : this.AnimationFrame;
        let x = ((this.PersoActuel % 4) * 3 + anim) * this.TextWidth;
        let y = (Math.floor(this.PersoActuel / 4) * 4 + this.DirectionVue) * this.TextHeight;
        // Dessine le lutin
        Context.drawImage(this.Image, x, y, this.TextWidth, this.TextHeight, 0, 0, this.TextWidth, this.TextHeight);
    }
}