class Combo
{
    static Lettre = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","!","?"," "];

    constructor()
    {
        this.Multiplicateur = 1;
        this.Score = 0;
        this.Flamme = new Lutin_SC(0, -235,"Images/Moto/FlammeAnimation.png", [200,70]);
        this.Flamme.NextUpdate = 6;
        this.TMultiplicateur = Textures.Charger("Images/Moto/Multiplicateur.png");
        this.TScore = Textures.Charger("Images/Moto/Score.png");

        this.ScoreGlobal = 0;
        this.LastScore = [];
        this.TimerAnimation = [];

        this.Textes = ["bravo !", "incroyable !", "wow !", "super !", "genial !"];
        this.Message = "";
        this.TimerMessage = 0;
        this.TailleMessage = 20;
        this.AngleMessage = 0;
    }

    Calcul(Delta)
    {
        this.Flamme.Calcul(Delta);
        this.Flamme.X = Camera.X - Ecran_Largeur / 2 + 270;
        if (this.Flamme.NextUpdate < this.Flamme.Time)
        {
            this.Flamme.NextUpdate += 6;
            this.Flamme.CostumeSuivant();
        }

        if (JeuMoto.Moto.Direction > 10 && !JeuMoto.Moto.Mort)
        {
            this.Score += this.Multiplicateur;
            let xm = JeuMoto.Moto.ColRect[0];
            for (let v = 0; v < JeuMoto.Voitures.length; v++) {
                const element = JeuMoto.Voitures[v];
                if (!element.MultiplicateurAjouté)
                {
                    let h = element.ColRect[3] + JeuMoto.Moto.ColRect[3] + 100;
                    let y = element.ColRect[1] + element.ColRect[3] / 2 + h / 2;
                    if (JeuMoto.Moto.Y <= y && JeuMoto.Moto.Y >= y - h)
                    {
                        if ((xm + JeuMoto.Moto.ColRect[2]) >=  element.ColRect[0] && xm <= element.ColRect[0] + element.ColRect[2])
                        {
                            element.MultiplicateurAjouté = true;
                            this.Multiplicateur += 1
                            this.TimerMessage = 0
                            this.Message = this.Textes[Math.floor(Math.random() * this.Textes.length)];
                            this.TailleMessage = 20 +  35 / Math.max(1, (Math.abs(JeuMoto.Moto.Y - (y - h/2))- 40) / 5);
                            this.AngleMessage = Math.random() * 40 - 20
                        }
                    }
                }
            }
        }
        else if (JeuMoto.Moto.Mort)
        {
            this.Score = 0;
            this.Multiplicateur = 1;
        }
        else if (JeuMoto.Moto.Direction == 0 && this.Score > 0)
        {
            this.LastScore.push(this.Score * this.Multiplicateur);
            this.TimerAnimation.push(0);
            this.ScoreGlobal += this.Score * this.Multiplicateur;
            this.Score = 0;
            this.Multiplicateur = 1;
        }
    }

    Dessin(Context)
    {
        if (this.Multiplicateur > 1)
        {
            if (this.Multiplicateur > 3)
            {
                this.Flamme.Dessin(Context);
            }
            this.DessinMultiplicateur(Context);
        }

        this.DessinScore(Context, this.Score);
        let i = 0;
        while (i < this.LastScore.length)
        {
            this.DessinScore(Context, this.LastScore[i], this.TimerAnimation[i]/3, 1 - this.TimerAnimation[i] / 180);
            this.TimerAnimation[i] += 1;
            if (this.TimerAnimation[i] >= 180)
            {
                this.TimerAnimation.splice(i,1)
                this.LastScore.splice(i,1)
            }
            else
            {
                i++;
            }
        }
        this.DessinScoreGeneral(Context);

        
        if (this.Message != "")
        {
            this.DessinTexte(Context, this.Message, this.TimerMessage/3, this.TailleMessage, 1 - this.TimerMessage / 180);
            this.TimerMessage += 1;
            if (this.TimerMessage >= 180)
            {
                this.TimerMessage = 0
                this.Message = "";
            }
        }
    }

    DessinMultiplicateur(Context)
    {
        // Sauvegarde la position actuel du canvas 
        Context.save();
        // Adapte la position à celle de la camera
        Camera.DeplacerCanvas(Context)
        // Translate le canvas au centre de notre lutin 
        Context.translate(Camera.AdapteX(this.Flamme.X), Camera.AdapteY(this.Flamme.Y));
        // Déplace le canvas à l'angle haut droit de l'image
        Context.translate(-80, -35); 

        let size = 40 + 30 * Math.min(this.Multiplicateur, 8) / 6;
        let x = 0;
        let bx = (Math.random() - 0.5) * Math.min(10, (this.Multiplicateur - 1));
        let by = (Math.random() - 0.5) * Math.min(10, (this.Multiplicateur - 1));
        Context.drawImage(this.TMultiplicateur, 0, 0, 90, 90, 
            x + bx, by, size, size);
        x += size;
        let t = this.Multiplicateur.toString();
        for (let i = 0; i < t.length; i++) {
            let posx = (parseInt(t[i]) + 1) * 90;
            Context.drawImage(this.TMultiplicateur, posx, 0, 90, 90, 
                x + bx, by, size, size);
            x += size;
            
        }

        // Retourne à la position initiale du canvas
        Context.restore(); 
    }

    DessinScore(Context, value, position = 0, alpha = 1.0)
    {
        if (value == 0)
            return;
        let move = (1-Math.pow(Math.E, - value / 200000));
        let size =  16 + 14 * move;
        let t = value.toString();
        let bx = 0, by = 0
        if (alpha != 1)
        {
            bx = move * (Math.random() - 0.5) * 5;
            by = move * (Math.random() - 0.5) * 5;
        }

        // Sauvegarde la position actuel du canvas 
        Context.save();
        // Adapte la position à celle de la camera
        Camera.DeplacerCanvas(Context)
        // Translate le canvas au centre de notre lutin 
        Context.translate(Camera.AdapteX(JeuMoto.Moto.X + 40), Camera.AdapteY(JeuMoto.Moto.Y - 25 - position)); 
        // Déplace le canvas à l'angle haut droit de l'image
        Context.translate(Math.max(-size * t.length / 2, 40 - Ecran_Largeur / 2), 0); 
        Context.globalAlpha = alpha;


        let x = 0;
        for (let i = 0; i < t.length; i++) {
            let posx = ((parseInt(t[i])) % 6) * 54;
            let posy = Math.floor((parseInt(t[i])) / 6) * 54;
            Context.drawImage(this.TScore, posx, posy, 54, 54, 
                x + bx, 0 + by, size, size);
            x += size;
        }
        // Retourne à la position initiale du canvas
        Context.restore(); 
    }

    DessinTexte(Context, txt, position = 0, taille = 0, alpha = 1.0, tremblement = 0)
    {
        let w = txt.length * taille;

        let bx = tremblement * (Math.random() - 0.5);
        let by = tremblement * (Math.random() - 0.5);
        // Sauvegarde la position actuel du canvas 
        Context.save();
        // Adapte la position à celle de la camera
        Camera.DeplacerCanvas(Context)
        // Translate le canvas au centre de notre lutin 
        Context.translate(Camera.AdapteX(Camera.X + Ecran_Largeur / 2 - 200 - position), Camera.AdapteY(Camera.Y)); 
        // Tourne le canvas de l'angle souhaité
        Context.rotate(-this.AngleMessage * Math.PI / 180);  
        // Déplace le canvas à l'angle haut droit de l'image
        Context.translate(-w/2, -taille/2); 

        Context.globalAlpha = alpha;


        let x = 0;
        for (let i = 0; i < txt.length; i++) {
            let id = Combo.Lettre.indexOf(txt[i]);
            let posx = (id % 6) * 54;
            let posy = Math.floor(id / 6) * 54;
            Context.drawImage(this.TScore, posx, posy, 54, 54, 
                x + bx, 0 + by, taille, taille);
            x += taille;
        }
        // Retourne à la position initiale du canvas
        Context.restore(); 
    }

    DessinScoreGeneral(Context)
    {;
        let size =  30;
        let t = this.ScoreGlobal.toString();

        // Sauvegarde la position actuel du canvas 
        Context.save();
        // Adapte la position à celle de la camera
        Camera.DeplacerCanvas(Context)
        // Translate le canvas au centre de notre lutin 
        Context.translate(Camera.AdapteX(Camera.X - Ecran_Largeur / 2 + 50), Camera.AdapteY(Camera.Y + Ecran_Hauteur / 2 - 10));

        let x = 0;
        Context.drawImage(this.TScore, 54 * 4, 54 * 4, 54, 54, //S
            x, 0, size, size);
        x += size;
        Context.drawImage(this.TScore, 0, 54 * 2, 54, 54, //C
            x, 0, size, size);
        x += size;
        Context.drawImage(this.TScore, 0, 54 * 4, 54, 54, //O
            x, 0, size, size);
        x += size;
        Context.drawImage(this.TScore, 54 * 3, 54 * 4, 54, 54, //R 
            x, 0, size, size);
        x += size;
        Context.drawImage(this.TScore, 54 * 2, 54 * 2, 54, 54, //E
            x, 0, size, size);
        x += size;
        x += size;
        x += size;

        for (let i = 0; i < t.length; i++) {
            let posx = ((parseInt(t[i])) % 6) * 54;
            let posy = Math.floor((parseInt(t[i])) / 6) * 54;
            Context.drawImage(this.TScore, posx, posy, 54, 54, 
                x, 0, size, size);
            x += size;
        }
        // Retourne à la position initiale du canvas
        Context.restore(); 
    }
}