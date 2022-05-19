class Scene1 extends Scene
{
    constructor()
    {
        super("Scene Test");

        this.LoadTilemap()

        let lutin = new Lutin(0,0, ["Images/Moto/Moto1.png"]);
        this.Lutin3 = this.AjoutEnfant(lutin);
        this.Lutin3.CentreRotation = new Vector(0.5,1);
        this.Lutin3.Dire("Long text avec de multiple ligne qui permet de tester la génération de taille ")
        //this.Lutin3.Direction = Math.random() * 360;

        let tilemap = new TileMap( 0, 0, 50, 50);
        this.Tilemap = this.AjoutEnfant(tilemap);
        this.Tilemap.Charger("Terrain1");
        this.Tilemap.Edition();


        new UI_Slider(200,200,1,200,30,0,100);
        //new UI_Button(400,400,2,200,200,"test");

        //for (let test = 0; test < 40; test++) {
        //    l.AjoutElement("Test " + test)
        //}

        //let t = "test"
        //for (let b = 0; b < 120; b++) {
        //    t += " test"
        //}
        //a.Texte = t;

        //l.Elements[8].Contenue.Texte = "Long text avec de multiple ligne qui permet de teste la génération de taille"


        //this.Tilemap.AddLayer("Sol", -20, 16);
        //this.Tilemap.AddLayer("Millieu", -20);
        //this.Tilemap.AddLayer("Haut Dessus", -20);
        /* for (let index = 0; index < 3; index++) {
            this.Tilemap.AddLayer("part " + index, -20 + 5 * index, 16);

            for(let x = 0; x < this.Tilemap.W; x++)
            {
                for(let y = 0; y < this.Tilemap.H; y++)
                {
                    let r = Math.random()
                    if (r > 0.5)
                    {
                        r = Math.floor(Math.random() * Tilesets.TileNbr);
                        //this.Tilemap.Layers["part " + index].ChangerTile(x, y, 0);
                    }
                }
            }
        } */
        /* for(let x = 0; x < this.Tilemap.W; x++)
        {
            for(let y = 0; y < this.Tilemap.H; y++)
            {
                let r = Math.random()
                if (r > 0.5)
                {
                    //this.Tilemap.Layers.collision.ChangerTile(x, y, 1);
                }
            }
        } */

        Camera.Zoom = 0.2;

        this.lutins = [];
        for (let i = 0; i < 0; i++) 
        {
            let x = 300//(Math.random() - 0.5) * 1000;
            let y = 0//(Math.random() - 0.5) * 1000;
            let d = 0//Math.random() * 360;
            const lut = new LutinTest(x,y);
            lut.Direction = d;
            this.lutins.push(lut);
            if (i > 0)
                this.lutins[i-1].AddChildren(lut);
            else
                this.Lutin3.AddChildren(this.lutins[0]);
        }

        //this.Lutin1 = this.AjoutEnfant(new LutinTest(200,200));
        //this.Lutin2 = this.AjoutEnfant(new LutinTest(-200,-200));
        //this.Lutin1.CentreRotation = new Vector(0.5,1);
        //this.Lutin2.CentreRotation = new Vector(0.5,1);
        //this.Lutin2.Zoom = 20;
    }


    LoadTilemap()
    {
        Tilesets.Add_Auto("Images/Tilemap/A1_Eau1.png", "A1");
        Tilesets.Add_Auto("Images/Tilemap/A2_Extérieur2.png", "A2");
        Tilesets.Add_Auto("Images/Tilemap/A3_Mur1.png", "A3");
        Tilesets.Add_Auto("Images/Tilemap/A4_Mur1.png", "A4");
        Tilesets.Add_Auto("Images/Tilemap/A5_Extérieur7.png", "A5");
        Tilesets.Add_Auto("Images/Tilemap/A5_Intérieur8.png", "A5");
        Tilesets.Add_Animation("Images/Tilemap/Water.png");
    }

    Calcul(Delta)
    {
        super.Calcul(Delta)
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
        if(Clavier.ToucheJusteBasse("p"))
        {
            console.log(this.lutins[0])
        }
        //this.Lutin3.Z = -this.Lutin3.Y;
        //this.Lutin3.Direction += 2

        //for (let l = 0; l < this.lutins.length; l++) 
       // {
        //    this.lutins[l].Direction += 0.1 * Delta;
        //}

        //Debug.AjoutVecteur(this.Lutin1.TopLeftAngle, this.Lutin1.size)
        //Debug.AjoutVecteur(this.Lutin2.TopLeftAngle, this.Lutin2.size)
        //Debug.AjoutVecteur(this.Lutin3.TopLeftAngle, this.Lutin3.size)
        //if (this.Lutin3.Children.length > 0)
        //    Debug.AjoutVecteur(this.Lutin3.GPosition, this.Lutin3.GPosition.to(this.Lutin3.Children[0].GPosition), "red");
    }
}