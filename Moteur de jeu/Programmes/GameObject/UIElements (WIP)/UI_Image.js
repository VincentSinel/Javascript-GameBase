class UI_Image extends UIElement
{
    #SourceArray
    constructor(X,Y,Z,W,H, Source,Parent = undefined)
    {
        super(X,Y,Z,W,H,Parent)

        this.Image = Textures.Charger(Source);
        this.#SourceArray = [0,0,this.Image.width, this.Image.height];
        this.Padding = [0,0,0,0];
    }

    get SourceRect()
    {
        return this.#SourceArray
    }
    set SourceRect(v)
    {
        this.#SourceArray = v
        RefreshUI();
    }
    get SourceX()
    {
        return this.#SourceArray[0]
    }
    set SourceX(v)
    {
        this.#SourceArray[0] = v
        RefreshUI();
    }
    get SourceY()
    {
        return this.#SourceArray[1]
    }
    set SourceY(v)
    {
        this.#SourceArray[1] = v
        RefreshUI();
    }
    get SourceW()
    {
        return this.#SourceArray[2]
    }
    set SourceW(v)
    {
        this.#SourceArray[2] = v
        RefreshUI();
    }
    get SourceH()
    {
        return this.#SourceArray[3]
    }
    set SourceH(v)
    {
        this.#SourceArray[3] = v
        RefreshUI();
    }

    DessinBackUI(Context)
    {
        Context.drawImage(this.Image,
            this.SourceX,this.SourceY,this.SourceW,this.SourceH,
            0,0,this.W, this.H)
    }
}