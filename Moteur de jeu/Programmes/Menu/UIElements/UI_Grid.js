class UI_Grid extends UI_Element
{
    #Rows = [];
    #Columns = [];

    constructor(Param)
    {
        super(Param)

        this.H = UI_Element_Alignement.STRETCH;

        this.Rows = [];
        this.Columns = [];
    }

    get Rows() { return this.#Rows; }
    set Rows(v) { this.#Rows = v; }
    get Columns() { return this.#Columns; }
    set Columns(v) { this.#Columns = v; }

    /**
     * Calcul la position X de point de départ d'un contenue d'objet (padding)
     * @type {float}
     */
    CX(sender)
    {
        let x = 0;
        for (let i = 0; i < Math.min(sender.Grid_Column, this.Columns.length); i++) 
        {
            x += this.Columns[i].DesiredPixelsize;
        }
        return x + super.CX(sender);
    }
    /**
     * Calcul la position Y de point de départ d'un contenue d'objet (padding)
     * @type {float}
     */
    CY(sender)
    {
        let x = 0;
        for (let i = 0; i < Math.min(sender.Grid_Row, this.Rows.length); i++) 
        {
            x += this.Rows[i].DesiredPixelsize;
        }
        return x + super.CY(sender);
    }

    AddRow(row)
    {
        if (row instanceof UI_Grid_Row)
        {
            this.Rows.push(row);
            //this.RecalculateSize();
        }
        else
        {
            Debug.LogErreurType("Ajout Ligne","UI_Grid_Row",row);
        }
    }
    AddColumn(column)
    {
        if (column instanceof UI_Grid_Column)
        {
            this.Columns.push(column);
            //this.RecalculateSize();
        }
        else
        {
            Debug.LogErreurType("Ajout Colonne","UI_Grid_Column",column);
        }
    }

    /**
     * Coeur de la mesure de l'objet. Cette fonction demande à l'objet la taille qu'il souhaite prendre
     * !!!!!!!  Cette fonction doit appelé la fonction Measure sur l'ensemble des objets enfants.
     * @param {Vector} availableSize Taille disponible actuellement
     * @param {boolean} skip Définit si la mesure doit être sauté
     * @returns {Vector} Taille souhaité par cet objet
     */
    MeasureCore(availableSize, skip)
    {
        //Calcul de la taille du contenue dans ce cas
        let contentsize = availableSize.clone();
        let offw = this.X + this.Margin.right;
        let offh = this.Y + this.Margin.down;
        contentsize.x -= offw;
        contentsize.y -= offh;

        // Ajustement si la largeur ou hauteur est définit
        if (this.W >= 0)
            contentsize.x = Math.min(Math.max(this.W,this.MinW),this.MaxW);
        if (this.H >= 0)
            contentsize.y = Math.min(Math.max(this.H,this.MinH),this.MaxH);
        
            contentsize.x = this.W === UI_Element_Alignement.AUTO ? Math.max(0,this.MinW) : contentsize.x;
            contentsize.y = this.H === UI_Element_Alignement.AUTO ? Math.max(0,this.MinH) : contentsize.y;

        this.Childrens.forEach(child => 
            {
                child.Measure(Vector.Zero);
            });

        this.MeasureGridSize(contentsize);
 
        //Calcul de la taille voulue des enfants
        let desiredsize = new Vector(0,0);
        this.Childrens.forEach(child => 
        {
            let x = 0, y = 0;
            for (let i = child.Grid_Column; i < Math.min(child.Grid_Column + child.Grid_ColumnsSpan, this.Columns.length); i++) 
            {
                x += this.Columns[i].DesiredPixelsize;
            }
            for (let i = child.Grid_Row; i < Math.min(child.Grid_Row + child.Grid_RowsSpan, this.Rows.length); i++) 
            {
                y += this.Rows[i].DesiredPixelsize;
            }

            child.Measure(new Vector(x,y));
        });
        desiredsize.x += offw;
        desiredsize.y += offh;
        contentsize.x += offw;
        contentsize.y += offh;
        
        for (let i = 0; i < this.Columns.length; i++) 
        {
            desiredsize.x += this.Columns[i].DesiredPixelsize;
        }
        for (let i = 0; i < this.Rows.length; i++) 
        {
            desiredsize.y += this.Rows[i].DesiredPixelsize;
        }


        let x = Math.max(contentsize.x, desiredsize.x, this.MinW);
        let y = Math.max(contentsize.y, desiredsize.y, this.MinH);

        // Renvoie la taille maximal voulue
        return new Vector(x, y);
    }
 
    MeasureGridSize(availableSize)
    {
        let ExpandX = availableSize.x;
        let decoupx = 0;
        let ExpandY = availableSize.y;
        let decoupy = 0;
        for (let i = 0; i < this.Columns.length; i++) 
        {
            const column = this.Columns[i];
            switch(column.Type)
            {
                case(UI_Grid_Length.Type_Pixel) : ExpandX -= column.Width; break;
                case(UI_Grid_Length.Type_Star) : decoupx += column.Width; break;
                case(UI_Grid_Length.Type_Auto) :
                {
                    let size = 0;
                    this.Childrens.forEach(child => {
                        if (child.Grid_Column === i)
                        {
                            if (child.Grid_ColumnsSpan === 1)
                            {
                                size = Math.max(size, child.Desiredsize.x);
                            }
                        }
                    });
                    column.DesiredPixelsize = size;

                    ExpandX -= size;
                    break;
                }
            }
        }
        ExpandX = Math.max(ExpandX, 0) / decoupx;
        for (let i = 0; i < this.Columns.length; i++) 
        {
            if (this.Columns[i].Type === UI_Grid_Length.Type_Star)
                this.Columns[i].DesiredPixelsize = ExpandX * this.Columns[i].Width;
            else if (this.Columns[i].Type === UI_Grid_Length.Type_Pixel)
                this.Columns[i].DesiredPixelsize = this.Columns[i].Width;
        }
        for (let j = 0; j < this.Rows.length; j++) 
        {
            const row = this.Rows[j];
            switch(row.Type)
            {
                case(UI_Grid_Length.Type_Pixel) : ExpandY -= row.Height; break;
                case(UI_Grid_Length.Type_Star) : decoupy += row.Height; break;
                case(UI_Grid_Length.Type_Auto) :
                {
                    let size = 0;
                    this.Childrens.forEach(child => {
                        if (child.Grid_Row === j)
                        {
                            if (child.Grid_RowsSpan === 1)
                            {
                                //console.log(child, child.Desiredsize.y)
                                size = Math.max(size, child.Desiredsize.y);
                            }
                        }
                    });
                    //console.log(size)
                    row.DesiredPixelsize = size;

                    ExpandY -= size;
                    break;
                }
            }
        }
        ExpandY = Math.max(ExpandY, 0) / decoupy;
        for (let i = 0; i < this.Rows.length; i++) 
        {
            if (this.Rows[i].Type === UI_Grid_Length.Type_Star)
                this.Rows[i].DesiredPixelsize = ExpandY * this.Rows[i].Height;
            else if (this.Rows[i].Type === UI_Grid_Length.Type_Pixel)
                this.Rows[i].DesiredPixelsize = this.Rows[i].Height;
        }
    }

    /**
     * Coeur de l'arrangement des éléments. Cette fonction demande à l'objet de s'adapter à la taille choisie.
     * !!!! Celle-ci doit aussi appelé Arrange sur l'ensemble de ses enfants.
     * @param {Vector} finalRect Taille alloué a l'objet
     * @param {boolean} sameAsMesure Définit si la taille final est identique a la taille de mesure
     */
    ArrangeCore(finalRect,sameAsMesure)
    {
        // Ajustement si la largeur ou hauteur est définit
        if (this.W >= 0)
            finalRect.x = Math.min(Math.max(this.W,this.MinW),this.MaxW);// - this.Padding.left - this.Padding.right;
        if (this.H >= 0)
            finalRect.y = Math.min(Math.max(this.H,this.MinH),this.MaxH);// - this.Padding.up - this.Padding.down;
        
        
        let x = this.W === UI_Element_Alignement.AUTO ? Math.min(finalRect.x, this.Desiredsize.x) : finalRect.x ;
        let y = this.H === UI_Element_Alignement.AUTO ? Math.min(finalRect.y, this.Desiredsize.y) : finalRect.y;

        this.SetFinalSize(new Vector(x, y));
        
        if (!sameAsMesure)
        {
            this.MeasureGridSize(this.FinalContentSize);
        }

        this.Childrens.forEach(child => {
            
            let x = 0, y = 0;
            for (let i = child.Grid_Column; i < Math.min(child.Grid_Column + child.Grid_ColumnsSpan, this.Columns.length); i++) 
            {
                x += this.Columns[i].DesiredPixelsize;
            }
            for (let i = child.Grid_Row; i < Math.min(child.Grid_Row + child.Grid_RowsSpan, this.Rows.length); i++) 
            {
                y += this.Rows[i].DesiredPixelsize;
            }

            child.Arrange(new Vector(x,y));
        });
    }

    /**
     * Effectue le dessin des enfants sur le canvas contenue local
     */
    DessinChildLocal(RecreateCanvas)
    {
        this.Childctx.clearRect(0,0,this.Childctx.canvas.width, this.Childctx.canvas.height);
        this.Childrens.forEach(child => {
            let x = 0, y = 0;
            for (let i = 0; i < Math.min(child.Grid_Column, this.Columns.length); i++) 
            {
                x += this.Columns[i].DesiredPixelsize;
            }
            for (let i = 0; i < Math.min(child.Grid_Row, this.Rows.length); i++) 
            {
                y += this.Rows[i].DesiredPixelsize;
            }
            child.Draw(this.Childctx, RecreateCanvas, x, y);
        });
    }

    /**
     * Effectue le dessin du contenue avant de cette objet (vis à vis des enfants)
     * @param {CanvasRenderingContext2D} Context Context de dessin
     */
    DessinFrontUI(Context)
    {
        return;
        // For debugging
        let x = 0;
        let y = 0;
        Context.strokeStyle = "Red";
        for (let r = 0; r < this.Rows.length; r++) 
        {
            Context.moveTo(0, y)
            Context.lineTo(Context.canvas.width, y)
            Context.stroke();
            y +=  this.Rows[r].DesiredPixelsize;   
        }
        for (let c = 0; c < this.Columns.length; c++) 
        {
            Context.moveTo(x, 0)
            Context.lineTo(x, Context.canvas.height)
            Context.stroke();
            x +=  this.Columns[c].DesiredPixelsize;   
        }
    }

}

class UI_Grid_Length
{
    static Type_Star = "star";
    static Type_Pixel = "pixel";
    static Type_Auto = "auto";

    constructor(value = 0, type = UI_Grid_Length.Type_Pixel)
    {
        this.Value = value;
        this.Type = type;
        this.DesiredPixelsize = type === UI_Grid_Length.Type_Pixel ? value : 0;
        //this.FinalPixelSize = 0;
    }

    static Star(value)
    {
        let a = new UI_Grid_Length(value, UI_Grid_Length.Type_Star)

    }
}

class UI_Grid_Row extends UI_Grid_Length
{
    static Star(H = 1)
    {
        return new UI_Grid_Row(H, UI_Grid_Length.Type_Star)
    }
    static Auto()
    {
        return new UI_Grid_Row(0, UI_Grid_Length.Type_Auto)
    }

    constructor(value = 0, type = UI_Grid_Length.Type_Pixel)
    {
        super(value, type)
    }

    get Height() {return this.Value;}
    set Height(v) {this.Value = v;}
}

class UI_Grid_Column extends UI_Grid_Length
{
    static Star(H = 1)
    {
        return new UI_Grid_Column(H, UI_Grid_Length.Type_Star)
    }
    static Auto()
    {
        return new UI_Grid_Column(0, UI_Grid_Length.Type_Auto)
    }

    constructor(value = 0, type = UI_Grid_Length.Type_Pixel)
    {
        super(value, type)
    }

    get Width() {return this.Value;}
    set Width(v) {this.Value = v;}
}