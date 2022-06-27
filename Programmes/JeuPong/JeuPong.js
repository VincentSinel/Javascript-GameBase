class JeuPong extends Scene
{
    static JeuLargeur;
    static JeuHauteur;

    static BordL = 200

    constructor()
    {
        super("Pong")
        this.Briques = [];

        JeuPong.JeuLargeur = Game.Ecran_Largeur - 2 * JeuPong.BordL;
        JeuPong.JeuHauteur = Game.Ecran_Hauteur;

        // Création des briques
        let colonne = 15; // Nombre de colonne
        let line = 15; // Nombre de ligne
        let marge = 50; // Marge au bord de l'écran

        let w = JeuPong.JeuLargeur - marge * 2;
        let h = Game.Ecran_Hauteur / 2 - 10;
        for (let y = 0; y < line; y++) 
        {
            for (let x = 0; x < colonne; x++) 
            {
                let posX = marge + (x + 0.5) * w / (colonne);
                let posY = -Game.Ecran_Hauteur / 2 - (y + 0.5) * h / (line)
                this.Briques.push(this.AddChildren(new Brique(posX,posY)))
            }
        }

        this.Background = this.AddChildren(new Lutin(Game.Ecran_Largeur / 2 - JeuPong.BordL, -Game.Ecran_Hauteur / 2, ["Images/CasseBrique/Background.png"]));
        this.Background.Z = -500
        this.Balle = this.AddChildren(new Balle());
        this.Paddle = this.AddChildren(new Paddle(JeuPong.JeuLargeur / 2, -60));

        this.bruit = 0;
    }


    Calcul(Delta)
    {
        this.Background.X = Camera.X + (JeuPong.JeuLargeur / 2 - this.Paddle.X) / 50;
        this.Background.Y = Camera.Y;

        Camera.X = Game.Ecran_Largeur / 2 - JeuPong.BordL + (Math.random() - 0.5) * this.bruit;
        Camera.Y =  -Game.Ecran_Hauteur / 2 + (Math.random() - 0.5) * this.bruit;

        if (this.bruit > 0)
        {
            this.bruit -= Delta * 0.2;
        }
        else
        {
            this.bruit = 0;
        }

        let v = Vector.Zero;
        for (let b = 0; b < this.Briques.length; b++) 
        {
            let c = this.Balle.CercleCollision.collide_Overlap(this.Briques[b].CollisionRect)

             // Permet de limiter les angles faibles et donc le blocage de la balle en déplacement horizontal
            if (c.x != 0)
                c.x = c.x / Math.abs(c.x) // Remet la coordonée x à 1 ou -1
            if (c.y != 0)
                c.y = c.y / Math.abs(c.y) // Remet la coordonée y à 1 ou -1


            v = v.add(c) // Ajout du déplacement générale
            if (c.x != 0 || c.y != 0)
            {
                let a = this.Briques.splice(b,1) // Suppression de la brique
                this.RemoveChildren(a[0]);
                b -= 1;
                this.bruit = 5;
            }
        }
        if (v.x != 0 || v.y != 0)
        {
            this.Balle.X -= v.x;
            this.Balle.Y -= v.y;
            this.Balle.RadDirection = v.bounceDirection(this.Balle.RadDirection); // La balle rebondi
        }

        v = this.Balle.CercleCollision.collide_Overlap(this.Paddle.CollisionRect) // Collision avec le paddle
        if (v.x != 0 || v.y != 0)
        {
            this.Balle.X -= v.x;
            this.Balle.Y -= v.y;
            this.Balle.Direction = -90 - 70 * Math.max(Math.min((this.Paddle.X - this.Balle.X) / (this.Balle.Radius + this.Paddle.Image.width / 2), 1),-1);
        }
        if (this.Briques.length == 0)
        {
            this.Balle.BalleAttente = 60;
        }

        // Corrige la trajectoire si celle-ci est horizontal (permet de ne pas rester bloquer)
        if (Math.abs(this.Balle.Direction % Math.PI) < Math.PI / 18)
        {
            this.Balle.Direction += 0.1
        }
    }


    Dessin(Context)
    {
        Context.fillStyle = "black"
        Context.fillRect(0,0,JeuPong.BordL, Game.Ecran_Hauteur);
        Context.fillRect(Game.Ecran_Largeur - JeuPong.BordL, 0, JeuPong.BordL,Game.Ecran_Hauteur);
        
        if (this.Briques.length == 0)
        {
            Context.textAlign = "center";
            Context.fillStyle = "white"
            Context.font = "60px " + "Arial";
            Context.fillText("Bravo vous avez réussi", Game.Ecran_Largeur / 2, Game.Ecran_Hauteur / 2);
        }
    }
}