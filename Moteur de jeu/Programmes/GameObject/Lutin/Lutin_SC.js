class Lutin_SC extends Lutin
{
    #Decoupage

    /**
     * Création d'un lutin manipulable avec des fonction simple
     * @param {number} X Position X du lutin
     * @param {number} Y Position Y du lutin
     * @param {string} Texture Texture à utiliser;
     * @param {Array<number>} Decoupage Hauteur et Largeur d'un Sprite;
     */
    constructor(X,Y, Texture, Decoupage, IdCostum = 0)
    {
        super(X,Y,[Texture])
        this.Decoupage = Decoupage;

        this.CostumeActuel = Math.max(Math.min(IdCostum, this.MaxCostume),0);
    }

    get TextWidth()
    {
        return this.Decoupage[0];
    }
    get TextHeight()
    {
        return this.Decoupage[1];
    }

    get Decoupage()
    {
        return this.#Decoupage;
    }
    set Decoupage(v)
    {
        this.#Decoupage = v;
        this.Recalcul();
    }

    Recalcul()
    {
        let w = this.Image.width / this.Decoupage[0]
        let h = this.Image.height / this.Decoupage[1]
        this.MaxCostume = w * h - 1;
    }

    /**
     * Calcul et renvoie un tableau contenant la position relative à la camera des angles de notre lutin avec le costume actuel.
     * @returns Liste des points définissant le rectangle de l'image
     */
     Rectangle()
     {
         let ar = [];
         let offw = this.Zoom / 100.0 * this.Decoupage[0] * this.CentreRotation.X;
         let offh = this.Zoom / 100.0 * this.Decoupage[1] * this.CentreRotation.Y;
         let cos = Math.cos(this.Direction * Math.PI / 180);
         let sin = Math.sin(this.Direction * Math.PI / 180);
         ar.push(new Vecteur2(this.X + (-offw * cos - offh * sin), this.Y + (-offw * sin + offh * cos)));
         ar.push(new Vecteur2(this.X + (+offw * cos - offh * sin), this.Y + (+offw * sin + offh * cos)));
         ar.push(new Vecteur2(this.X + (+offw * cos + offh * sin), this.Y + (+offw * sin - offh * cos)));
         ar.push(new Vecteur2(this.X + (-offw * cos + offh * sin), this.Y + (-offw * sin - offh * cos)));
         return ar;
     }

     RectangleWH()
    {
        let ar = [];
        let offw = this.Zoom / 100.0 * this.Decoupage[0] * this.CentreRotation.X;
        let offh = this.Zoom / 100.0 * this.Decoupage[1] * this.CentreRotation.Y;
        let cos = Math.cos(this.Direction * Math.PI / 180);
        let sin = Math.sin(this.Direction * Math.PI / 180);
        ar.push(new Vecteur2(this.X + (-offw * cos - offh * sin), this.Y + (-offw * sin + offh * cos)));
        ar.push(this.Decoupage[0] * this.Zoom / 100.0);
        ar.push(this.Decoupage[1] * this.Zoom / 100.0);
        ar.push(this.Direction);
        return ar;
    }


    CostumeSuivant()
    {
        this.CostumeActuel = (this.CostumeActuel + 1) % this.MaxCostume
    }

    CostumePrecedent()
    {
        this.CostumeActuel = (this.CostumeActuel + this.MaxCostume - 1) % this.MaxCostume
    }

    BasculerCostume(index)
    {
        this.CostumeActuel = Math.round(index) % this.MaxCostume
    }



    Calcul(Delta)
    {
        super.Calcul(Delta)
    }

    Dessin(Context)
    {
        let x = this.Decoupage[0] * (this.CostumeActuel % (super.TextWidth / this.Decoupage[0]));
        let y = this.Decoupage[1] * Math.floor(this.CostumeActuel / (super.TextWidth / this.Decoupage[0]));
        // Dessine le lutin
        Context.drawImage(this.Image, x, y, this.Decoupage[0], this.Decoupage[1], 0, 0, this.Decoupage[0], this.Decoupage[1]);
    }
}