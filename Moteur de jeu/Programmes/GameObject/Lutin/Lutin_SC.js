/**
 * Lutin acceptant un spritesheet comme texture au lieu d'une liste d'image
 * @class
 * @extends Lutin
 */
 class Lutin_SC extends Lutin
 {
    #MaxCostume
 
    /**
     * Création d'un lutin manipulable avec des fonction simple
     * @constructor
     * @param {number} X Position X du lutin
     * @param {number} Y Position Y du lutin
     * @param {string} Texture Texture à utiliser;
     * @param {Array<number>} Decoupage Hauteur et Largeur d'un Sprite;
     */
    constructor(X,Y, Texture, Decoupage, IdCostum = 0)
    {
        super(X,Y,[Texture])
        this.Decoupage = Decoupage;

        this.Recalcul();
        this.CostumeActuel = Math.max(Math.min(IdCostum, this.MaxCostume),0);
    }
 
    //#region GETTER SETTER

    get MaxCostume()
    {
        return this.#MaxCostume;
    }
    /**
     * Largeur de la texture du lutin
     * @override
     * @type {float}
     */
    get TextWidth()
    {
        return this.Decoupage[0];
    }
    /**
     * Hauteur de la texture du lutin
     * @override
     * @type {float}
     */
    get TextHeight()
    {
        return this.Decoupage[1];
    }
     /**
      * Tableau de découpage de la texture
      * @type {Array<number>}
      */
    //  get Decoupage()
    //  {
    //     return this.#Decoupage;
    //  }
    //  set Decoupage(v)
    //  {
    //     this.#Decoupage = v;
    //     this.Recalcul();
    //  }

 
    //#endregion

    /**
     * Recalcul les paramètres du lutin lorsque la taille de découpage change
     */
    Recalcul()
    {
        let w = this.Image.width / this.TextWidth
        let h = this.Image.height / this.TextHeight
        this.#MaxCostume = w * h - 1;
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
        let x = this.Decoupage[0] * (this.CostumeActuel % (this.Image.width / this.Decoupage[0]));
        let y = this.Decoupage[1] * (Math.floor(this.CostumeActuel / (this.Image.width / this.Decoupage[0])) % (this.Image.height / this.Decoupage[1]));
        // Dessine le lutin
        Context.drawImage(this.Image, x, y, this.Decoupage[0], this.Decoupage[1], 0, 0, this.Decoupage[0], this.Decoupage[1]);
    }
 }
 