class JeuPong
{
    static JeuLargeur;
    static JeuHauteur;

    constructor()
    {
        this.BordL = 200;
        this.Briques = [];


        let colonne = 15;
        let line = 15;
        JeuPong.JeuLargeur = Ecran_Largeur - 2 * this.BordL;
        JeuPong.JeuHauteur = Ecran_Hauteur;
        let marge = 50;
        let w = JeuPong.JeuLargeur - marge * 2;
        let h = Ecran_Hauteur / 2 - 10;
        for (let y = 0; y < line; y++) 
        {
            for (let x = 0; x < colonne; x++) 
            {
                let posX = marge + (x + 0.5) * w / (colonne);
                let posY = Ecran_Hauteur / 2 + (y + 0.5) * h / (line)
                this.Briques.push(new Brique(posX,posY))
            }
        }


        Camera.X = Ecran_Largeur / 2 - this.BordL;
        Camera.Y = Ecran_Hauteur / 2;

        this.Background = new Lutin(Camera.X,Camera.Y, ["Images/Background.png"])
        this.Balle = new Balle()
        this.Paddle = new Paddle(JeuPong.JeuLargeur / 2, 60)
    }


    Calcul()
    {
        this.Balle.Calcul();
        this.Paddle.Calcul();
        for (let b = 0; b < this.Briques.length; b++) 
        {
            this.Briques[b].Calcul();
        }

        this.Balle.Avancer(-this.Balle.Vitesse)
        for (let step = 0; step < this.Balle.Vitesse; step++) 
        {
            if (step == Math.floor(this.Balle.Vitesse))
                this.Balle.Avancer(this.Balle.Vitesse % 1)
            else
                this.Balle.Avancer(1)
            let balpos = new Vecteur2(this.Balle.X, this.Balle.Y)
            for (let b = 0; b < this.Briques.length; b++) 
            {
                this.Briques[b].Calcul();
                let val = this.Briques[b].Rectangle();
                let con = Contacts.CercleContreRectangle(val[0],val[1],val[2],val[3], balpos, this.Balle.Radius)
                if (con != 0)
                {
                    if (Vecteur2.Dot(con, this.Balle.VecteurDirection()) < 0)
                    {
                        this.Balle.Direction = Contacts.AngleRebond(con.Normaliser(), this.Balle.Direction)

                        
                        this.Briques.splice(b,1)
                        b -= 1;
                    }
                }
            }

            let val = this.Paddle.Rectangle();
            let con = Contacts.CercleContreRectangle(val[0],val[1],val[2],val[3], balpos, this.Balle.Radius)
            if (con != 0)
            {
                if (Vecteur2.Dot(con, this.Balle.VecteurDirection()) < 0)
                {
                    this.Balle.Direction = Contacts.AngleRebond(con.Normaliser(), this.Balle.Direction)
                    if(con.Y > 0)
                    {
                        this.Balle.Direction = 90 + 70 * Math.max(Math.min((this.Paddle.X - this.Balle.X) / (this.Balle.Radius + this.Paddle.Image.width / 2), 1),-1)
                    }
                }
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
        this.Paddle.Dessin(Context);
    }
}