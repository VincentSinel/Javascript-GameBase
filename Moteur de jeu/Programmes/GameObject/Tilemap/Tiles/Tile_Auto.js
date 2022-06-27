/**
 * Tile auto type RPG Maker
 * @class
 * @extends Tile
 */
class Tile_Auto extends Tile
{
    static #Frame = 0;
    static Frame = 0;
    static #NextUpdate = 0;
    static Vitesse = 5;

    /**
     * Mets à jour l'animation des autotiles
     * @param {float} Delta Frame depuis la précédente mise à jour
     */
    static Calcul(Delta)
    {
        while(Tile_Auto.#NextUpdate < Game.TotalTime)
        {
            Tile_Auto.#Frame = (Tile_Auto.#Frame + 1) % 4;
            Tile_Auto.Frame = Tile_Auto.#Frame - Math.floor(Tile_Auto.#Frame / 3) * 2;
            Tile_Auto.#NextUpdate += 1 / Tile_Auto.Vitesse;
        }
    }

    /**
     * Créer un nouveau auto tile
     * @constructor
     * @param {string} Texture Nom du fichier image
     * @param {int} TailleTile Taille du tile
     * @param {string} Type Type d'auto tile selon RPG Maker (A1,A2,A3,A4,A5)
     */
    constructor(Texture, TailleTile, Type = "A2")
    {
        super(Texture, TailleTile)
        this.Voisin = true
        this.Type = Type;

        if (this.Type == "A1")
        {
            this.W = Math.floor(this.Image.width / (this.TailleTile * 8) * 2);
            this.Nombre = this.W * Math.floor(this.Image.height / (this.TailleTile * 3));
            this.Animation = true;
        }
        else if (this.Type == "A2")
        {
            this.W = Math.floor(this.Image.width / (this.TailleTile * 2));
            this.Nombre = this.W * Math.floor(this.Image.height / (this.TailleTile * 3));
        }
        else if (this.Type == "A3")
        {
            this.W = Math.floor(this.Image.width / (this.TailleTile * 2));
            this.Nombre = this.W * Math.floor(this.Image.height / (this.TailleTile * 2));
        }
        else if (this.Type == "A4")
        {
            this.W = Math.floor(this.Image.width / (this.TailleTile * 2));
            this.Nombre = this.W * Math.floor(this.Image.height / (this.TailleTile * 5) * 2);
        }
        else
        {
            this.W = Math.floor(this.Image.width / this.TailleTile);
            this.Nombre = this.W * Math.floor(this.Image.height / this.TailleTile);
        }
    }

    /**
     * Effectue le dessin du tile à un emplacement précis du context
     * @param {CanvasRenderingContext2D} Context Contexte de dessin
     * @param {float} X Position X du tile
     * @param {float} Y Position Y du tile
     * @param {int} [index = 0] index dans l'autotile
     * @param {int} [voisin = 0] Nombre binaire représentant la présence de voisin pour le calcul de l'autotile
     * @param {int} [forceframe = -1] Force le choix d'une frame d'animation précise
     */
    Dessin(Context, X, Y, index = 0, voisin = 0, forceframe = -1)
    {
        if (forceframe == -1)
            forceframe = Tile_Auto.Frame;
        let x, y, t = [];
        if (this.Type == "A1" || 
            this.Type == "A2" ||
            this.Type == "A3" ||
            this.Type == "A4")
        {
            if (this.Type == "A1")
            {
                index = (index - this.OffSet)
                x = (index % this.W) * this.TailleTile * 6 - Math.floor((index % this.W)  / 2) * this.TailleTile * 4;
                if (index % 2 == 0)
                {
                    x += forceframe * this.TailleTile * 2
                }
                y = Math.floor(index / this.W) * this.TailleTile * 3;

                if (index % 2 == 0 || (index == 1 && y == 0) || (index == 5 && y == this.TailleTile * 3))
                {
                    t = this.CreerTileA124(voisin)
                }
                else
                {
                    t = this.CreerTileA1(voisin, forceframe)
                }
            }
            else if (this.Type == "A2")
            {
                index = (index - this.OffSet)
                x = (index % this.W) * this.TailleTile * 2;
                y = Math.floor(index / this.W) * this.TailleTile * 3;

                t = this.CreerTileA124(voisin)
            }
            else if (this.Type == "A3")
            {
                index = (index - this.OffSet)
                x = (index % this.W) * this.TailleTile * 2;
                y = Math.floor(index / this.W) * this.TailleTile * 2;

                t = this.CreerTileA34(voisin)
            }
            else if (this.Type == "A4")
            {
                index = (index - this.OffSet)
                x = (index % this.W) * this.TailleTile * 2;
                let y1 = Math.floor(index / this.W);
                y = y1 * this.TailleTile * 2 + Math.floor((y1 + 1) / 2) * this.TailleTile;

                if (y1 % 2 == 1)
                    t = this.CreerTileA34(voisin)
                else
                    t = this.CreerTileA124(voisin)
            }
                    
            for(let i = 0; i < 4; i++)
            {
                let ox = this.TailleTile / 2 * (t[i] % 4);
                let oy = this.TailleTile / 2 * Math.floor(t[i] / 4);
                Context.drawImage(this.Image, 
                    x + ox, 
                    y + oy, 
                    this.TailleTile / 2, 
                    this.TailleTile / 2, 
                    X + this.TailleTile / 2 * (i % 2), 
                    Y + this.TailleTile / 2 * (1 - Math.floor(i / 2)), 
                    this.TailleTile / 2, this.TailleTile / 2);
            }
        }
        else
        {
            index = (index - this.OffSet)
            if (index >= this.Nombre / 2)
            {
                x = ((this.W / 2) + (index % (this.W / 2))) * this.TailleTile;
                y = Math.floor((index -  this.Nombre / 2) / (this.W / 2)) * this.TailleTile;
            }
            else
            {
                x = (index % (this.W / 2)) * this.TailleTile;
                y = Math.floor(index / (this.W / 2)) * this.TailleTile;
            }
            Context.drawImage(this.Image, 
                x, 
                y, 
                this.TailleTile, 
                this.TailleTile, 
                X, 
                Y, 
                this.TailleTile, this.TailleTile);
        }
    }
    /**
     * Récupère le tableau de découpage pour un tile type A1
     * @param {Array<int>} Voisin Voisin du tiles
     * @param {int} forceframe Frame à afficher
     * @returns {Array<int>} Tableau de découpage
     */
    CreerTileA1(Voisin, forceframe)
    {
        let ti = [];

        let d = (Voisin % 16) >= 8;
        let e = (Voisin % 32) >= 16;

        if (d)
            ti.push(6 + forceframe * 8)
        else
            ti.push(4 + forceframe * 8)

        if (e)
            ti.push(5 + forceframe * 8)
        else
            ti.push(7 + forceframe * 8)
            
        if (d)
            ti.push(2 + forceframe * 8)
        else
            ti.push(0 + forceframe * 8)

        if (e)
            ti.push(1 + forceframe * 8)
        else
            ti.push(3 + forceframe * 8)

        
        return ti; 
    }
    /**
     * Récupère le tableau de découpage pour un tile type A1 / A2 / A4
     * @param {Array<int>} Voisin Voisin du tiles
     * @returns {Array<int>} Tableau de découpage
     */
    CreerTileA124(Voisin)
    {
        let ti = [];

        let a = (Voisin % 2) == 1;
        let b = (Voisin % 4) >= 2;
        let c = (Voisin % 8) >= 4;
        let d = (Voisin % 16) >= 8;
        let e = (Voisin % 32) >= 16;
        let f = (Voisin % 64) >= 32;
        let g = (Voisin % 128) >= 64;
        let h = Voisin >= 128;

        if (a && b && d)
            ti.push(14)
        else if (b && !d)
            ti.push(12)
        else if (!b && d)
            ti.push(22)
        else if (!b && !d)
            ti.push(4)
        else if (!a && b && d)
            ti.push(6)

        if (c && b && e)
            ti.push(13)
        else if (b && !e)
            ti.push(15)
        else if (!b && e)
            ti.push(21)
        else if (!b && !e)
            ti.push(5)
        else if (!c && b && e)
            ti.push(7)
        
        if (f && d && g)
            ti.push(18)
        else if (d && !g)
            ti.push(10)
        else if (!d && g)
            ti.push(16)
        else if (!d && !g)
            ti.push(0)
        else if (!f && d && g)
            ti.push(2)

        if (h && e && g)
            ti.push(17)
        else if (e && !g)
            ti.push(9)
        else if (!e && g)
            ti.push(19)
        else if (!e && !g)
            ti.push(1)
        else if (!h && e && g)
            ti.push(3)

        return ti;
    }
    /**
     * Récupère le tableau de découpage pour un tile type A3 / A4
     * @param {Array<int>} Voisin Voisin du tiles
     * @returns {Array<int>} Tableau de découpage
     */
    CreerTileA34(Voisin)
    {
        let ti = [];

        let b = (Voisin % 4) >= 2;
        let d = (Voisin % 16) >= 8;
        let e = (Voisin % 32) >= 16;
        let g = (Voisin % 128) >= 64;

        if (b && d)
            ti.push(6)
        else if (b && !d)
            ti.push(4)
        else if (!b && d)
            ti.push(14)
        else if (!b && !d)
            ti.push(12)

        if (b && e)
            ti.push(5)
        else if (b && !e)
            ti.push(7)
        else if (!b && e)
            ti.push(13)
        else if (!b && !e)
            ti.push(15)
        
        if (d && g)
            ti.push(10)
        else if (d && !g)
            ti.push(2)
        else if (!d && g)
            ti.push(8)
        else if (!d && !g)
            ti.push(0)

        if (e && g)
            ti.push(9)
        else if (e && !g)
            ti.push(1)
        else if (!e && g)
            ti.push(11)
        else if (!e && !g)
            ti.push(3)

        return ti;
    }

}