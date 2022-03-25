class Scene1 extends Scene
{
    constructor()
    {
        super();

        this.Lutin1 = new LutinTest(200,200);
        this.Lutin2 = new LutinTest(-200,-200);
        this.Lutin1.CentreRotation = new Vecteur2(0.5,1);
        this.Lutin2.CentreRotation = new Vecteur2(0.5,1);
        this.Lutin2.Zoom = 20;

        this.Lutin3 = new LutinTest(0,0, "Images/Moto/Moto1.png");
        this.Lutin3.CentreRotation = new Vecteur2(0.5,1);

        this.ZObject.push(this.Lutin1)
        this.ZObject.push(this.Lutin2)
        this.ZObject.push(this.Lutin3)
    }

    Calcul(Delta)
    {
        super.Calcul(Delta)
        this.Lutin1.Calcul(Delta)
        this.Lutin2.Calcul(Delta)
        this.Lutin3.Calcul(Delta)

        if(Clavier.ToucheBasse("ArrowUp"))
        {
            this.Lutin3.Y += 2
        }
        if(Clavier.ToucheBasse("ArrowDown"))
        {
            this.Lutin3.Y -= 2
        }
        if(Clavier.ToucheBasse("ArrowLeft"))
        {
            this.Lutin3.X -= 2
        }
        if(Clavier.ToucheBasse("ArrowRight"))
        {
            this.Lutin3.X += 2
        }
        this.Lutin3.Z = -this.Lutin3.Y;

        Debug.AjoutVecteur(new Vecteur2(this.Lutin1.X, this.Lutin1.Y),new Vecteur2(0,0))
        Debug.AjoutVecteur(new Vecteur2(this.Lutin2.X, this.Lutin2.Y),new Vecteur2(0,0))
        Debug.AjoutVecteur(new Vecteur2(this.Lutin3.X, this.Lutin3.Y),new Vecteur2(0,0))
    }

    Dessin(Context)
    {
        super.Dessin(Context)
    }
}