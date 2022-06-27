class Inventaire extends UI_Panel
{
    constructor()
    {
        super(0,0,0,250,Game.Ecran_Hauteur)

        this.Titre = new UI_Label(0,0,1,this.CW,50,"Inventaire", this);
        this.Titre.FontTaille = 20;
        this.Titre.HorizontalAlignement = HorizontalAlignementType.Centre;


        this.ListeObjet = new UI_ListView(0,100,2,this.CW,this.CH - 100, this);
    }

    RefreshUI()
    {
        while (this.ListeObjet.Childrens.length > 0)
        {
            this.ListeObjet.RemoveChildren(this.ListeObjet.Childrens[0])
        }

        let keys = Object.keys(Player.Inventaire);
        for (let l = 0; l < keys.length; l++) {

            let nbr = Player.Inventaire[keys[l]];

            let p = new UIElement(0,0,0,this.ListeObjet.CW,24);
            p.Padding = [0,0,0,0];

            let a = new UI_Image("Images/IconSet.png",0,0,2, p)
            
            let id = 341 + Pierre.Objets.indexOf(keys[l]);
            let x = (id % 16) * 24;
            let y = Math.floor(id / 16) * 24;
            a.SourceRect = [x,y,24,24];
            
            let lab = new UI_Label(24,0,1,p.CW - 24,24, keys[l] + " X " + nbr, p);
            lab.HorizontalAlignement = HorizontalAlignementType.Gauche;
            lab.VerticalAlignement = VerticalAlignementType.Centre;
            lab.SourisCapture = false;

            this.ListeObjet.AjoutElement(p)
        }
        super.RefreshUI();
    }


}