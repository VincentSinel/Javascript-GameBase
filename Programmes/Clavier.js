class Clavier
{
    static Pressed = [];
    static JustPressed = [];
    static JustReleased = [];

    /**
     * Renvoie si une touche a été pressé
     * @param {*} code code de la touche
     * @returns boolean (Vrai-Faux) indiquant si la touche est pressé
     */
    static ToucheBasse(code)
    {
        return this.Pressed.includes(code);
    }
    /**
     * Renvoie si une touche viens juste d'être pressé
     * @param {*} code code de la touche
     * @returns boolean (Vrai-Faux) indiquant si la touche viens d'être
     */
    static ToucheJusteBasse(code)
    {
        return this.JustPressed.includes(code);
    }
    /**
     * Renvoie si une touche viens juste relaché
     * @param {*} code code de la touche
     * @returns boolean (Vrai-Faux) indiquant si la touche viens juste d'être relaché
     */
    static ToucheJusteHaute(code)
    {
        return this.JustReleased.includes(code);
    }

    static KeyDown(e)
    {
        if (!this.Pressed.includes(e.key))
        {
            this.JustPressed.push(e.key);
            this.Pressed.push(e.key);
        }
    }

    static KeyUp(e)
    {
        let index = this.Pressed.indexOf(e.key);
        if (index > -1) {
            this.Pressed.splice(index, 1);
        }
        this.JustReleased.push(e.key);
    }


    static Update()
    {
        this.JustPressed.length = 0;
        this.JustReleased.length = 0;
    }
}