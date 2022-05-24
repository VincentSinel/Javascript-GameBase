class UI_Grid extends UIElement
{
    constructor(X,Y,W,H,Parent = undefined)
    {
        super(X,Y,0,W,H,Parent)

        this.Lines = [];
        this.Colonnes = [];
    }

    AddLine(line)
    {
        this.Lines.push(line);
        this.RecalculateSize();
    }
    AddColonne(colonne)
    {
        this.Colonnes.push(colonne);
        this.RecalculateSize();
    }


    RecalculateSize()
    {
        let cn = 0;
        let dw = this.W;
        this.Colonnes.forEach(element => {
            if (element.Type == 0)
                dw -= element.Width;
            else
                cn += element.Width;
        });
        let ln = 0;
        let dh = this.H;
        this.Lines.forEach(element => {
            if (element.Type == 0)
                dh -= element.Height;
            else
                ln += element.Height;
        });
        cn = dw / cn;
        ln = dh / ln;

        this.Childrens.forEach(child => {
            let info = child.GridPosition;
            let x = 0;
            let w = 0;
            for (let c = 0; c < Math.min(this.Colonnes.length, info[0] + info[2]); c++) 
            {
                if (c < info[0])
                    x += this.Colonnes[c].Type == 0 ?  this.Colonnes[c].Height : this.Colonnes[c].Height * cn;
                else
                    w += this.Colonnes[c].Type == 0 ?  this.Colonnes[c].Height : this.Colonnes[c].Height * cn;
            }
            child.X = x;
            child.W = w;
            let y = 0;
            let h = 0;
            for (let c = 0; c < Math.min(this.Lines.length, info[1] + info[3]); c++) 
            {
                if (c < info[0])
                    y += this.Lines[c].Type == 0 ?  this.Lines[c].Width : this.Lines[c].Width * ln;
                else
                    h += this.Lines[c].Type == 0 ?  this.Lines[c].Width : this.Lines[c].Width * ln;
            }
            child.Y = y;
            child.H = h;
        });
    }


}

class UI_Grid_Line
{
    static Auto = new UI_Grid_Line(-1);

    static Star(H)
    {
        let  l = UI_Grid_Line(H);
        l.Type = 1
        return l;
    }

    constructor(H)
    {
        this.Type = 0
        this.Height = H;
    }
}

class UI_Grid_Colonne
{
    static Auto = new UI_Grid_Colonne(-1);

    static Star(W)
    {
        let  l = UI_Grid_Colonne(W);
        l.Type = 1
        return l;
    }

    constructor(W)
    {
        this.Type = 0
        this.Width = W;
    }
}