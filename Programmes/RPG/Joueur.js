class Joueur extends Lutin_SC
{
    constructor(X,Y)
    {
        let Costumes =[
            "Images/Joueur/B_0.png",
            "Images/Joueur/B_1.png",
            "Images/Joueur/B_2.png",
            "Images/Joueur/D_0.png",
            "Images/Joueur/D_1.png",
            "Images/Joueur/D_2.png",
            "Images/Joueur/G_0.png",
            "Images/Joueur/G_1.png",
            "Images/Joueur/G_2.png",
            "Images/Joueur/H_0.png",
            "Images/Joueur/H_1.png",
            "Images/Joueur/H_2.png"
        ]

        super(X,Y, "Images/Perso.png", [32,32], 1); //Costumes)
        this.Vue = 0
        this.CentreRotation = new Vecteur2(0.5,1) //#####################
    }


    Calcul(Delta)
    {
        super.Calcul(Delta)
        let deplacementx = 0;
        let deplacementy = 0;

        if (Clavier.ToucheBasse("z"))
            deplacementy += 1
        if (Clavier.ToucheBasse("s"))
            deplacementy -= 1
        if (Clavier.ToucheBasse("q"))
            deplacementx -= 1
        if (Clavier.ToucheBasse("d"))
            deplacementx += 1

        this.X += deplacementx * 2 * Delta
        this.Y += deplacementy * 2 * Delta

        if (deplacementx > 0 && deplacementy == 0)
            this.Vue = 2
        if (deplacementx < 0 && deplacementy == 0)
            this.Vue = 1
        if (deplacementy > 0 && deplacementx == 0)
            this.Vue = 3
        if (deplacementy < 0 && deplacementx == 0)
            this.Vue = 0

        let id = 3 + this.Vue * 12 + 1 + ((-2 + Math.floor(this.Time / 12) % 4) % 2)
        
        this.BasculerCostume(id)//this.Vue * 3 + Math.floor(this.Time / 12) % 3)
    }


}