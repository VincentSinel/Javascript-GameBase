class Dialogue
{
    #Pages

    constructor()
    {
        this.#Pages = [];
    }

    AddPage()
    {
        let p = new Dialogue_Page()
        this.#Pages.push(p);
        return p;
    }

    
}

class Dialogue_Page
{
    #Element

    constructor()
    {
        Page.#NextID += 1;
        this.#Element = [];
    }
}

class Dialogue_PageElement
{
    static CalculCtx = document.createElement("canvas").getContext("2d"); 

    constructor(type)
    {
        this.Type = type;
    }

    get Width()
    {
        return 0;
    }
    get Height()
    {
        return 0;
    }
    get CanCut()
    {
        return true;
    }
}

class Dialogue_Texte extends Dialogue_PageElement
{
    constructor(texte)
    {
        super();
        this.Texte = texte;
        this.CalculCtx.font = this.FontSize + "px " + this.Font;
    }

    get Width()
    {
        return this.CalculCtx.measureText(this.Texte).width;
    }
    get Height()
    {
        return this.CalculCtx.measureText(this.Texte).height;
    }

}