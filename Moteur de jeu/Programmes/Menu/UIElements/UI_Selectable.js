class UI_Selectable extends UI_Element
{
    #Etat = UI_Selectable_Etat.DEFAULT;
    
    constructor(Param)
    {
        super(Param);

        this.#Etat = UI_Selectable_Etat.DEFAULT;
        this.Capture_Souris = true;
        
        let _this = this;
        this.onSouris_Clique[Souris.ClicGauche].push(function(e) {_this.Souris_Clique(e)})
        this.onSouris_Basse[Souris.ClicGauche].push(function(e) {_this.Souris_Down(e)})
        this.onSouris_Relache[Souris.ClicGauche].push(function(e) {_this.Souris_Release(e)})
        this.onSouris_Entre.push(function(e) {_this.Souris_Enter(e)})
        this.onSouris_Quitte.push(function(e) {_this.Souris_Leave(e)})
    }

    get Etat(){ return this.#Etat; }
    set Etat(v){ this.#Etat = v; this.Refresh(); }

    Souris_Clique(event)
    {
        this.Etat = UI_Selectable_Etat.HOVER;
        if (this.Focusable)
        {
            this.Focus();
        }
    }
    Souris_Down(event)
    {
        if (this.Etat === UI_Selectable_Etat.HOVER)
            this.Etat = UI_Selectable_Etat.HOVER_CLIC;
    }
    Souris_Release(event)
    {
        if (this.Etat === UI_Selectable_Etat.HOVER_CLIC)
            this.Etat = UI_Selectable_Etat.HOVER;
        else
            this.Etat = UI_Selectable_Etat.DEFAULT;
    }
    Souris_Enter(event)
    {
        if (this.Etat === UI_Selectable_Etat.CLIC)
            this.Etat = UI_Selectable_Etat.HOVER_CLIC;
        else
            this.Etat = UI_Selectable_Etat.HOVER;
    }
    Souris_Leave(event)
    {
        if (this.Etat === UI_Selectable_Etat.HOVER)
            this.Etat = UI_Selectable_Etat.DEFAULT;
        else if (this.Etat === UI_Selectable_Etat.HOVER_CLIC)
            this.Etat = UI_Selectable_Etat.CLIC;
    }
}

class UI_Selectable_Etat
{
    static DEFAULT = 0;
    static HOVER = 1;
    static CLIC = 2;
    static HOVER_CLIC = 3;
    static NONE = 99;
}