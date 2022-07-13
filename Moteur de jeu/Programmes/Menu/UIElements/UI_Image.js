/**
 * Element Image d'un UI
 * @class
 * @extends UI_Element
 */
class UI_Image extends UI_Element
{
    #SourceArray
    #Angle
    #Scale

    /**
     * Créer un nouvelle UI_Element représentant une image
     * @constructor
     * @param {string} Source Source de l'image
     */
    constructor(Source = "System/Bulle", Param)
    {
        super(Param)

        this.Image = Textures.Charger(Source);
        this.#SourceArray = [0,0,this.Image.width, this.Image.height];

        this.#Scale = new Vector(1,1);

        this.Angle = 0;
    }

    //#region GETTER SETTER

    /**
     * Rectangle de découpe de la source
     * @type {int[]}
     */
    get SourceRect() { return this.#SourceArray }
    set SourceRect(v) { this.#SourceArray = v; this.Refresh(); }
    /**
     * Position X de la coupe dans la source
     * @type {int}
     */
    get SourceX() { return this.#SourceArray[0] }
    set SourceX(v) { this.#SourceArray[0] = v; this.Refresh(); }
    /**
     * Position Y de la coupe dans la source
     * @type {int}
     */
    get SourceY(){ return this.#SourceArray[1] }
    set SourceY(v) { this.#SourceArray[1] = v; this.Refresh(); }
    /**
     * Largeur de la coupe dans la source
     * @type {int}
     */
    get SourceW() { return this.#SourceArray[2] }
    set SourceW(v) { this.#SourceArray[2] = v; this.Refresh(); }
    /**
     * Hauteur de la coupe dans la source
     * @type {int}
     */
    get SourceH() { return this.#SourceArray[3] }
    set SourceH(v) { this.#SourceArray[3] = v; this.Refresh(); }
    /**
     * Angle de l'image en radian
     * @type {float}
     */
    get Angle() { return this.#Angle }
    set Angle(v) { this.#Angle = v; this.Refresh() }
    /**
     * L'echelle horizontal du dessin
     * @type {float}
     */
    get ScaleX() { return this.#Scale.x }
    set ScaleX(v) { this.#Scale.x = v; this.Refresh(); }
    /**
     * L'echelle vertical du dessin
     * @type {float}
     */
    get ScaleY() { return this.#Scale.y }
    set ScaleY(v) { this.#Scale.y = v; this.Refresh(); }

    //#endregion

    /**
     * Effectue le dessin de la couche arrière du UI_Element
     * @param {CanvasRenderingContext2D} Context Context de dessin
     */
    DessinBackUI(Context)
    {
        Context.save();
        Context.translate(Context.canvas.width / 2, Context.canvas.height/ 2);  
        Context.rotate(-this.Angle);
        Context.scale(this.#Scale.x, this.#Scale.y);
        Context.translate(- this.SourceW / 2, - this.SourceH / 2);  

        Context.drawImage(this.Image,
            this.SourceX,this.SourceY,this.SourceW,this.SourceH,
            0,0,this.SourceW, this.SourceH)

        Context.restore();
    }
}