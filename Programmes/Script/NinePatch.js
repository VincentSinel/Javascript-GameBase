
/**
 * Un NinePatch est un style de rectangle, défini par une texture divisé en 9 partie. 
 * Cela permet de créer un rectangle au proportion quelconque sans déformer la texture de base.
 * 
 *              Largeur 1           Largeur 2
 *              <------->           <------->
 *  Hauteur  ↑ █████████│█████████│█████████
 *     1     ↓ █████████│█████████│█████████
 *             ─────────┼─────────┼─────────
 *             █████████│█████████│█████████
 *             █████████│█████████│█████████
 *             ─────────┼─────────┼─────────
 *  Hauteur  ↑ █████████│█████████│█████████
 *     2     ↓ █████████│█████████│█████████
 */
class NinePatch
{
    /**
     * Création d'un NinePatch
     * @param {string} Texture Texture du rectangle
     * @param {Array<number>} Parametre Parametre de découpage (voir explication dans le fichier source)
     */
    constructor(Texture, Parametre = [0,0,0,0])
    {
        this.Image = new Image();
        this.Image.src = Texture;
        this.Parametre = Parametre

        this.X = 0;
        this.Y = 0;
        this.Reajuster(0,0)
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
    }


    
    Dessin(Context)
    {
        let w = this.Parametre[0] + this.Parametre[1];
        let h = this.Parametre[2] + this.Parametre[3];

        // Coins
        Context.drawImage(this.Image, 0, 0, this.Parametre[0], this.Parametre[2],
            this.X, this.Y, this.Parametre[0], this.Parametre[2]);
        Context.drawImage(this.Image, this.Image.width - this.Parametre[1], 0, this.Parametre[1], this.Parametre[2],
            this.X + this.W - this.Parametre[1], this.Y, this.Parametre[1], this.Parametre[2]);
        Context.drawImage(this.Image, 0, this.Image.height - this.Parametre[3], this.Parametre[0], this.Parametre[3],
            this.X, this.Y + this.H - this.Parametre[3], this.Parametre[0], this.Parametre[3]);
        Context.drawImage(this.Image, this.Image.width - this.Parametre[1], this.Image.height - this.Parametre[3], this.Parametre[1], this.Parametre[3],
            this.X + this.W - this.Parametre[1], this.Y + this.H - this.Parametre[3], this.Parametre[1], this.Parametre[3]);
        
        // Bords
        Context.drawImage(this.Image, this.Parametre[0], 0, this.Image.width - w, this.Parametre[2],
            this.X + this.Parametre[0], this.Y, this.W - w, this.Parametre[2]);
        Context.drawImage(this.Image, this.Parametre[0], this.Image.height - this.Parametre[3], this.Image.width - w, this.Parametre[3],
            this.X + this.Parametre[0], this.Y + this.H - this.Parametre[3], this.W - w, this.Parametre[3]);
        Context.drawImage(this.Image, 0, this.Parametre[2], this.Parametre[0], this.Image.height - h,
            this.X, this.Y + this.Parametre[2], this.Parametre[0], this.H - h);
        Context.drawImage(this.Image, this.Image.width - this.Parametre[1], this.Parametre[2], this.Parametre[1], this.Image.height - h,
            this.X + this.W - this.Parametre[1], this.Y + this.Parametre[2], this.Parametre[1], this.H - h);
        
        // Centre
        Context.drawImage(this.Image, this.Parametre[0], this.Parametre[2], this.Image.width - w, this.Image.height - h,
            this.X + this.Parametre[0], this.Y + this.Parametre[2], this.W - w, this.H - h);
    }




} 