class UI_Toggle extends UI_Button
{
    #Toggle = false;
    /**
     * Créer un boutton pour interface utilisateur.
     * Utiliser la variable Boutton.ClicAction pour définir l'action du boutton.
     * @param {Number} X Position X relative à l'objet parent
     * @param {Number} Y Position Y relative à l'objet parent
     * @param {Number} W Largeur du boutton
     * @param {Number} H Hauteur du boutton
     * @param {String} Texte Texte affiché sur le boutton
     * @param {UIElement} Parent Objet Parent (facultatif)
     */
    constructor(X,Y,Z,W,H,Texte,Parent)
    {
        super(X,Y,Z,W,H,Texte,Parent)

        this.#Toggle = false;
    }

    get Toggle()
    {
        return this.#Toggle
    }
    set Toggle(v)
    {
        this.#Toggle = v;
        this.RefreshUI();
    }

    Souris_Clique(event)
    {
        this.Toggle = !this.Toggle;
        super.Souris_Clique(event)
    }


    DessinBackUI(Context)
    {
        let oldstate = this.Etat;
        if (this.Toggle)
        {this.Etat = "Hover_Click";}

        super.DessinBackUI(Context);

        this.Etat = oldstate;
    }
}