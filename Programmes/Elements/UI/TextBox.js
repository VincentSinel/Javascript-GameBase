
class TextBox extends UIElement
{
    // Liste des charactère accepté par la boite de texte
    static Characters = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+-*/.,;:!?ù%µ$£¤âêîôûäëïöüéèà&\"#'{([-|àìòù_ç@)]=}<>ñã§"

    /**
     * Créer un TextBox pour interface utilisateur. C'est un block de texte editable par l'utilisateur.
     * Utiliser Slider.Texte pour récuperer le contenue. /!\ L'assignation peut casser la position du curseur.
     * @param {Number} X Position X relative à l'objet parent
     * @param {Number} Y Position Y relative à l'objet parent
     * @param {Number} W Largeur du TextBox
     * @param {Number} Texte Texte à initialiser dans la boite
     * @param {Number} Tooltip Texte à afficher lorsque la boite est vide (facultatif)
     * @param {UIElement} Parent Objet Parent (facultatif)
     */
    constructor(X,Y,W,Texte, Tooltip = "", Parent = undefined)
    {
        super(X,Y,W,0, Parent)
        this.Texte = Texte;
        this.Tooltip = Tooltip;

        this.H = this.FontTaille + 6

        this.Selected = false;
        this.Etat = "Base"
        this.Couleur = UIElement.BaseCouleur;
        this.CursorPosition = Texte.length;
        this.Attente = 0;
    }


    Calcul()
    {
        super.Calcul()

        if (this.Attente > 0)
            this.Attente -=1

        this.H = this.FontTaille + 6
        if (this.Actif)
        {
            if (Souris.CX >= this.GX() && Souris.CX <= this.GX() + this.W && Souris.CY >= this.GY() && Souris.CY <= this.GY() + this.H)
            {
                this.Couleur = this.SelectionCouleur
                if (Souris.BoutonJustDeclic(0))
                {
                    this.Selected = true;
                }
            }
            else
            {
                this.Etat = "Base"
                this.Couleur = this.BaseCouleur
                if (Souris.BoutonClic(0))
                {
                    this.Selected = false;
                }
            }

            if(this.Selected)
            {
                if(Clavier.ToucheJusteBasse("ArrowLeft"))
                {
                    this.CursorPosition -= 1
                    this.CursorPosition = Math.max(this.CursorPosition, 0)
                }
                if (Clavier.ToucheJusteBasse("ArrowRight"))
                {
                    this.CursorPosition += 1
                    this.CursorPosition = Math.min(this.CursorPosition, this.Texte.length)
                }

                for (let index = 0; index < Clavier.JustPressed.length; index++) {
                    const element = Clavier.JustPressed[index];
                    if (TextBox.Characters.includes(element))
                    {
                        this.Texte = this.Texte.substring(0,this.CursorPosition) + element + this.Texte.substring(this.CursorPosition);
                        this.CursorPosition += 1;
                    }
                    if (element == "Backspace")
                    {
                        this.Texte = this.Texte.substring(0,this.CursorPosition - 1) + this.Texte.substring(this.CursorPosition);
                        this.CursorPosition -= 1
                        this.CursorPosition = Math.max(this.CursorPosition, 0)
                        this.Attente = 20
                    }
                }

                if (Clavier.ToucheBasse("Backspace") && this.Attente == 0)
                {
                    this.Texte = this.Texte.substring(0,this.CursorPosition - 1) + this.Texte.substring(this.CursorPosition);
                    this.CursorPosition -= 1
                    this.CursorPosition = Math.max(this.CursorPosition, 0)
                    this.Attente = 2
                }
                
                if (Clavier.ToucheJusteBasse("Enter"))
                {
                    this.Selected = false;
                }
            }
        }
        else
        {
            this.Couleur = this.InactifCouleur
        }
    }

    Dessin(Context)
    {
        this.DessinPanneau(Context)

        super.Dessin(Context)
    }


    DessinPanneau(Context)
    {
        let Contour = this.Couleur.RGBA2(46)//Color.CouleurByte(97,62,24,1);
        let Fond2 = this.Couleur.RGBA()//Color.CouleurByte(229,177,77,1);
        let Fond1 = this.Couleur.RGBA2(120)//Color.CouleurByte(226,163,42,1);


        var grd = ctx.createLinearGradient(0, 0, 0, this.H);
        grd.addColorStop(0, Fond1);
        grd.addColorStop(1, Fond2);

        Context.save();
        Context.strokeStyle = Contour
        Context.fillStyle = grd
        Context.lineWidth = 3;
        Context.shadowOffsetY = 5;
        Context.shadowBlur = 10;
        Context.shadowColor = "black";
        this.roundRect(Context, this.GX() + 1.5, this.GY() + 1.5, this.W - 3, this.H - 3, 2, true, true)
        
        Context.shadowOffsetY = 0;
        Context.shadowBlur = 0;
        Context.lineWidth = 1;
        if (this.Texte == "")
        {
            Context.fillStyle = this.InactifCouleur.RGBA()
            Context.font = this.FontTaille + "px " + this.Font;
            Context.fillText(this.Tooltip, this.GX() + 3, this.GY() + this.H - 6, this.W - 3);
            let barre = 10 <= TotalFrame % 20;
            if (barre && this.Selected)
            {
                Context.fillStyle = this.FontCouleur.RGBA()
                Context.fillText("|", this.GX() + 3, this.GY() + this.H - 6, this.W - 3);
            }
        }
        else
        {
            let barre = 10 <= TotalFrame % 20;
            let t = this.Texte;
            if (barre && this.Selected)
                t = t.substring(0,this.CursorPosition) + "|" + t.substring(this.CursorPosition);
            Context.fillStyle = this.FontCouleur.RGBA()
            Context.font = this.FontTaille + "px " + this.Font;
            Context.fillText(t, this.GX() + 3, this.GY() + this.H - 6, this.W - 3);
        }

        Context.restore();


    }
}