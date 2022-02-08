class Color
{

    static clamp = (num, min, max) => Math.min(Math.max(num, min), max);

    constructor(R,G,B,A = 1.0)
    {
        if (R <= 1 && G <= 1 && B <= 1)
        {
            this.R = Math.round(R * 255);
            this.G = Math.round(G * 255);
            this.B = Math.round(B * 255);
        }
        else
        {
            this.R = R;
            this.G = G;
            this.B = B;
        }
        this.A = A;
    }


    RGBA()
    {
        return "rgba(" + this.R + "," + this.G + "," + this.B +"," + this.A + ")"
    }

    RGBA2(p)
    {
        let hsl = Color.RGB_HSL(this.R, this.G, this.B);
        hsl.L = Color.clamp(hsl.L * p / 100.0, 0, 100);
        let rgb = Color.HSL_RGB(hsl.H, hsl.S, hsl.L);
        //let R = Color.clamp(Math.floor(Math.max(this.R, 1) * p / 100.0),0,255);
        //let G = Color.clamp(Math.floor(Math.max(this.G, 1) * p / 100.0),0,255);
        //let B = Color.clamp(Math.floor(Math.max(this.B, 1) * p / 100.0),0,255);
        return "rgba(" + rgb.R + "," + rgb.G + "," + rgb.B +"," + this.A + ")"
    }


    static RGB_HSL(r,g,b)
    {
        let M,m,d,h,s,l;
        r /= 255.0;
        g /= 255.0;
        b /= 255.0;
        M = Math.max(r,g,b);
        m = Math.min(r,g,b);
        d = M-m;
        if( d==0 ) h=0;
        else if( M==r ) h=((g-b)/d)%6;
        else if( M==g ) h=(b-r)/d+2;
        else h=(r-g)/d+4;
        h*=60;
        if( h<0 ) h+=360;
        l = (M+m)/2;
        if( d==0 )
            s = 0;
        else
            s = d/(1-Math.abs(2*l-1));
        s*=100;
        l*=100;
        return {H: h, S: s, L: l};
    }

    static HSL_RGB(h,s,l)
    {
        let C,hh,X,r,g,b,m;
        s/=100;
		l/=100;
		C = (1-Math.abs(2*l-1))*s;
        hh = h/60;
        X = C*(1-Math.abs(hh%2-1));
        r = g = b = 0;
        if( hh>=0 && hh<1 )
        {
            r = C;
            g = X;
        }
        else if( hh>=1 && hh<2 )
        {
            r = X;
            g = C;
        }
        else if( hh>=2 && hh<3 )
        {
            g = C;
            b = X;
        }
        else if( hh>=3 && hh<4 )
        {
            g = X;
            b = C;
        }
        else if( hh>=4 && hh<5 )
        {
            r = X;
            b = C;
        }
        else
        {
            r = C;
            b = X;
        }
        m = l-C/2;
        r += m;
        g += m;
        b += m;
        r *= 255.0;
        g *= 255.0;
        b *= 255.0;
        r = Math.round(r);
        g = Math.round(g);
        b = Math.round(b);
        return {R: r, G: g, B: b};
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
    //=====================================================
    /**
     * Renvoie un texte représentant une couleur à partir des 
     * canaux rouge (r), vert (v), bleu (b) compris entre 0 et 255 et alpha (a) compris entre 0 et 1.
     *
     * @param {number} r Valeur du canneau rouge entre 0 et 255.
     * @param {number} v Valeur du canneau vert entre 0 et 255.
     * @param {number} b Valeur du canneau bleu entre 0 et 255.
     * @param {number} a Valeur du canneau alpha entre 0 et 1.
     * @return {string} texte représentant la couleur.
     */
     static CouleurByte(r,v,b,a = 1.0)
     {
         return "rgba(" + r + "," + v + "," + b +"," + a + ")"
     }
     //=====================================================
}