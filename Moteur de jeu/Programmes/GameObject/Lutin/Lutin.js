/**
 * Un lutin est un objet interactif comprenant un systeme simple d'action équivalente à celle proposé sur scratch
 * @class
 * @extends Drawable
 */
 class Lutin extends Drawable
 {
    #Costumes = [];
    #Image;
    #Decoupage;
    #CostumeActuel
    #Bulle
    #Velocite

     /**
      * Création d'un lutin manipulable avec des fonction simple
      * @constructor
      * @param {number} X Position X du lutin
      * @param {number} Y Position Y du lutin
      * @param {Array<string>} Costumes Liste des costumes du lutin
      */
     constructor(X, Y, Costumes)
     {
         super(X,Y,0)
 
         this.#Costumes = [];
         this.#Image = new Image();
         if (Costumes)
         {
             for (let c = 0; c < Costumes.length; c++) {
                 this.#Costumes.push(Textures.Charger(Costumes[c]));
             }
             this.#Image = this.Costumes[0];
         }
         this.#Decoupage = [0,0,this.Image.width, this.Image.height];
         this.#CostumeActuel = 0;
 
         // Création de la bulle de dialogue
         this.#Bulle = this.AddChildren(new BulleDialogue("", 0,0))
 
         this.#Velocite = new Vector(0, 0, 0);
 
     }
 
     //#region GETTER SETTER

    /**
     * Liste des costumes
     * @type {Array<Image>}
     */
    get Costumes()
    {
        return this.#Costumes;
    }
    /**
     * Index du costume actuel
     * @type {int}
     */
    get CostumeActuel()
    {
        return this.#CostumeActuel;
    }
    set CostumeActuel(v)
    {
        if (typeof(v) === "number" && this.#Costumes.length > 0)
        {

            this.#CostumeActuel = Math.round(v) % this.Costumes.length
            this.#Image = this.Costumes[this.#CostumeActuel]
            this.Decoupage = [0,0,this.Image.width, this.Image.height];
        }
        else
        {
            Debug.LogErreurType("Fading", "Number", v)
        }
    }
    /**
     * Image actuel du lutin
     * @type {Image}
     */
    get Image()
    {
        return this.#Image
    }
    /**
     * Decoupage de l'image
     * @type {Array<int>}
     */
    get Decoupage()
    {
        return this.#Decoupage;
    }
    set Decoupage(v)
    {
        if (v instanceof Array)
        {
            this.#Decoupage = v
        }
        else
        {
            Debug.LogErreurType("Decoupage", "Array", v)
        }
    }
    /**
     * Bulle de dialogue
     * @type {BulleDialogue}
     */
    get Bulle()
    {
        return this.#Bulle;
    }
    /**
     * Vitesse assigné a ce lutin
     * @type {Vector}
     */
    get Velocite()
    {
        return this.#Velocite;
    }
    set Velocite(v)
    {
        if (v instanceof Vector)
        {
            this.#Velocite = v
        }
        else
        {
            Debug.LogErreurType("Velocite", "Vector", v)
        }
    }
    /**
     * Lutin en train de parler
     * @type {boolean}
     */
    get Parle()
    {
        return this.Bulle.Visible;
    }
    set Parle(v)
    {
        if (typeof(v) === "boolean")
        {
            this.Bulle.Visible = v;
        }
        else
        {
            Debug.LogErreurType("Parle", "boolean", v);
        }
    }
    /**
     * Largeur de la texture Image
     * @type {float}
     */
    get TextWidth()
    {
        return this.Decoupage[2];
    }
    /**
     * Hauteur de la texture Image
     * @type {float}
     */
    get TextHeight()
    {
        return this.Decoupage[3];
    }
 
     //#endregion
 
    /**
     * Permet de savoir si la souris touche l'objet actuel
     * @returns {boolean} vraie si la souris touche, faux sinon
     */
    ToucheSouris()
    {
        let a = this.Rectangle()
        return a.pointIn(new Vector(Souris.X, Souris.Y));
    }
    /**
     * Test si ce lutin en touche un autre
     * @param {Lutin} lutin Lutin à tester
     * @returns {boolean} vraie si collision, faux sinon
     */
    ToucheLutin(lutin)
    {
        let a = this.Rectangle()
        let b = lutin.Rectangle();
        return a.collide(b);
    }
    /**
     * Déplace le lutin suivant sa direction
     * @param {float} distance Distance à parcourir
     */
    Avancer(distance)
    {
        this.X += distance * Math.cos(this.RadDirection);
        this.Y += distance * Math.sin(this.RadDirection);
    }
    /**
     * Effectue une rotation d'un angle définit
     * @param {float} Angle Angle de rotation
     */
    Tourner(Angle)
    {
        this.Direction += Angle
    }
    /**
     * Déplace le lutin au coordonné choisie
     * @param {float} X Nouvelle position X
     * @param {float} Y Nouvelle position Y
     */
    AllerA(X,Y)
    {
        this.X = X;
        this.Y = Y;
    }
    /**
     * Créer et affiche une bulle de dialogue au dessus du lutin
     * @param {string} Texte Texte à afficher
     */
    Dire(Texte)
    {
        this.Bulle.Texte = Texte;
        this.Bulle.Visible = true;
        this.Bulle.Y = -this.TextHeight * this.CentreRotation.y * this.Zoom;
    }
    /**
     * Change la direction du lutin pour le tourner vers un point cible
     * @param {float} X position X du point cible
     * @param {float} Y position Y du point cible
     */
    OrienterVers(X,Y)
    {
        this.RadDirection = Math.atan2(Y - this.Y, X - this.X);
    }
    /**
     * Selectionne le costume suivant
     */
    CostumeSuivant()
    {
        this.CostumeActuel = (this.CostumeActuel + 1) % this.Costumes.length
        this.#Image = this.Costumes[this.CostumeActuel]
        this.Decoupage = [0,0,this.Image.width, this.Image.height];
    }
    /**
     * Selectionne le costume précédent
     */
    CostumePrecedent()
    {
        this.CostumeActuel = (this.CostumeActuel + this.Costumes.length - 1) % this.Costumes.length
        this.#Image = this.Costumes[this.CostumeActuel]
        this.Decoupage = [0,0,this.Image.width, this.Image.height];
    }
    //  /**
    //   * Selection le costume choisi
    //   * @param {int} index Index du costume
    //   */
    //  BasculerCostume(index)
    //  {
    //      this.CostumeActuel = Math.round(index) % this.Costumes.length
    //      this.Image = this.Costumes[this.CostumeActuel]
    //      this.Decoupage = [0,0,this.Image.width, this.Image.height];
    //  }
    /**
     * Effectue les calculs liés au lutin
     * @override
     * @param {float} Delta Frame depuis la précédente mise à jour
     */
    Calcul(Delta)
    {
        this.Position = this.Position.add(this.Velocite.time(Delta));
        this.Bulle.Y = -this.TextHeight * this.CentreRotation.y * this.Zoom;
    }
    /**
     * Effecue le dessin du lutin
     * @override
     * @param {CanvasRenderingContext2D} Context Contexte de dessin
     */
    Dessin(Context)
    {
        // Dessine le lutin
        if (this.#Image && this.Costumes.length > 0)
            Context.drawImage(this.#Image,
                this.Decoupage[0], 
                this.Decoupage[1], 
                this.Decoupage[2], 
                this.Decoupage[3], 
                0, 0,this.Decoupage[2], this.Decoupage[3]);
    }
 }