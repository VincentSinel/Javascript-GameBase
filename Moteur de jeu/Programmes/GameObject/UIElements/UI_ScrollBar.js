class UI_VerticalScrollBar extends UIElement
{
    static ScrollW = 15;

    #dragstart;
    #ScrollOldPosition;
    #ScrollPosition;

    constructor(X,Y,H,Parent)
    {
        super(X,Y,100000000,UI_VerticalScrollBar.ScrollW, H, Parent)

        this.SourisCapture = true;
        this.Draggable = true;

        this.Couleur = UIElement.BaseCouleur;

        this.#ScrollPosition = 0;
        this.TotalH = 0;

        let _this = this;
        this.onSouris_Clique[Souris.ClicGauche].push(function(e) {_this.Souris_Clique(e)})
        this.onSouris_DragStart[Souris.ClicGauche].push(function(e) {_this.Souris_DragStart(e)})
        this.onSouris_Dragging[Souris.ClicGauche].push(function(e) {_this.Souris_Dragging(e)})
        this.onSouris_DragEnd[Souris.ClicGauche].push(function(e) {_this.Souris_DragEnd(e)})
        this.onSouris_Entre.push(function(e) {_this.Souris_Hover(e)})
        this.onSouris_Quitte.push(function(e) {_this.Souris_Leave(e)})
        this.onActivate.push(function(e) {_this.Activation(e)})
        this.onDeActivate.push(function(e) {_this.Desactivation(e)})
    }

    get ScrollPosition()
    {
        return this.#ScrollPosition;
    }
    set ScrollPosition(v)
    {
        this.#ScrollPosition = Math.max(0,Math.min(this.TotalH - this.H, v));
        this.RefreshUI();
        this.Parent.ScrollPosition = this.#ScrollPosition;
    }

    Activation(e)
    {
        this.Couleur = this.BaseCouleur;
        this.RefreshUI();
    }
    Desactivation(e)
    {
        this.Couleur = this.InactifCouleur;
        this.RefreshUI();
    }
    Souris_Clique(event)
    {
        let cy = this.GY + this.ScrollPosition / this.TotalH * this.H;
        let ch = this.H / this.TotalH * this.H;
        let pos = event.Param;
        if (pos.y < cy)
        {
            this.ScrollPosition = (pos.y - this.GY) / this.H * this.TotalH
        }
        else if (pos.y > cy + ch)
        {
            this.ScrollPosition = (pos.y - this.GY) / this.H * this.TotalH - this.H;
        }

    }
    Souris_DragStart(event)
    {
        this.Couleur = this.HoverCouleur;
        this.#dragstart = event.Param.y;
        this.Souris_Clique(event)
        this.#ScrollOldPosition = this.ScrollPosition;
    }
    Souris_Dragging(event)
    {
        this.Couleur = this.HoverCouleur;
        let l = event.Param.y - this.#dragstart;
        this.ScrollPosition = this.#ScrollOldPosition + l / this.H * this.TotalH;
    }
    Souris_DragEnd(event)
    {
        this.Couleur = this.BaseCouleur;
        let l = event.Param.y - this.#dragstart;
        this.ScrollPosition = this.#ScrollOldPosition + l / this.H * this.TotalH;
    }

    Souris_Hover(event)
    {
        this.Couleur = this.HoverCouleur;
        this.RefreshUI();
    }
    Souris_Leave(event)
    {
        this.Couleur = this.BaseCouleur;
        this.RefreshUI();
    }

    RefreshUI()
    {
        super.RefreshUI();
    }


    DessinBackUI(Context)
    {
        let Contour = this.Couleur.RGBA2(46)//Color.CouleurByte(97,62,24,1);

        Context.save();
        Context.fillStyle = Color.Couleur(0,0,0,0.2)
        Context.strokeStyle = Color.Couleur(0,0,0,0.2)
        this.roundRect(Context, 0, 0, UI_VerticalScrollBar.ScrollW, this.H, 2, true, true)

        let y = this.ScrollPosition / this.TotalH * this.H
        let h = this.H * this.H / this.TotalH
        Context.fillStyle = this.Couleur.RGBA()
        Context.strokeStyle = Contour
        this.roundRect(Context, 0, y, UI_VerticalScrollBar.ScrollW, h, 2, true, true)

        Context.restore();

    }
}
class UI_HorizontalScrollBar extends UIElement
{
    static ScrollH = 15;

    #dragstart;
    #ScrollOldPosition;
    #ScrollPosition;

    constructor(X,Y,W,Parent)
    {
        super(X,Y,100000000,W,UI_VerticalScrollBar.ScrollH, Parent)

        this.SourisCapture = true;
        this.Draggable = true;

        this.Couleur = UIElement.BaseCouleur;

        this.#ScrollPosition = 0;
        this.TotalW = 0;

        let _this = this;
        this.onSouris_Clique[Souris.ClicGauche].push(function(e) {_this.Souris_Clique(e)})
        this.onSouris_DragStart[Souris.ClicGauche].push(function(e) {_this.Souris_DragStart(e)})
        this.onSouris_Dragging[Souris.ClicGauche].push(function(e) {_this.Souris_Dragging(e)})
        this.onSouris_DragEnd[Souris.ClicGauche].push(function(e) {_this.Souris_DragEnd(e)})
        this.onSouris_Entre.push(function(e) {_this.Souris_Hover(e)})
        this.onSouris_Quitte.push(function(e) {_this.Souris_Leave(e)})
        this.onActivate.push(function(e) {_this.Activation(e)})
        this.onDeActivate.push(function(e) {_this.Desactivation(e)})
    }

    get ScrollPosition()
    {
        return this.#ScrollPosition;
    }
    set ScrollPosition(v)
    {
        this.#ScrollPosition = Math.max(0,Math.min(this.TotalW - this.W, v));
        this.RefreshUI();
        this.Parent.ScrollPosition = this.#ScrollPosition;
    }

    Activation(e)
    {
        this.Couleur = this.BaseCouleur;
        this.RefreshUI();
    }
    Desactivation(e)
    {
        this.Couleur = this.InactifCouleur;
        this.RefreshUI();
    }
    Souris_Clique(event)
    {
        let cx = this.GX + this.ScrollPosition / this.TotalW * this.W;
        let cw = this.W / this.TotalW * this.W;
        let pos = event.Param;
        if (pos.x < cx)
        {
            this.ScrollPosition = (pos.x - this.GX) / this.W * this.TotalW
        }
        else if (pos.x > cx + cw)
        {
            this.ScrollPosition = (pos.x - this.GX) / this.W * this.TotalW - this.W;
        }

    }
    Souris_DragStart(event)
    {
        this.Couleur = this.HoverCouleur;
        this.#dragstart = event.Param.x;
        this.Souris_Clique(event)
        this.#ScrollOldPosition = this.ScrollPosition;
    }
    Souris_Dragging(event)
    {
        this.Couleur = this.HoverCouleur;
        let l = event.Param.x - this.#dragstart;
        this.ScrollPosition = this.#ScrollOldPosition + l / this.W * this.TotalW;
    }
    Souris_DragEnd(event)
    {
        this.Couleur = this.BaseCouleur;
        let l = event.Param.x - this.#dragstart;
        this.ScrollPosition = this.#ScrollOldPosition + l / this.W * this.TotalW;
    }

    Souris_Hover(event)
    {
        this.Couleur = this.HoverCouleur;
        this.RefreshUI();
    }
    Souris_Leave(event)
    {
        this.Couleur = this.BaseCouleur;
        this.RefreshUI();
    }

    RefreshUI()
    {
        super.RefreshUI();
    }


    DessinBackUI(Context)
    {
        let Contour = this.Couleur.RGBA2(46)//Color.CouleurByte(97,62,24,1);

        Context.save();
        Context.fillStyle = Color.Couleur(0,0,0,0.2)
        Context.strokeStyle = Color.Couleur(0,0,0,0.2)
        this.roundRect(Context, 0, 0, this.W, UI_VerticalScrollBar.ScrollH, 2, true, true)

        let x = this.ScrollPosition / this.TotalW * this.W
        let w = this.W * this.W / this.TotalW
        Context.fillStyle = this.Couleur.RGBA()
        Context.strokeStyle = Contour
        this.roundRect(Context, x, 0, w, UI_VerticalScrollBar.ScrollH, 2, true, true)

        Context.restore();

    }
}