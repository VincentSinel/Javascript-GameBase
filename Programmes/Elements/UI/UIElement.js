class UIElement
{
    // Couleur de base des objets
    static BaseCouleur = new Color(200,157,57,1);
    // Couleur de base lorsqu'un objet est en surbrillance
    static BaseSelectionCouleur = new Color(229,177,77,1);
    // Couleur de base lorsu'un objet n'est pas actif
    static BaseInactifCouleur = new Color(177,177,177,1);
    // Couleur de base du texte dans un UI
    static BaseTexteCouleur = new Color(255,255,255,1);
    // Police de base pour le texte
    static BaseFont = "Arial";
    // Taille de base du texte (en pixel)
    static BaseFontTaille = 12;

    static Menus = [];

    /**
     * Créer un UIElement. Classe mère des objets de création d'interface utilisateur.
     * @param {Number} X Position X relative au parent
     * @param {Number} Y Position Y relative au parent
     * @param {Number} W Largeur de l'objet
     * @param {Number} H Hauteur de l'objet
     * @param {UIElement} Parent Objet Parent (facultatif)
     */
    constructor(X,Y,W,H, Parent = undefined)
    {
        this.Font = UIElement.BaseFont;
        this.FontTaille = UIElement.BaseFontTaille;
        this.FontCouleur = UIElement.BaseTexteCouleur;
        this.BaseCouleur = UIElement.BaseCouleur;
        this.SelectionCouleur = UIElement.BaseSelectionCouleur;
        this.InactifCouleur = UIElement.BaseInactifCouleur;

        this.X = X;
        this.Y = Y;
        this.Z = 0;
        this.W = W;
        this.H = H;
        this.Parent = Parent;
        this.Enfants = []; // Cette variable contient la liste des enfants de cette UIElement
        if (Parent != undefined)
        {
            Parent.Enfants.push(this);
        }
        else
        {
            UIElement.Menus.push(this);
        }

        // Cette variable permet d'activer ou desactiver un objet UI
        this.Actif = true;
        this.SourisCapture = false;
        this.IsTop = false;
    }

    Hover()
    {
        if (this.Actif && this.SourisCapture)
        {
            if (Souris.CX >= this.GX(true) && Souris.CX <= this.GX(true) + this.W && Souris.CY >= this.GY(true) && Souris.CY <= this.GY(true) + this.H)
            {
                return true;
            }
        }
        return false;
    }

    Supprimer()
    {
        if (Parent != undefined)
        {
            this.Parent.Enfants.splice(this.Parent.Enfants.indexOf(this), 1);
        }
        else
        {
            UIElement.Menus.splice(UIElement.Menus.indexOf(this), 1);
        }
    }



    AssignerParent(Parent)
    {
        this.Parent = Parent;
        if (Parent != undefined)
        {
            Parent.Enfants.push(this);
        }
    }

    /**
     * Calcul la position X de cette objet vis à vis de son parent
     * @returns Position X relative au parent
     */
    GX(souris = false)
    {
        if (this.Parent)
            return this.X + this.Parent.CX(souris);
        else
            return this.X;
    }

    /**
     * Calcul la position Y de cette objet vis à vis de son parent
     * @returns Position Y relative au parent
     */
    GY(souris = false)
    {
        if (this.Parent)
            return this.Y + this.Parent.CY(souris);
        else
            return this.Y;
    }

    GZ(souris = false)
    {
        if (this.Parent)
            return this.Z + this.Parent.Z;
        else
            return this.Z;
    }

    /**
     * Calcul la position X de point de départ d'un contenue d'objet (padding)
     * @returns Position X relative au parent
     */
    CX(souris = false)
    {
        if (this.Parent)
            return this.GX(souris) + 3;
        else
            return this.GX(souris);
    }

    /**
     * Calcul la position Y de point de départ d'un contenue d'objet (padding)
     * @returns Position Y relative au parent
     */
    CY(souris = false)
    {
        if (this.Parent)
            return this.GY(souris) + 3;
        else
            return this.GY(souris);
    }

    Calcul(Delta)
    {
        
        // For performance reasons, we will first map to a temp array, sort and map the temp array to the objects array.
        var map = this.Enfants.map(function (el, index) {
            return { index : index, value : el.ZG() };
        });
        
        // Now we need to sort the array by z index.
        map.sort(function (a, b) {
            return a.value - b.value;
        });
        
        let objects = this.Enfants;
        // We finaly rebuilt our sorted objects array.
        this.Enfants = map.map(function (el) {
            return objects[el.index];
        });

        let top = false;
        for (let e = 0; e < this.Enfants.length; e++) {
            this.Enfants[e].IsTop = false;
            if (this.IsTop && !top && this.Enfants[e].Hover())
            {
                menu.IsTop = true;
                this.IsTop = false;
            }
            this.Enfants[e].Calcul(Delta);
        }
    }

    Dessin(Context)
    {
        for (let e = this.Enfants.length - 1; e >= 0; e--) {
            this.Enfants[e].Dessin(Context);
        }
    }
 
    /**
     * Dessine un rectangle avec des coin rond.
     * Si les trois dernier paremètre sont omis, un rectangle avec des 
     * coin de 5 pixel de rayon sera dessiné
     * @param {CanvasRenderingContext2D} ctx Contexte de dessin
     * @param {Number} x Coordonné X du coin haut gauche du rectangle
     * @param {Number} y Coordonné Y du coin haut gauche du rectangle
     * @param {Number} width Largeur du rectangle
     * @param {Number} height Hauteur du rectangle
     * @param {Number} [radius = 5] L'angle du coin; cela peut aussi être un objet 
                                * pour définir des angles différents au quatre coin
     * @param {Number} [radius.tl = 0] Coin au haut gauche
     * @param {Number} [radius.tr = 0] Coin au haut droit
     * @param {Number} [radius.br = 0] Coin au bas droit
     * @param {Number} [radius.bl = 0] Coin au bas gauche
     * @param {Boolean} [fill = false] Définit si le rectangle doit être rempli.
     * @param {Boolean} [stroke = true] Définit si le rectangle doit avoir un contour.
     */
    roundRect(ctx, x, y, width, height, radius, fill, stroke) {
        if (typeof stroke === 'undefined') 
        {
            stroke = true;
        }
        if (typeof radius === 'undefined') 
        {
            radius = 5;
        }
        if (typeof radius === 'number') 
        {
            radius = {tl: radius, tr: radius, br: radius, bl: radius};
        } 
        else 
        {
            var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
            for (var side in defaultRadius) {
                radius[side] = radius[side] || defaultRadius[side];
            }
        }
        ctx.beginPath();
        ctx.moveTo(x + radius.tl, y);
        ctx.lineTo(x + width - radius.tr, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
        ctx.lineTo(x + width, y + height - radius.br);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
        ctx.lineTo(x + radius.bl, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
        ctx.lineTo(x, y + radius.tl);
        ctx.quadraticCurveTo(x, y, x + radius.tl, y);
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        if (stroke) {
            ctx.stroke();
        }
    
    }

    /**
     * Dessine un polygone sur le canvas en arrondissant ses angles selon le rayon souhaité. 
     * Si l'angle d'un angle est trop faible, le rayon est adapté pour être le mieux rendu possible.
     * @param {Context} ctx Context du canvas
     * @param {Array<Vector2>} points Liste des points composant le polygone
     * @param {Number} [radius = 5] Rayon de l'arrondie à dessiner
     * @param {Boolean} [fill = false] Whether to fill the rectangle.
     * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
     */
    roundedPoly(ctx, points, radius = 5, fill, stroke){
        ctx.beginPath();
        var i, x, y, len, p1, p2, p3, v1, v2, sinA, sinA90, radDirection, drawDirection, angle, halfAngle, cRadius, lenOut;
        var asVec = function (p, pp, v) { // convert points to a line with len and normalised
            v.X = pp.X - p.X; // x,y as vec
            v.Y = pp.Y - p.Y;
            v.len = Math.sqrt(v.X * v.X + v.Y * v.Y); // length of vec
            v.nx = v.X / v.len; // normalised
            v.ny = v.Y / v.len;
            v.ang = Math.atan2(v.ny, v.nx); // direction of vec
        }
        v1 = {};
        v2 = {};
        len = points.length;                         // number points
        p1 = points[len - 1];                        // start at end of path
        for (i = 0; i < len; i++) {                  // do each corner
            p2 = points[(i) % len];                  // the corner point that is being rounded
            p3 = points[(i + 1) % len];
            // get the corner as vectors out away from corner
            asVec(p2, p1, v1);                       // vec back from corner point
            asVec(p2, p3, v2);                       // vec forward from corner point
            // get corners cross product (asin of angle)
            sinA = v1.nx * v2.ny - v1.ny * v2.nx;    // cross product
            // get cross product of first line and perpendicular second line
            sinA90 = v1.nx * v2.nx - v1.ny * -v2.ny; // cross product to normal of line 2
            angle = Math.asin(sinA);                 // get the angle
            radDirection = 1;                        // may need to reverse the radius
            drawDirection = false;                   // may need to draw the arc anticlockwise
            // find the correct quadrant for circle center
            if (sinA90 < 0) {
                if (angle < 0) {
                    angle = Math.PI + angle; // add 180 to move us to the 3 quadrant
                } else {
                    angle = Math.PI - angle; // move back into the 2nd quadrant
                    radDirection = -1;
                    drawDirection = true;
                }
            } else {
                if (angle > 0) {
                    radDirection = -1;
                    drawDirection = true;
                }
            }
            halfAngle = angle / 2;
            // get distance from corner to point where round corner touches line
            lenOut = Math.abs(Math.cos(halfAngle) * radius / Math.sin(halfAngle));
            if (lenOut > Math.min(v1.len / 2, v2.len / 2)) { // fix if longer than half line length
                lenOut = Math.min(v1.len / 2, v2.len / 2);
                // ajust the radius of corner rounding to fit
                cRadius = Math.abs(lenOut * Math.sin(halfAngle) / Math.cos(halfAngle));
            } else {
                cRadius = radius;
            }
            x = p2.X + v2.nx * lenOut; // move out from corner along second line to point where rounded circle touches
            y = p2.Y + v2.ny * lenOut;
            x += -v2.ny * cRadius * radDirection; // move away from line to circle center
            y += v2.nx * cRadius * radDirection;
            // x,y is the rounded corner circle center
            ctx.arc(x, y, cRadius, v1.ang + Math.PI / 2 * radDirection, v2.ang - Math.PI / 2 * radDirection, drawDirection); // draw the arc clockwise
            p1 = p2;
            p2 = p3;
        }
        ctx.closePath();
        if (fill) {
            ctx.fill();
        }
        if (stroke) {
            ctx.stroke();
        }
    }

    static Calcul(Delta)
    {
        // For performance reasons, we will first map to a temp array, sort and map the temp array to the objects array.
        var map = UIElement.Menus.map(function (el, index) {
            return { index : index, value : el.GZ() };
        });
        
        // Now we need to sort the array by z index.
        map.sort(function (a, b) {
            return b.value - a.value;
        });
        
        let objects = UIElement.Menus;
        // We finaly rebuilt our sorted objects array.
        UIElement.Menus = map.map(function (el) {
            return objects[el.index];
        });

        let top = false;
        UIElement.Menus.forEach(menu => {
            
            menu.IsTop = false;
            if (!top && menu.Hover())
            {
                menu.IsTop = true;
            }
            menu.Calcul(Delta)
        });
    }

    static Dessin(Context)
    {
        for (let o = (UIElement.Menus.length - 1); o >= 0; o--) {
            UIElement.Menus[o].Dessin(Context)
        }
    }
}