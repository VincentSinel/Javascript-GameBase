class UI_ListView extends UI_Panel
{
    #ScrollPosition;

    constructor(X,Y,Z,W,H, Parent = undefined)
    {
        super(X,Y,Z,W,H, Parent)
        
        this.SourisCapture = true;
        this.ScrollCapture = true;
        this.Elements = [];
        this.ScrollBar = new UI_VerticalScrollBar(this.CW - UI_VerticalScrollBar.ScrollW, 0,this.CH, this);

        this.SelectedIndex = -1;
        this.#ScrollPosition = 0;

        let _this = this;
        this.onSouris_Scroll.push(function(e) { _this.Souris_Scroll(e)})
        this.onSelectionChanged = undefined;
    }

    get ScrollPosition()
    {
        return this.#ScrollPosition;
    }
    set ScrollPosition(v)
    {
        this.#ScrollPosition = v;
        this.RefreshUI();   
    }

    Souris_Scroll(e)
    {
        this.ScrollBar.ScrollPosition += e.Param.dy * 30;
    }

    AjoutElement(Element)
    {
        let y = this.TotalHeight;
        let o;
        if (typeof Element === 'string' || Element instanceof String)
        {
            let text = new UI_Label(0,0,1,this.CW - UI_VerticalScrollBar.ScrollW, this.FontTaille + 4, Element);
            text.HorizontalAlignement = HorizontalAlignementType.Droite
            text.VerticalAlignement = VerticalAlignementType.Etendu
            o = new ListeElement(y,this.CW - UI_VerticalScrollBar.ScrollW, text, this)
        }
        else
        {
            o = new ListeElement(y,Element.CW, Element, this)
        }
        this.Elements.push(o)
    }

    Select(index)
    {
        let old_index = this.SelectedIndex
        this.SelectedIndex = index;
        this.Elements.forEach(element => {
            element.Selected = false;
        });
        this.Elements[index].Selected = true;
        if (this.onSelectionChanged && old_index != index)
        {
            this.onSelectionChanged(this);
        }
    }

    get TotalHeight()
    {
        let h = 0;
        this.Elements.forEach(element => {
            h += element.H;
        });
        return h;
    }

    RemoveChildren(element)
    {
        super.RemoveChildren(element)
        
        let i = this.Elements.indexOf(element)
        if (i > -1)
        {
            let h = element.H;
            this.Elements.splice(this.Elements.indexOf(element), 1);
            for (let j = i; j < this.Elements.length; j++) 
            {
                this.Elements[j].Y -= h;
                
            }
        }
        
    }



    UpdateYPosition()
    {
        if (this.Elements.length > 0)
        {
            this.Elements[0].Y = -this.ScrollBar.ScrollPosition;
            for (let i = 1; i < this.Elements.length; i++) 
            {
                this.Elements[i].Y = this.Elements[i - 1].Y + this.Elements[i - 1].H;
                
            }
            this.ScrollBar.TotalH = this.TotalHeight;
            this.ScrollBar.RefreshUI();
        }
    }


    DessinBackUI(Context)
    {
        super.DessinBackUI(Context)
    }

    RefreshUI()
    {
        this.UpdateYPosition()
        super.RefreshUI();
    }
}



class ListeElement extends UIElement
{
    #Selected;

    constructor(Y,W, Element, Parent)
    {
        super(0, Y, 1, W, 1, Parent);

        this.AddChildren(Element);
        this.Contenue = Element;
        this.SourisCapture = true;
        this.Padding = [0,0,0,0]
        this.CreateCanvas();

        this.overlayColor = Color.Couleur(0,0,0,0);

        let _this = this;
        this.onSouris_Entre.push(function(e) {_this.Souris_Hover(e)})
        this.onSouris_Quitte.push(function(e) {_this.Souris_Leave(e)})
        this.onSouris_Clique[Souris.ClicGauche].push(function(e) {_this.Souris_Clique(e)})
        this.onActivate.push(function(e) {_this.Activation(e)})
        this.onDeActivate.push(function(e) {_this.Desactivation(e)})
        this.onChildResize.push(function(e) {_this.ChildResize(e)})

    }

    get Selected()
    {
        return this.#Selected;
    }
    set Selected(v)
    {
        if(v != this.#Selected)
        {
            this.#Selected = v;
            this.RefreshUI();
        }

    }

    Activation(e)
    {
        this.overlayColor = Color.Couleur(0,0,0,0);
        this.Selected = false;
        this.RefreshUI();
    }
    Desactivation(e)
    {
        this.overlayColor = Color.Couleur(0,0,0,0);
        this.Selected = false;
        this.RefreshUI();
    }
    Souris_Clique(event)
    {
        this.Parent.Select(this.ID);
    }
    Souris_Hover(event)
    {
        this.overlayColor = Color.Couleur(0,0,1,0.1);
        this.RefreshUI();
    }
    Souris_Leave(event)
    {
        this.overlayColor = Color.Couleur(0,0,0,0);
        this.RefreshUI();
    }

    ChildResize(event)
    {
        this.CalculH()
        this.Parent.UpdateYPosition()
        this.RefreshUI();
    }



    get ID()
    {
        return this.Parent.Elements.indexOf(this);
    }
    CreateCanvas()
    {
        this.CalculH()
        super.CreateCanvas()
    }

    CalculH()
    {
        let b = this.BoundingBoxChild(true)
        this.H = b.h + b.y;
    }

    DessinBackUI(Context)
    {
        if(this.ID % 2 === 0)
        {
            Context.fillStyle = Color.Couleur(1,1,1,0.1)
            Context.fillRect(0, 0, this.W, this.H);
        }
    }
    DessinFrontUI(Context)
    {
        if(this.Selected)
        {
            Context.fillStyle = this.SelectionCouleur.RGBA()
            Context.strokeStyle = this.SelectionCouleur.RGB()
            Context.lineWidth = 2;
            Context.fillRect(0, 0, this.W, this.H);
            Context.strokeRect(0, 0, this.W, this.H);
        }
        Context.fillStyle = this.overlayColor
        Context.fillRect(0, 0, this.W, this.H);
    }

}