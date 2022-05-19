class LutinTest extends Lutin
{
    constructor(X,Y, name = "Images/Chat.png")
    {
        super(X,Y,[name])

        this.Z = -this.Y
        this.color = Color.Couleur(Math.random(), Math.random(), Math.random(), 0.2);
        this.v = 0.1 + Math.random() * 0.5
        //this.Teinte.A = 0.5;
        //this.Teinte.R = 0;
        //this.Teinte.G = Math.random() * 255;
        //this.Teinte.B = 0;
    }

    Calcul(Delta)
    {
        super.Calcul(Delta)

        this.Direction += this.v * Delta;

        //Debug.AjoutRectangle(this.Rect, this.color)
        //Debug.AjoutRectangle(this.Rect.boundingbox, this.color);

        if (this.Children.length > 0)
            Debug.AjoutVecteur(this.GPosition, this.GPosition.to(this.Children[0].GPosition), "red");
    }
}