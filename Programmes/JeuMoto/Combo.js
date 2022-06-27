class Combo extends Drawable
{
    static Lettre = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","!","?"," "];

    constructor()
    {
        super(0,0,20000)
        this.Multiplicateur = 1;
        this.Score = 0;
        this.Flamme = this.AddChildren(new Lutin_SC(270 - Game.Ecran_Largeur / 2, 235,"Images/Moto/FlammeAnimation.png", [200,70]));
        this.Flamme.NextUpdate = 6;
        this.Flamme.Z = -2;
        this.TMultiplicateur = Textures.Charger("Images/Moto/Multiplicateur.png");
        this.TScore = Textures.Charger("Images/Moto/Score.png");
        this.TVie = Textures.Charger("Images/Moto/Moto1.png");

        this.ScoreGlobal = 0;
        this.LastScore = [];
        this.TimerAnimation = [];

        this.Textes = ["bravo !", "incroyable !", "wow !", "super !", "genial !"];
        this.Message = "";
        this.TimerMessage = 0;
        this.TailleMessage = 20;
        this.AngleMessage = 0;
        this.HightScore = 0;
    }

    Calcul(Delta)
    {
        this.X = Camera.X;
        this.Y = Camera.Y;

        this.Flamme.Calcul(Delta);
        if (this.Flamme.NextUpdate < this.Flamme.Time)
        {
            this.Flamme.NextUpdate += 6;
            this.Flamme.CostumeSuivant();
        }

        if (this.Scene.Moto.Direction < -10 && !this.Scene.Moto.Mort)
        {
            this.Score += this.Multiplicateur;
            let xm = this.Scene.Moto.ColRect.x;
            for (let v = 0; v < this.Scene.Voitures.length; v++) {
                const element = this.Scene.Voitures[v];
                if (!element.MultiplicateurAjouté)
                {
                    let h = element.ColRect.h + this.Scene.Moto.ColRect.h + 100;
                    let y = element.ColRect.y + element.ColRect.h / 2 + h / 2;
                    if (this.Scene.Moto.Y <= y && this.Scene.Moto.Y >= y - h)
                    {
                        if ((xm + this.Scene.Moto.ColRect.w) >=  element.ColRect.x && xm <= element.ColRect.x + element.ColRect.w)
                        {
                            element.MultiplicateurAjouté = true;
                            this.Multiplicateur += 1
                            this.TimerMessage = 0
                            this.Message = this.Textes[Math.floor(Math.random() * this.Textes.length)];
                            this.TailleMessage = 20 +  35 / Math.max(1, (Math.abs(this.Scene.Moto.Y - (y - h/2))- 40) / 5);
                            this.AngleMessage = Math.random() * 40 - 20
                        }
                    }
                }
            }
        }
        else if (this.Scene.Moto.Mort)
        {
            this.Score = 0;
            this.Multiplicateur = 1;
        }
        else if (this.Scene.Moto.Direction == 0 && this.Score > 0)
        {
            this.LastScore.push(this.Score * this.Multiplicateur);
            this.TimerAnimation.push(0);
            let i = Math.floor(Math.max(0,Math.log10(this.ScoreGlobal + 1) - 4));
            this.ScoreGlobal += this.Score * this.Multiplicateur;
            let j = Math.log10(this.ScoreGlobal + 1) - 4 - i;
            if (j > 1)
            {
                this.Scene.Moto.Vie += Math.floor(j);
            }
            this.Score = 0;
            this.Multiplicateur = 1;

        }

        if (this.Multiplicateur > 3)
        {
            this.Flamme.Show();
        }
        else{
            this.Flamme.Hide();
        }
    }

    Dessin(Context)
    {
        if (this.Multiplicateur > 1)
        {
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
        this.DessinVie(Context);

        this.DessinFinPartie(Context)
    }

    DessinMultiplicateur(Context)
    {
        let size = 40 + 30 * Math.min(this.Multiplicateur, 8) / 6;
        let x = this.Flamme.X - 100;
        let y = this.Flamme.Y - 35;
        let bx = (Math.random() - 0.5) * Math.min(10, (this.Multiplicateur - 1));
        let by = (Math.random() - 0.5) * Math.min(10, (this.Multiplicateur - 1));
        Context.drawImage(this.TMultiplicateur, 0, 0, 90, 90, 
            x + bx, y + by, size, size);
        x += size;
        let t = this.Multiplicateur.toString();
        for (let i = 0; i < t.length; i++) {
            let posx = (parseInt(t[i]) + 1) * 90;
            Context.drawImage(this.TMultiplicateur, posx, 0, 90, 90, 
                x + bx, y + by, size, size);
            x += size;
            
        }
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

        let x = Camera.AdapteX(this.Scene.Moto.X + 40) + Math.max(-size * t.length / 2, 40 - Game.Ecran_Largeur / 2);
        let y = Camera.AdapteY(this.Scene.Moto.Y + 25 + position)
        Context.globalAlpha = alpha;

        for (let i = 0; i < t.length; i++) {
            let posx = ((parseInt(t[i])) % 6) * 54;
            let posy = Math.floor((parseInt(t[i])) / 6) * 54;
            Context.drawImage(this.TScore, posx, posy, 54, 54, 
                x + bx, y + by, size, size);
            x += size;
        }
        Context.globalAlpha = 1;
    }

    DessinTexte(Context, txt, position = 0, taille = 0, alpha = 1.0, tremblement = 0)
    {
        let w = txt.length * taille;

        let bx = tremblement * (Math.random() - 0.5);
        let by = tremblement * (Math.random() - 0.5);

        Context.globalAlpha = alpha;


        let x = Camera.AdapteX(Camera.X + Game.Ecran_Largeur / 2 - 200 - position) - w/2;
        let y = 0
        for (let i = 0; i < txt.length; i++) {
            let id = Combo.Lettre.indexOf(txt[i]);
            let posx = (id % 6) * 54;
            let posy = Math.floor(id / 6) * 54;
            Context.drawImage(this.TScore, posx, posy, 54, 54, 
                x + bx, y + by, taille, taille);
            x += taille;
        }
        Context.globalAlpha = 1;
    }

    DessinScoreGeneral(Context)
    {;
        let size =  30;
        let t = this.ScoreGlobal.toString();

        let x = -Game.Ecran_Largeur / 2;
        let y = -Game.Ecran_Hauteur / 2;
        Context.drawImage(this.TScore, 54 * 4, 54 * 4, 54, 54, //S
            x, y, size, size);
        x += size;
        Context.drawImage(this.TScore, 0, 54 * 2, 54, 54, //C
            x, y, size, size);
        x += size;
        Context.drawImage(this.TScore, 0, 54 * 4, 54, 54, //O
            x, y, size, size);
        x += size;
        Context.drawImage(this.TScore, 54 * 3, 54 * 4, 54, 54, //R 
            x, y, size, size);
        x += size;
        Context.drawImage(this.TScore, 54 * 2, 54 * 2, 54, 54, //E
            x, y, size, size);
        x += size;
        x += size;
        x += size;

        for (let i = 0; i < t.length; i++) {
            let posx = ((parseInt(t[i])) % 6) * 54;
            let posy = Math.floor((parseInt(t[i])) / 6) * 54;
            Context.drawImage(this.TScore, posx, posy, 54, 54, 
                x, y, size, size);
            x += size;
        }
    }

    DessinVie(Context)
    {
        let vie = this.Scene.Moto.Vie
        let size = 0.4;
        let w = this.TVie.width *size;
        let h = this.TVie.height * size;

        let x = Camera.AdapteX(Camera.X + Game.Ecran_Largeur / 2 - 5 - w);
        let y = Camera.AdapteY(Camera.Y + Game.Ecran_Hauteur / 2 - 5 - h);
        if (vie < 4)
        {
            for(let i = 0; i < vie; i++)
            {
                Context.drawImage(this.TVie, x - w * i, y, w, h);
            }
        }
        else
        {
            let s = 40;
            let t = vie.toString();
            x -= (t.length + 1 ) * s + 5
            Context.drawImage(this.TVie, x, y, w, h);
            x += w;
            y = y + h /2 - s / 2
            Context.drawImage(this.TMultiplicateur, 0, 0, 90, 90, //X
            x, y, s, s);
            x += s + 5;
            for (let i = 0; i < t.length; i++) {
                Context.drawImage(this.TMultiplicateur, 90 + parseInt(t[i]) * 90, 0, 90, 90, 
                    x, y, s, s);
                x += s;
            }
        }
    }

    DessinFinPartie(Context)
    {
        if (this.Scene.Moto.Vie == 0)
        {
            if (this.ScoreGlobal >= this.HightScore)
            {
                let size = 60;
                let t = ["nouveau","meilleur","score",this.ScoreGlobal.toString() + " pts"];
                let y = Camera.AdapteY(Camera.Y) - size * t.length / 2;
                for (let i = 0; i < t.length; i++) {
                    
                    let x = Camera.AdapteX(Camera.X) - (size * t[i].length) / 2;
                    if (i < 3)
                        this.DessinTexteScore(Context,t[i],x + (Math.random() - 0.5) * 3,y + (Math.random() - 0.5) * 3,size);
                    else
                        this.DessinTexteScore(Context,t[i],x,y,size);
                    y += size;
                }
                this.HightScore = this.ScoreGlobal;
            }
            else
            {
                let size = 60;
                let t = [this.ScoreGlobal.toString() + " pts","meilleur","score",this.HightScore.toString() + " pts"];
                let y = Camera.AdapteY(Camera.Y) - size * t.length / 2;
                for (let i = 0; i < t.length; i++) {
                    
                    let x = Camera.AdapteX(Camera.X) - (size * t[i].length) / 2;
                    if (i < 1)
                        this.DessinTexteScore(Context,t[i],x + (Math.random() - 0.5) * 3,y + (Math.random() - 0.5) * 3,size);
                    else
                        this.DessinTexteScore(Context,t[i],x,y,size);
                    y += size;
                }
            }
        }
    }

    DessinTexteScore(Context,t,x,y,size)
    {
        for(let i = 0; i < t.length; i++)
        {
            let id = Combo.Lettre.indexOf(t[i]);
            let posx = (id % 6) * 54;
            let posy = Math.floor(id / 6) * 54;
            Context.drawImage(this.TScore, posx, posy, 54, 54, 
                x + i * size, y, size, size);
        }
    }
}