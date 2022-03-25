class Tile_Auto extends Tile
{
    constructor(Texture, TailleTile, Type = "A2", Contact = false)
    {
        super(Texture, Contact, TailleTile)
        this.Voisin = true
        this.Type = Type;

        if (this.Type == "A2")
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
    }

    Calcul(Delta)
    {

    }

    Dessin(Context, X, Y, index = 0, voisin = 0)
    {
        let x, y, t = [];
        if (this.Type == "A2")
        {
            index = (index - this.OffSet)
            x = index % this.W * this.TailleTile * 2;
            y = Math.floor(index / this.W) * this.TailleTile * 3;

            t = this.CreerTileA124(voisin)
        }
        if (this.Type == "A3")
        {
            index = (index - this.OffSet)
            x = index % this.W * this.TailleTile * 2;
            y = Math.floor(index / this.W) * this.TailleTile * 2;

            t = this.CreerTileA34(voisin)
        }
        if (this.Type == "A4")
        {
            index = (index - this.OffSet)
            x = index % this.W * this.TailleTile * 2;
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