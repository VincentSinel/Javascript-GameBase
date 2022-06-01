/**
 * Module de gestion du clavier. Les fonctions principales sont :
 * Clavier.ToucheBasse(code, TestCase = false)
 * Clavier.ToucheJusteBasse(code, TestCase = false)
 * Clavier.ToucheJusteHaute(code, TestCase = false)
 */
class Clavier
{
    static Pressed = [];
    static JustPressed = [];
    static JustReleased = [];

    /**
     * Renvoie si une touche a été pressé
     * @param {string} code code de la touche
     * @param {boolean} TestCase Définit si la case doit être pris en compte (default : False)
     * @returns {boolean} Vrai-Faux indiquant si la touche est pressé
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
     * @param {string} code code de la touche
     * @param {boolean} TestCase Définit si la case doit être pris en compte (default : False)
     * @returns {boolean} Vrai-Faux indiquant si la touche viens d'être
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
     * @param {string} code code de la touche
     * @param {boolean} TestCase Définit si la case doit être pris en compte (default : False)
     * @returns {boolean} Vrai-Faux indiquant si la touche viens juste d'être relaché
     */
    static ToucheJusteHaute(code, TestCase = false)
    {
        if (TestCase)
            return this.JustReleased.includes(code);
        else
            return this.JustReleased.includes(code) || this.JustReleased.includes(code.toLowerCase()) || this.JustReleased.includes(code.toUpperCase());
    }

    /**
     * S'éxecute lors de l'appuie d'une touche (en continue)
     * @param {KeyboardEvent} e Evenement clavier
     */
    static KeyDown(e)
    {
        if (!this.Pressed.includes(e.key))
        {
            this.JustPressed.push(e.key);
            this.Pressed.push(e.key);
            UIElement.SHandle_KeyJustDown(e);
        }
        UIElement.SHandle_KeyDown(e);
    }
    /**
     * S'éxecute lors du relachement d'une touche
     * @param {KeyboardEvent} e Evenement clavier
     */
    static KeyUp(e)
    {
        let index = this.Pressed.indexOf(e.key);
        if (index > -1) {
            this.Pressed.splice(index, 1);
        }
        this.JustReleased.push(e.key);
        UIElement.SHandle_KeyJustUp(e);
    }
    /**
     * Mise a jour des touches préssé
     */
    static Update()
    {
        this.JustPressed.length = 0;
        this.JustReleased.length = 0;
    }
}