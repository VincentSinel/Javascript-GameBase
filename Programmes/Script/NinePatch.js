
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
        let x1 = this.X
        let w1 = this.Parametre[0]
        let x2 = x1 + w1
        let w3 = this.Parametre[1]
        let x3 = x1 + this.W - w3
        let w2 = this.W - w1 - w3

        let y1 = this.Y
        let h1 = this.Parametre[2]
        let y2 = y1 + h1
        let h3 = this.Parametre[3]
        let y3 = y1 + this.H - h3
        let h2 = this.H - h1 - h3

        let w = w1 + w3;
        let h = h1 + h3;

        // Coins
        Context.drawImage(this.Image, 0, 0, this.Parametre[0], this.Parametre[2],
            x1, y1, w1, h1);
        Context.drawImage(this.Image, this.Image.width - this.Parametre[1], 0, this.Parametre[1], this.Parametre[2],
            x3, y1, w3, h1);
        Context.drawImage(this.Image, 0, this.Image.height - this.Parametre[3], this.Parametre[0], this.Parametre[3],
            x1, y3, w1, h3);
        Context.drawImage(this.Image, this.Image.width - this.Parametre[1], this.Image.height - this.Parametre[3], this.Parametre[1], this.Parametre[3],
            x3, y3, w3, h3);
        
        // Bords
        Context.drawImage(this.Image, this.Parametre[0], 0, this.Image.width - w, this.Parametre[2],
            x2, y1, w2, h1);
        Context.drawImage(this.Image, this.Parametre[0], this.Image.height - this.Parametre[3], this.Image.width - w, this.Parametre[3],
            x2, y3, w2, h3);
        Context.drawImage(this.Image, 0, this.Parametre[2], this.Parametre[0], this.Image.height - h,
            x1, y2, w1, h2);
        Context.drawImage(this.Image, this.Image.width - this.Parametre[1], this.Parametre[2], this.Parametre[1], this.Image.height - h,
            x3, y2, w3, h2);
        
        // Centre
        Context.drawImage(this.Image, this.Parametre[0], this.Parametre[2], this.Image.width - w, this.Image.height - h,
            x2, y2, w2, h2);
    }




} 