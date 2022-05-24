
/**
 * Un NinePatch est un style de rectangle, défini par une texture divisé en 9 partie. 
 * Cela permet de créer un rectangle au proportion quelconque sans déformer la texture de base.
 * 
 * @see {@link https://medium.com/flobiz-blog/create-resizable-bitmaps-9-patch-files-48c774db4526}
 * 
 *             Largeur 1           Largeur 2
 *             <───────>│         │<───────>
 *  Hauteur  ↑ █████████│█████████│█████████
 *     1     ↓ █████████│█████████│█████████
 *             ─────────┼─────────┼─────────
 *             █████████│█████████│█████████
 *             █████████│█████████│█████████
 *             ─────────┼─────────┼─────────
 *  Hauteur  ↑ █████████│█████████│█████████
 *     2     ↓ █████████│█████████│█████████
 */
class NinePatch extends Drawable
{
    #TempCanvas
    /**
     * Création d'un NinePatch
     * @constructor
     * @param {string} Texture Texture du rectangle
     * @param {Array<number>} [Parametre = [0,0,0,0]] Parametre de découpage (voir explication dans le fichier source)
     */
    constructor(X,Y,Texture, Parametre = [0,0,0,0])
    {
        super(X,Y,0)

        this.Texture = Texture;
        this.Image = Textures.Charger(Texture);
        this.Parametre = Parametre;

        this.Reajuster(0,0);
    }

    /**
     * Canvas temporaire
     * @type {CanvasRenderingContext2D}
     */
    get TempCanvas()
    {
        return this.#TempCanvas;
    }

    /**
     * Permet de modifier la taille de la fenêtre (en prenant en compte la taille minimal)
     * @param {number} width Nouvelle largeur
     * @param {number} height Nouvelle hauteur
     */
    Reajuster(width,height)
    {
        this.W = Math.max(width, this.Parametre[0] + this.Parametre[1]);
        this.H = Math.max(height, this.Parametre[2] + this.Parametre[3]);
        this.ResizeDessin();
    }
    /**
     * Change la texture du 9 patch
     * @param {string} Texture Texture à appliquer
     */
    ChangeTexture(Texture)
    {
        this.Texture = Texture;
        this.Image = Textures.Charger(Texture);
    }
    /**
     * Redessine la boite lorsque les dimensions change
     */
    ResizeDessin()
    {
        this.#TempCanvas = document.createElement("canvas").getContext("2d");
        this.#TempCanvas.canvas.width = this.W; // Modification taille
        this.#TempCanvas.canvas.height = this.H; // Modification taille

        let w1 = this.Parametre[0];
        let x2 = w1;
        let w3 = this.Parametre[1];
        let x3 = this.W - w3;
        let w2 = this.W - w1 - w3;

        let h1 = this.Parametre[2];
        let y2 = h1;
        let h3 = this.Parametre[3];
        let y3 = this.H - h3;
        let h2 = this.H - h1 - h3;

        let w = w1 + w3;
        let h = h1 + h3;

        // Coins
        this.#TempCanvas.drawImage(this.Image, 0, 0, this.Parametre[0], this.Parametre[2],
            0, 0, w1, h1);
        this.#TempCanvas.drawImage(this.Image, this.Image.width - this.Parametre[1], 0, this.Parametre[1], this.Parametre[2],
            x3, 0, w3, h1);
        this.#TempCanvas.drawImage(this.Image, 0, this.Image.height - this.Parametre[3], this.Parametre[0], this.Parametre[3],
            0, y3, w1, h3);
        this.#TempCanvas.drawImage(this.Image, this.Image.width - this.Parametre[1], this.Image.height - this.Parametre[3], this.Parametre[1], this.Parametre[3],
            x3, y3, w3, h3);

        // Bords
        this.#TempCanvas.drawImage(this.Image, this.Parametre[0], 0, this.Image.width - w, this.Parametre[2],
            x2, 0, w2, h1);
        this.#TempCanvas.drawImage(this.Image, this.Parametre[0], this.Image.height - this.Parametre[3], this.Image.width - w, this.Parametre[3],
            x2, y3, w2, h3);
        this.#TempCanvas.drawImage(this.Image, 0, this.Parametre[2], this.Parametre[0], this.Image.height - h,
            0, y2, w1, h2);
        this.#TempCanvas.drawImage(this.Image, this.Image.width - this.Parametre[1], this.Parametre[2], this.Parametre[1], this.Image.height - h,
            x3, y2, w3, h2);

        // Centre
        this.#TempCanvas.drawImage(this.Image, this.Parametre[0], this.Parametre[2], this.Image.width - w, this.Image.height - h,
            x2, y2, w2, h2);
    }
    /**
     * Dessine la 9-Patch sur le context fournis
     * @param {CanvasRenderingContext2D} Context Context de dessin
     */
    Dessin(Context)
    {
        Context.drawImage(this.#TempCanvas.canvas, 0, 0);
    }

} 