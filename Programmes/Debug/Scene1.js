class Scene1 extends Scene
{
    Exit()
    {
        this.RemoveChildren(Actor.Current);
    }
    Enter(X,Y)
    {
        super.Enter(X,Y)
        Actor.Current.X = X;
        Actor.Current.Y = Y;
        this.AddChildren(Actor.Current);
    }



    constructor()
    {
        super("Scene Test");

        //Test.GameSpeed = "bonjour"

        this.MenuTest();

        this.GameSpeed = 0.5;
        Debug.Parametre.Camera = false;

        //let lutin = new Lutin(0,0, ["Images/Chat.png"]);
        //this.Lutin3 = this.AddChildren(lutin);
        //this.Lutin3.CentreRotation = new Vector(0.5,1);
        //this.Lutin3.Dire("Long text avec de multiple ligne qui permet de tester la génération de taille ")

        let v = [new Vector(0,0), new Vector(60,0), new Vector(100,60), new Vector(80,120), new Vector(50,120)]

        //this.shape1 = new Circle(new Vector(0,0),50);
        //this.shape3 = Polygon.Regular(new Vector(200,-200),6,100)//new Polygon(new Vector(200,-200), v)
        //this.shape2 = Rectangle.FromPosition(200,200,50,50,Math.PI / 9)


        this.PNJ1 = this.AddChildren(new PNJ_RPGMaker(50,0, "Images/Joueur/Perso.png", false,2));

        //this.Lutin3.Direction = Math.random() * 360;

        let tilemap = new TileMap( 0, 0, 50, 50);
        this.Tilemap = this.AddChildren(tilemap);
        this.Tilemap.AddLayer("Couche1", -100000000,32);
        //this.Tilemap.Charger("Terrain1");
        //this.Tilemap.Edition();

        //this.menu = new UI_Image("Images/Moto/Aiguille.png",200, 200, 10000);
        //this.menu.CentreRotation = new Vector(7.5 / 68, 0.5);

        //this.textboxtest = new UI_TextBox(500,500,200,200,"","Tooltip")

        //new UI_Slider(200,200,1,200,30,0,100);
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

        Camera.Zoom = 1.5;

        this.Triangle = [
            new Vector(Math.random() * 500,Math.random() * 500), 
            new Vector(Math.random() * 500,Math.random() * 500), 
            new Vector(Math.random() * 500,Math.random() * 500)
        ]

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

    Calcul(Delta)
    {
        super.Calcul(Delta)

        this.MenuUpdate(Delta)
        //this.menu.Angle += Math.PI / 180
        //this.menu.ScaleX =  1 + Math.cos(Game.TotalFrame * Math.PI / 125) * 0.5;
        //this.menu.ScaleY =  1 + Math.cos(Game.TotalFrame * Math.PI / 125) * 0.5;
        // if(Clavier.ToucheBasse("ArrowUp"))
        // {
        //     this.Lutin3.Y -= speed
        // }
        // if(Clavier.ToucheBasse("ArrowDown"))
        // {
        //     this.Lutin3.Y += 2
        // }
        // if(Clavier.ToucheBasse("ArrowLeft"))
        // {
        //     this.Lutin3.X -= 2
        // }
        // if(Clavier.ToucheBasse("ArrowRight"))
        // {
        //     this.Lutin3.X += 2
        // }
        // if(Clavier.ToucheJusteBasse("p"))
        // {
        //     console.log(this.lutins[0])
        // }
        //this.shape1.x = Camera.X;
        //this.shape1.y = Camera.Y;

        //this.Lutin3.Z = -this.Lutin3.Y;
        //this.Lutin3.Direction += 2

        //for (let l = 0; l < this.lutins.length; l++) 
       // {
        //    this.lutins[l].Direction += 0.1 * Delta;
        //}
        
        //Debug.AjoutCercle(this.shape1, "RED")
        // let a = this.shape1.collide_Overlap(this.shape2)
        // let b = this.shape1.collide_Overlap(this.shape3)
        // let color = "Magenta"
        // if (a.x != 0 || a.y != 0)
        // {
        //     color = "Green"
        //     //Camera.X -= a.x;
        //     //Camera.Y -= a.y;
        //     this.shape1.x = Camera.X;
        //     this.shape1.y = Camera.Y;
        // }
        // //Debug.AjoutRectangle(this.shape2, color)
        // color = "Blue"
        // if (b.x != 0 || b.y != 0)
        // {
        //     color = "cyan"
        //     //Camera.X -= b.x;
        //     //Camera.Y -= b.y;
        //     this.shape1.x = Camera.X;
        //     this.shape1.y = Camera.Y;
        // }
        //Debug.AjoutPolygone(this.shape3, color)
        //Debug.AjoutVecteur(this.Triangle[0], this.Triangle[0].to(this.Triangle[1]),color)
        //Debug.AjoutVecteur(this.Triangle[1], this.Triangle[1].to(this.Triangle[2]),color)
        //Debug.AjoutVecteur(this.Triangle[2], this.Triangle[2].to(this.Triangle[0]),color)
        //Debug.AjoutVecteur(this.Lutin2.TopLeftAngle, this.Lutin2.size)
        //Debug.AjoutVecteur(this.Lutin3.TopLeftAngle, this.Lutin3.size)
        //if (this.Lutin3.Children.length > 0)
        //    Debug.AjoutVecteur(this.Lutin3.GPosition, this.Lutin3.GPosition.to(this.Lutin3.Children[0].GPosition), "red");
    }

    MenuTest()
    {
        let a = 5
        this.Win = new UI_Window(20,20,30,500,500);
        let panel = new UI_Panel();
        panel.H = UI_Element_Alignement.STRETCH;
        let stack = new UI_TextBox();


        //stack.W = UI_Element_Alignement.STRETCH;
        //stack.H = 5;
        //stack.TotalSize = 2000;
        // for (let i = 0; i < a; i++) {

        //     stack.AddColumn(Math.random() > 0.5 ? UI_Grid_Column.Star(1) : UI_Grid_Column.Auto())  
        //     stack.AddRow(Math.random() > 0.5 ? UI_Grid_Row.Star(1) : UI_Grid_Row.Auto())   
        // }
        //stack.Columns[2].Type = UI_Grid_Length.Type_Auto;
        //panel.Margin.left = panel.EpaisseurBord * 2;
        //panel.Margin.right = panel.EpaisseurBord * 2;
        //panel.Margin.up = panel.EpaisseurBord * 2;
        //panel.Margin.down = panel.EpaisseurBord * 2;

        // for (let i = 0; i < 25; i++) {
        //     let button = new UI_Label(i);
        //     button.HorizontalAlignement = HorizontalAlignementType.Left;
        //     button.VerticalAlignement = VerticalAlignementType.Center;
        //     //button.X = Math.random() * 500;
        //     //button.Y = Math.random() * 500;
        //     button.H = 30;//UI_Element_Alignement.AUTO;
        //     //button.W = 30 + Math.random() * 500;
        //     //button.H = 30 + Math.random() * 500;
        //     //button.MinW = 30;
        //     //button.MinH = 30;
        //     //button.Grid_Column = i % a;
        //     //button.Grid_Row = Math.floor(i / a);
        //     //button.SetTexte("" + i)
        //     stack.AddChildren(button);
        // }
        // let button1 = new UI_Button();
        // let button2 = new UI_Button();
        // button1.SetTexte("Boutton 1")
        // button2.SetTexte("Boutton 2")
        //button2.Y = 30;
        //panel2.H = -2;
        //panel2.Margin.up = 5;
        //panel2.Margin.down = 5;
        // stack.AddChildren(button1);
        // stack.AddChildren(button2);
        panel.AddChildren(stack);

        this.Win.AddChildren(panel);

        this.Win.Show();
    }

    SliderTest()
    {

    }

    ListeTest()
    {
        this.Win = new UI_Window(20,20,30,500,500);
        let panel = new UI_Panel();
        panel.H = UI_Element_Alignement.STRETCH;

        let list = new UI_ListView();
        for (let i = 0; i < 25; i++) {
            let label = new UI_Label(i);
            label.HorizontalAlignement = HorizontalAlignementType.Left;
            label.VerticalAlignement = VerticalAlignementType.Center;
            label.H = 30;
            list.AddChildren(label);
        }
        panel.AddChildren(list);

        this.Win.AddChildren(panel);

        this.Win.Show();
    }

    MenuUpdate(Delta)
    {
        //this.Win.W = 300 + Math.cos(Game.TotalFrame / 100) * 100;
        //this.Win.H = 300 + Math.cos(Game.TotalFrame / 100) * 100;
    }
}