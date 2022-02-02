class JeuPong
{
    static JeuLargeur;
    static JeuHauteur;

    constructor()
    {
        this.BordL = 200;
        this.Briques = [];


        let colonne = 18
        let line = 20;
        JeuPong.JeuLargeur = Ecran_Largeur - 2 * this.BordL;
        JeuPong.JeuHauteur = Ecran_Hauteur;
        let w = JeuPong.JeuLargeur - 20;
        let h = Ecran_Hauteur / 2 - 10;
        for (let y = 0; y < line; y++) 
        {
            for (let x = 0; x < colonne; x++) 
            {
                let posX = 10 + (x + 0.5) * w / (colonne);
                let posY = Ecran_Hauteur / 2 + (y + 0.5) * h / (line)
                this.Briques.push(new Brique(posX,posY))
            }
        }


        Camera.X = Ecran_Largeur / 2 - this.BordL;
        Camera.Y = Ecran_Hauteur / 2;

        this.Background = new Lutin(Camera.X,Camera.Y, ["Images/Background.png"])
        this.Balle = new Balle(Ecran_Largeur / 2, Ecran_Hauteur / 4)
    }


    Calcul()
    {
        for (let b = 0; b < this.Briques.length; b++) 
        {
            this.Briques[b].Calcul();
        }

        this.Balle.Calcul();
    }


    Dessin(Context)
    {
        this.Background.Dessin(Context);

        Context.fillStyle = "black"
        Context.fillRect(0,0,this.BordL,Ecran_Hauteur);
        Context.fillRect(Ecran_Largeur - this.BordL,0,this.BordL,Ecran_Hauteur);

        for (let b = 0; b < this.Briques.length; b++) 
        {
            this.Briques[b].Dessin(Context);
        }
        this.Balle.Dire(this.Balle.Direction)
        this.Balle.Dessin(Context);
    }
}