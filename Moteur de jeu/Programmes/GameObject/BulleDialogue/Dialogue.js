class Dialogue
{
    #Pages

    constructor()
    {
        this.#Pages = [];
    }

    AddPage()
    {
        let p = new Page()
        this.#Pages.push(p);
        return p;
    }

    
}

class Page
{
    static #NextID = 0;

    #Element
    #ID = 0;

    constructor()
    {
        this.#ID = Page.#NextID;
        Page.#NextID += 1;
        this.#Element = [];
    }
}