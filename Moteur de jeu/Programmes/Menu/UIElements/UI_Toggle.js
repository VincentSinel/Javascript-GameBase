class UI_Toggle extends UI_Button
{
    #Toggle = false;
    /**
     * Créer un boutton pour interface utilisateur.
     * Utiliser la variable Boutton.ClicAction pour définir l'action du boutton.
     * @param {UIParam} [Param=undefined] Parametre de l'UI
     */
    constructor(Param)
    {
        super(Param)

        this.Focusable = true;
        this.#Toggle = false;
    }

    get Toggle()
    {
        return this.#Toggle
    }
    set Toggle(v)
    {
        this.#Toggle = v;
        this.Refresh();
    }

    Souris_Clique(event)
    {
        this.Toggle = !this.Toggle;
        super.Souris_Clique(event)
    }


    DessinBackUI(Context)
    {
        super.DessinBackUI(Context, this.Toggle);
    }
}