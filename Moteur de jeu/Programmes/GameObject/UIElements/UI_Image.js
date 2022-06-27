/**
 * Element Image d'un UI
 * @class
 * @extends UIElement
 */
class UI_Image extends UIElement
{
    #SourceArray
    #Angle
    #Scale

    /**
     * Créer un nouvelle UIElement représentant une image
     * @constructor
     * @param {string} Source Source de l'image
     * @param {float} X Position X
     * @param {float} Y Position Y
     * @param {float} Z Position Z
     * @param {UIElement} Parent Parent de cet élément
     */
    constructor(Source, X, Y, Z, Parent = undefined)
    {
        super(X,Y,Z,0,0,Parent)

        this.Image = Textures.Charger(Source);
        this.#SourceArray = [0,0,this.Image.width, this.Image.height];

        this.#Scale = new Vector(1,1);

        let diag = Math.sqrt(this.Image.width * this.Image.width + this.Image.height * this.Image.height) * 2
        this.W = diag;
        this.H = diag;

        this.Padding = [0,0,0,0];
        this.Angle = 0;
        this.CentreRotation = new Vector(0,0);
        this.RefreshUI()
    }

    //#region GETTER SETTER

    /**
     * Rectangle de découpe de la source
     * @type {int[]}
     */
    get SourceRect()
    {
        return this.#SourceArray
    }
    set SourceRect(v)
    {
        this.#SourceArray = v
        let diag = Math.sqrt(v[2] * v[2] + v[2] * v[2]) * 2;
        this.W = diag;
        this.H = diag;
        this.RefreshUI();
    }
    /**
     * Position X de la coupe dans la source
     * @type {int}
     */
    get SourceX()
    {
        return this.#SourceArray[0]
    }
    set SourceX(v)
    {
        this.#SourceArray[0] = v
        this.RefreshUI();
    }
    /**
     * Position Y de la coupe dans la source
     * @type {int}
     */
    get SourceY()
    {
        return this.#SourceArray[1]
    }
    set SourceY(v)
    {
        this.#SourceArray[1] = v
        this.RefreshUI();
    }
    /**
     * Largeur de la coupe dans la source
     * @type {int}
     */
    get SourceW()
    {
        return this.#SourceArray[2]
    }
    set SourceW(v)
    {
        this.#SourceArray[2] = v
        this.RefreshUI();
    }
    /**
     * Hauteur de la coupe dans la source
     * @type {int}
     */
    get SourceH()
    {
        return this.#SourceArray[3]
    }
    set SourceH(v)
    {
        this.#SourceArray[3] = v
        this.RefreshUI();
    }
    /**
     * Angle de l'image en radian
     * @type {float}
     */
    get Angle()
    {
        return this.#Angle
    }
    set Angle(v)
    {
        this.#Angle = v;
        this.RefreshUI()
    }
    /**
     * L'echelle horizontal du dessin
     * @type {float}
     */
    get ScaleX()
    {
        return this.#Scale.x
    }
    set ScaleX(v)
    {
        this.#Scale.x = v;

        let diag = Math.sqrt(this.SourceW * this.SourceW + this.SourceH * this.SourceH) * 2 * Math.max(this.#Scale.x, this.#Scale.y);
        this.W = diag;
        this.H = diag;
        this.RefreshUI()
    }
    /**
     * L'echelle vertical du dessin
     * @type {float}
     */
    get ScaleY()
    {
        return this.#Scale.y
    }
    set ScaleY(v)
    {
        this.#Scale.y = v;

        let diag = Math.sqrt(this.SourceW * this.SourceW + this.SourceH * this.SourceH) * 2 * Math.max(this.#Scale.x, this.#Scale.y);
        this.W = diag;
        this.H = diag;
        this.RefreshUI();
    }

    //#endregion


    /**
     * Calcul le rectangle contenant l'objet actuel
     * @override
     * @returns {Rectangle} Rectangle contenant l'objet actuel
     */
     BoundingBox()
     {
         return Rectangle.FromPosition(this.X, this.Y,this.SourceW,this.SourceH);
     }

    /**
     * Lance une regénération du canvas de dessin
     * @override
     */
    RefreshUI()
    {
        this.DrawOffSetX = -this.W / 2;
        this.DrawOffSetY = -this.H / 2;
        super.RefreshUI();
    }
    /**
     * Effectue le dessin de la couche arrière du UIElement
     * @param {CanvasRenderingContext2D} Context Context de dessin
     */
    DessinBackUI(Context)
    {
        Context.save();
        Context.translate(this.W / 2, this.H / 2);  
        Context.rotate(-this.Angle);
        Context.scale(this.#Scale.x, this.#Scale.y);
        Context.translate(- this.SourceW * this.CentreRotation.x, - this.SourceH * this.CentreRotation.y);  

        Context.drawImage(this.Image,
            this.SourceX,this.SourceY,this.SourceW,this.SourceH,
            0,0,this.SourceW, this.SourceH)

        Context.restore();
    }
}