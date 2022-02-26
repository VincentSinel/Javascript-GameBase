class Clavier
{
    static Pressed = [];
    static JustPressed = [];
    static JustReleased = [];

    /**
     * Renvoie si une touche a été pressé
     * @param {*} code code de la touche
     * @param {boolean} TestCase Définit si la case doit être pris en compte (default : False)
     * @returns boolean (Vrai-Faux) indiquant si la touche est pressé
     */
    static ToucheBasse(code, TestCase = false)
    {
        if (TestCase)
            return this.Pressed.includes(code);
        else
            return this.Pressed.includes(code) || this.Pressed.includes(code.toLowerCase()) || this.Pressed.includes(code.toUpperCase());
    }
    /**
     * Renvoie si une touche viens juste d'être pressé
     * @param {*} code code de la touche
     * @param {boolean} TestCase Définit si la case doit être pris en compte (default : False)
     * @returns boolean (Vrai-Faux) indiquant si la touche viens d'être
     */
    static ToucheJusteBasse(code, TestCase = false)
    {
        if (TestCase)
            return this.JustPressed.includes(code);
        else
            return this.JustPressed.includes(code) || this.JustPressed.includes(code.toLowerCase()) || this.JustPressed.includes(code.toUpperCase());
    }
    /**
     * Renvoie si une touche viens juste relaché
     * @param {*} code code de la touche
     * @param {boolean} TestCase Définit si la case doit être pris en compte (default : False)
     * @returns boolean (Vrai-Faux) indiquant si la touche viens juste d'être relaché
     */
    static ToucheJusteHaute(code, TestCase = false)
    {
        if (TestCase)
            return this.JustReleased.includes(code);
        else
            return this.JustReleased.includes(code) || this.JustReleased.includes(code.toLowerCase()) || this.JustReleased.includes(code.toUpperCase());
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