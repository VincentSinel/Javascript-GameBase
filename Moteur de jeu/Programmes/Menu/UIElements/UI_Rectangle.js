/**
 * Element dessinant un Rectangle
 * @class
 * @extends UI_Element
 */
class UI_Rectangle extends UI_Element
{
    /**
     * Créer un nouvelle UI_Element représentant une image
     * @constructor
     */
    constructor(Param)
    {
        super(Param)
        this.Stroke = false;
        this.StrokeColor = this.BaseCouleur;
    }

    /**
     * Effectue le dessin de la couche arrière du UI_Element
     * @param {CanvasRenderingContext2D} Context Context de dessin
     */
    DessinBackUI(Context)
    {
        Context.fillStyle = this.CurrentColor.RGBA();
        Context.fillRect(0,0,Context.canvas.width, Context.canvas.height);
        if (this.Stroke)
        {
            Context.strokeStyle = this.StrokeColor.RGBA();
            Context.strokeRect(0,0,Context.canvas.width, Context.canvas.height);
        }
    }
}