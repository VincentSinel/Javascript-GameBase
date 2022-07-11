class Drawing
{
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
    static RoundRect(ctx, x, y, width, height, radius, fill, stroke) {
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
     static RoundedPoly(ctx, points, radius = 5, fill, stroke){
        ctx.beginPath();
        var i, x, y, len, p1, p2, p3, v1, v2, sinA, sinA90, radDirection, drawDirection, angle, halfAngle, cRadius, lenOut;
        var asVec = function (p, pp, v) { // convert points to a line with len and normalised
            v.x = pp.x - p.x; // x,y as vec
            v.y = pp.y - p.y;
            v.len = Math.sqrt(v.x * v.x + v.y * v.y); // length of vec
            v.nx = v.x / v.len; // normalised
            v.ny = v.y / v.len;
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
            x = p2.x + v2.nx * lenOut; // move out from corner along second line to point where rounded circle touches
            y = p2.y + v2.ny * lenOut;
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
}