class UI_ListView extends UI_ScrollView
{
    #StackPanel;
    #SelectedIndex = -1;
    #HoverIndex = -1;
    #BackTopCanvas;

    constructor(Param)
    {
        super(Param)

        this.ScrollHorizontal = false;
        this.Capture_Souris = true

        this.#StackPanel = new UI_Stack();
        this.#StackPanel.W = UI_Element_Alignement.STRETCH;
        this.#StackPanel.HorizontalAlignement = HorizontalAlignementType.Center;
        this.#StackPanel.VerticalAlignement = VerticalAlignementType.Up;
        this.#StackPanel.Padding.left = 3;
        this.#StackPanel.Padding.right = 3;
        super.AddChildren(this.#StackPanel);

        this.SelectedIndex = -1;
        this.onSelectionChanged = [];
        let _this = this;
        this.onSouris_Clique[Souris.ClicGauche].push(function(e) {_this.Souris_Clique(e)})
        this.onSouris_AuDessus.push(function(e) {_this.Souris_Hover(e)})
    }

    get Elements() { return this.#StackPanel.Childrens; }
    set Elements(v) { this.#StackPanel.Childrens = v; this.SetDirty();}

    get SelectedIndex() { return this.#SelectedIndex;}
    set SelectedIndex(v) { this.#Select(v);}

    AddChildren(Element)
    {
        this.#StackPanel.AddChildren(Element);
    }

    RemoveChildren(element)
    {
        this.#StackPanel.RemoveChildren(element)
    }

    Souris_Clique(e)
    {
        for (let i = 0; i < this.#StackPanel.Childrens.length; i++) 
        {
            if (this.#StackPanel.Childrens[i].PointIn(Souris.CPosition))
            {
                this.SelectedIndex = i;
                return;
            }
        }
    }

    Souris_Hover(e)
    {
        for (let i = 0; i < this.#StackPanel.Childrens.length; i++) 
        {
            if (this.#StackPanel.Childrens[i].PointIn(Souris.CPosition))
            {
                this.#HoverIndex = i;
                this.Refresh();
                return;
            }
        }
    }

    MoveViewX(x)
    {
        super.MoveViewX(x);
        this.Refresh();
    }
    MoveViewY(y)
    {
        super.MoveViewY(y);
        this.Refresh();
    }

    #Select(index)
    {
        let old_index = this.#SelectedIndex
        this.#SelectedIndex = index;
        if (old_index != index)
        {
            this.onSelectionChanged.forEach(element => {
                element(this)
            });
        }
        this.Refresh();
    }

    CreateCanvas()
    {
        super.CreateCanvas();

        this.#BackTopCanvas = document.createElement("canvas").getContext("2d");
        this.#BackTopCanvas.canvas.width = this.Childrens[0].Childrens[0].FinalSize.x;
        this.#BackTopCanvas.canvas.height = this.Childrens[0].Childrens[0].FinalSize.y;
    }

    DessinBackUI(Context)
    {
        this.#BackTopCanvas.clearRect(0,0,this.#BackTopCanvas.canvas.width,this.#BackTopCanvas.canvas.height);
        

        let y = -this.Scroll_VPosition;
        for (let i = 0; i < this.#StackPanel.Childrens.length; i++) 
        {
            if (i % 2 == 0)
            {
                this.#BackTopCanvas.fillStyle = Color.Couleur(1,1,1,0.1)
                this.#BackTopCanvas.fillRect(0, y, this.#BackTopCanvas.canvas.width, this.#StackPanel.Childrens[i].FinalSize.y);
            }
            y += this.#StackPanel.Childrens[i].FinalSize.y;
        }
        Context.drawImage(this.#BackTopCanvas.canvas, 0, 0);

    }

    DessinFrontUI(Context)
    {
        this.#BackTopCanvas.clearRect(0,0,this.#BackTopCanvas.canvas.width,this.#BackTopCanvas.canvas.height);
        
        let y1 = -this.Scroll_VPosition;
        let y2 = -this.Scroll_VPosition;
        for (let i = 0; i < Math.max(this.SelectedIndex, this.#HoverIndex); i++) 
        {
            if (i < this.SelectedIndex)
                y1 += this.#StackPanel.Childrens[i].FinalSize.y;
            if (i < this.#HoverIndex)
                y2 += this.#StackPanel.Childrens[i].FinalSize.y;
        }

        if (this.SelectedIndex > -1)
        {
            let s = this.#StackPanel.Childrens[this.SelectedIndex].FinalSize.clone();
            s.x += this.#StackPanel.Padding.left + this.#StackPanel.Padding.right;
            s.y += this.#StackPanel.Padding.up + this.#StackPanel.Padding.down;

            this.#BackTopCanvas.fillStyle = this.SelectionCouleur.RGBA()
            this.#BackTopCanvas.strokeStyle = this.SelectionCouleur.RGB()
            this.#BackTopCanvas.lineWidth = 2;
            this.#BackTopCanvas.fillRect(0, y1, s.x, s.y);
            this.#BackTopCanvas.strokeRect(0, y1, s.x, s.y);
            
            Context.drawImage(this.#BackTopCanvas.canvas, 0, 0);
        }
        if (this.#HoverIndex > -1)
        {
            let s = this.#StackPanel.Childrens[this.#HoverIndex].FinalSize.clone();
            s.x += this.#StackPanel.Padding.left + this.#StackPanel.Padding.right;
            s.y += this.#StackPanel.Padding.up + this.#StackPanel.Padding.down;

            this.#BackTopCanvas.fillStyle = Color.Couleur(0,0,1,0.1)
            this.#BackTopCanvas.fillRect(0, y2, s.x, s.y);
            
            Context.drawImage(this.#BackTopCanvas.canvas, 0, 0);
        }
    }


}



// class ListeElement extends UI_Element
// {
//     #Selected;

//     constructor(Y,W, Element, Parent)
//     {
//         super(0, Y, 1, W, 1, Parent);

//         this.AddChildren(Element);
//         this.Contenue = Element;
//         this.Padding = [0,0,0,0]
//         this.CreateCanvas();

//         this.overlayColor = Color.Couleur(0,0,0,0);

//         let _this = this;
//         this.onSouris_Entre.push(function(e) {_this.Souris_Hover(e)})
//         this.onSouris_Quitte.push(function(e) {_this.Souris_Leave(e)})
//         this.onSouris_Clique[Souris.ClicGauche].push(function(e) {_this.Souris_Clique(e)})
//         this.onActivate.push(function(e) {_this.Activation(e)})
//         this.onDeActivate.push(function(e) {_this.Desactivation(e)})
//         this.onChildResize.push(function(e) {_this.ChildResize(e)})

//     }

//     get Selected()
//     {
//         return this.#Selected;
//     }
//     set Selected(v)
//     {
//         if(v != this.#Selected)
//         {
//             this.#Selected = v;
//             this.RefreshUI();
//         }

//     }

//     Activation(e)
//     {
//         this.overlayColor = Color.Couleur(0,0,0,0);
//         this.Selected = false;
//         this.RefreshUI();
//     }
//     Desactivation(e)
//     {
//         this.overlayColor = Color.Couleur(0,0,0,0);
//         this.Selected = false;
//         this.RefreshUI();
//     }
//     Souris_Clique(event)
//     {
//         this.Parent.Select(this.ID);
//     }
//     Souris_Hover(event)
//     {
//         this.overlayColor = Color.Couleur(0,0,1,0.1);
//         this.RefreshUI();
//     }
//     Souris_Leave(event)
//     {
//         this.overlayColor = Color.Couleur(0,0,0,0);
//         this.RefreshUI();
//     }

//     ChildResize(event)
//     {
//         this.CalculH()
//         this.Parent.UpdateYPosition()
//         this.RefreshUI();
//     }



//     get ID()
//     {
//         return this.Parent.Elements.indexOf(this);
//     }
//     CreateCanvas()
//     {
//         this.CalculH()
//         super.CreateCanvas()
//     }

//     CalculH()
//     {
//         let b = this.BoundingBoxChild(true)
//         this.H = b.h + b.y;
//     }

//     DessinBackUI(Context)
//     {
//         if(this.ID % 2 === 0)
//         {
//             Context.fillStyle = Color.Couleur(1,1,1,0.1)
//             Context.fillRect(0, 0, this.W, this.H);
//         }
//     }
//     DessinFrontUI(Context)
//     {
//         if(this.Selected)
//         {
//             Context.fillStyle = this.SelectionCouleur.RGBA()
//             Context.strokeStyle = this.SelectionCouleur.RGB()
//             Context.lineWidth = 2;
//             Context.fillRect(0, 0, this.W, this.H);
//             Context.strokeRect(0, 0, this.W, this.H);
//         }
//         Context.fillStyle = this.overlayColor
//         Context.fillRect(0, 0, this.W, this.H);
//     }

// }