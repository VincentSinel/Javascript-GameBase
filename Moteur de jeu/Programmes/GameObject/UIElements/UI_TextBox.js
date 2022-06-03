class UI_TextBox extends UIElement
{
    constructor(X,Y,Z,W,Texte, ToolTip = "",Parent = undefined)
    {
        super(X,Y,Z,W,0,Parent)
        this.Texte = Texte;
        this.ToolTip = ToolTip;
        this.CursorPosition = Texte.length;
        this.SourisCapture = true;
        this.H = this.FontTaille + 6;
    }


    DessinBackUI()
    {
        
    }
}