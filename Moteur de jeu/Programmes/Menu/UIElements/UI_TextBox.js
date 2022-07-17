class UI_TextBox extends UI_Selectable
{
    static Alphabets = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    static Alphabets_Extends = UI_TextBox.Alphabets + "éàèùìòâêîôûäëïöüÿãñõç";
    static Numeric = "0123456789";
    static Numeric_Extends = UI_TextBox.Numeric + ".,-+/*"
    static Special = " @#{}[]&|-_()'°=?;:§!%$£¤€\\\n\t"
    static All = UI_TextBox.Alphabets_Extends + UI_TextBox.Numeric_Extends + UI_TextBox.Special;

    #AllowedCharacter = UI_TextBox.All //UI_TextBox.Alphabets_Extends + UI_TextBox.Numeric_Extends;
    #Label;
    #Texte = "";
    #Tooltip = "Tooltip non définit";
    #CursorPosition = 0;
    #ToucheBasseCount = {};
    #offsettime = 0;
    constructor(Param)
    {
        super(Param)
        this.Focusable = true;
        this.Capture_Clavier = true;
        this.H = UI_Element_Alignement.AUTO;
        this.VerticalAlignement = VerticalAlignementType.Up;
        this.Padding.left = 6;
        this.Padding.right = 6;
        this.Padding.up = 4;
        this.Padding.down = 4;
        this.#Label = new UI_Label(this.#Tooltip);
        this.#Label.Actif = false;
        this.#Label.HorizontalAlignement = HorizontalAlignementType.Left
        this.AddChildren(this.#Label);

        this.onTextChanged = [];
        this.onEnterAction = [];

        let _this = this;
        this.onClavier_ToucheJusteBasse.push(function(e) {_this.Clavier_ToucheJusteBasse(e)})
        this.onClavier_ToucheJusteHaute.push(function(e) {_this.Clavier_ToucheJusteHaute(e)})
        this.onClavier_ToucheBasse.push(function(e) {_this.Clavier_ToucheBasse(e)})
    }

    //#region GETTER SETTER

    get Tooltip() { return this.#Tooltip; }
    set Tooltip(v) 
    { 
        this.#Tooltip = v;
        if (this.#Texte.length === 0)
            this.#Label.Texte = this.#Tooltip; 
    }

    get CursorPosition() { return this.#CursorPosition; }
    set CursorPosition(v) { this.#CursorPosition = Math.max(0, Math.min(this.Texte.length, v)); }

    get Texte() { return this.#Texte; }
    set Texte(v) { 
        let oldt = this.#Texte
        this.#Texte = v;
        if (this.CursorPosition > this.#Texte.length)
            this.CursorPosition = this.#Texte.length;
        if (this.#Texte.length === 0)
        {
            this.#Label.Actif = false;
            this.#Label.Texte = this.#Tooltip;
        }
        else
        {
            this.#Label.Actif = true;
            this.#Label.Texte = this.#Texte; 
        }
        if (oldt != this.#Texte)
        {
            this.onTextChanged.forEach(func => {
                func(oldt, this.#Texte);
            });
        }
    }

    get AllowedCharacter() { return this.#AllowedCharacter; }
    set AllowedCharacter(v) { this.#AllowedCharacter = v; }

    get MultiLine() { return this.#Label.MultiLine; }
    set MultiLine(v) { this.#Label.MultiLine = v; this.SetDirty(); }

    //#endregion

    Clavier_ToucheBasse(event)
    {
        if (this.#ToucheBasseCount[event.Param.key])
        {
            this.#ToucheBasseCount[event.Param.key] += 1;
            if (this.#ToucheBasseCount[event.Param.key] > 10)
            {
                this.Clavier_ToucheJusteBasse(event)
            }
        }
        else
        {
            this.#ToucheBasseCount[event.Param.key] = 1;
        }
    }

    Clavier_ToucheJusteHaute(event)
    {
        if (this.#ToucheBasseCount[event.Param.key])
        {
            delete this.#ToucheBasseCount[event.Param.key]
        }
    }

    Clavier_ToucheJusteBasse(event)
    {
        switch(event.Param.key)
        {
            case ("Backspace") :
                this.CursorPosition -= 1;
                this.Texte = this.Texte.substring(0, this.CursorPosition) + this.#Texte.substring(this.CursorPosition + 1);
                break;
            case ("Delete"):
                this.Texte = this.Texte.substring(0, this.CursorPosition) + this.#Texte.substring(this.CursorPosition + 1);
                break;
            case ("ArrowRight"):
                this.CursorPosition += 1;
                break;
            case ("ArrowLeft"):
                this.CursorPosition -= 1;
                break;
            case ("Enter"):
                if (this.MultiLine) 
                {
                    this.Texte = this.#Texte.substring(0, this.CursorPosition) + "\n" + this.#Texte.substring(this.CursorPosition);
                    this.CursorPosition += 1;
                }
                else
                {
                    this.Unfocus();
                    this.onEnterAction.forEach(func => {
                        func(this.#Texte);
                    });
                }
                break;
            default :
                if (this.#AllowedCharacter.includes(event.Param.key))
                {
                    this.Texte = this.#Texte.substring(0, this.CursorPosition) + event.Param.key + this.#Texte.substring(this.CursorPosition)
                    this.CursorPosition += 1;
                }
                //console.log(event.Param.key);
                break;
        }
        this.#offsettime = Game.TotalFrame;
    }
    

    Calcul(Delta)
    {
        super.Calcul(Delta);
        if ((Game.TotalFrame + 30 - this.#offsettime ) % 60 < 30 || !this.isFocus)
        {
            if (this.#Texte.length === 0)
                this.#Label.Texte = this.#Tooltip;
            else
                this.#Label.Texte = this.#Texte;
        }
        else
        {
            this.SetCursorText();
        }
    }

    SetCursorText()
    {
        if (this.#Texte.length === 0)
            this.#Label.Texte = "|" + this.#Tooltip;
        else
            this.#Label.Texte = this.#Texte.substring(0, this.CursorPosition) + "|" + this.#Texte.substring(this.CursorPosition);
    }

    DessinBackUI(Context)
    {
        if (this.Etat === UI_Selectable_Etat.DEFAULT ||
            this.Etat === UI_Selectable_Etat.CLIC)
            this.CurrentColor = this.BaseCouleur;
        else if (this.Etat === UI_Selectable_Etat.HOVER
            || this.Etat === UI_Selectable_Etat.HOVER_CLIC)
            this.CurrentColor = this.HoverCouleur;
        if (!this.Actif)
            this.CurrentColor = this.InactifCouleur;

        let Contour = this.CurrentColor.RGBA2(46)//Color.CouleurByte(97,62,24,1);
        let Fond2 = this.CurrentColor.RGBA()//Color.CouleurByte(229,177,77,1);
        let Fond1 = this.CurrentColor.RGBA2(120)//Color.CouleurByte(226,163,42,1);


        var grd = Context.createLinearGradient(0, 0, 0, this.FinalSize.y);
        grd.addColorStop(0, Fond1);
        grd.addColorStop(1, Fond2);

        Context.strokeStyle = Contour
        Context.fillStyle = grd
        Context.lineWidth = this.EpaisseurBord;
        Context.shadowOffsetY = 5;
        Context.shadowBlur = 10;
        Context.shadowColor = "black";
        Drawing.RoundRect(Context, 
            this.EpaisseurBord / 2, this.EpaisseurBord / 2, 
            this.FinalSize.x - this.EpaisseurBord, 
            this.FinalSize.y - this.EpaisseurBord, 2, true, true)
        
        Context.shadowOffsetY = 0;
        Context.shadowBlur = 0;
        Context.lineWidth = 1;
    }
}