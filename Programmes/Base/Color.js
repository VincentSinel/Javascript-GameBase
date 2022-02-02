class Color
{

    constructor(R,G,B,A = 1.0)
    {
        this.R = Math.round(R * 255);
        this.G = Math.round(G * 255);;
        this.B = Math.round(B * 255);;
        this.A = A;
    }


    RGBA()
    {
        return "rgba(" + this.R + "," + this.G + "," + this.B +"," + this.A + ")"
    }

    //=====================================================
    /**
     * Renvoie un texte représentant une couleur à partir des 
     * canaux rouge (r), vert (v), bleu (b) et alpha (a) tous compris entre 0 et 1.
     *
     * @param {number} r Valeur du canneau rouge entre 0 et 1.
     * @param {number} v Valeur du canneau vert entre 0 et 1.
     * @param {number} b Valeur du canneau bleu entre 0 et 1.
     * @param {number} a Valeur du canneau alpha entre 0 et 1.
     * @return {string} texte représentant la couleur.
     */
    static Couleur(r,v,b,a = 1.0)
    {
        r = Math.round(r * 255);
        v = Math.round(v * 255);
        b = Math.round(b * 255);
        return "rgba(" + r + "," + v + "," + b +"," + a + ")"
    }
    //=====================================================
}