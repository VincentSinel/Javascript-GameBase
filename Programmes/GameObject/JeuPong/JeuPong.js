class JeuPong
{
    static JeuLargeur;
    static JeuHauteur;

    constructor()
    {
        this.BordL = 200;
        this.Briques = [];


        let colonne = 1
        let line = 1;
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
        this.Balle = new Balle(JeuPong.JeuLargeur / 2, JeuPong.JeuHauteur / 4)
    }


    Calcul()
    {
        this.Balle.Calcul();

        let balpos = new Vecteur2(this.Balle.X, this.Balle.Y)
        for (let b = 0; b < this.Briques.length; b++) 
        {
            this.Briques[b].Calcul();
            let val = this.Briques[b].Rectangle();
            let con = Contacts.CercleContreRectangle(val[0],val[1],val[2],val[3],balpos, this.Balle.Radius)
            this.Briques[b].Dire(this.Briques[b].ToucheSouris());
            if (con != 0)
            {
                this.Balle.Dire(con.X + ";" + con.Y)

                let n = con.Normaliser();
                let v = this.Balle.VecteurDirection()
                let u = n.Normaliser(Vecteur2.Dot(v, n))
                let w = Vecteur2.AVersB(u,v);
                this.Balle.Direction = Math.atan2(w.Y - u.Y,w.X - u.X)

            }
        }


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
        this.Balle.Dessin(Context);
    }
}