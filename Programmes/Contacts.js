class Contacts
{
    /**
     * Test si un point est à l'intérieur d'un triangle
     * 
     * @param {Vecteur2} A Premier point
     * @param {Vecteur2} B Second point
     * @param {Vecteur2} C Troisième point
     * @param {Vecteur2} P Point à tester
     * @returns Vrai si le point est dans le triangle, faux sinon
     */
    static PointDansTriangle(A, B, C, P)
    {
        // Compute vectors        
        let v0 = Vecteur2.AVersB(A,C);
        let v1 = Vecteur2.AVersB(A,B);
        let v2 = Vecteur2.AVersB(A,P);

        // Compute dot products
        let dot00 = Vecteur2.Dot(v0, v0);
        let dot01 = Vecteur2.Dot(v0, v1);
        let dot02 = Vecteur2.Dot(v0, v2);
        let dot11 = Vecteur2.Dot(v1, v1);
        let dot12 = Vecteur2.Dot(v1, v2);

        // Compute barycentric coordinates
        let invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
        let u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        let v = (dot00 * dot12 - dot01 * dot02) * invDenom;

        // Check if point is in triangle
        if(u >= 0 && v >= 0 && (u + v) < 1)
        { return true; } else { return false; }
    }

    /**
     * Test si un point est à l'intérieur d'un rectangle (avec rotation)
     * 
     * @param {Vecteur2} X Angle Haut Gauche du rectangle
     * @param {Vecteur2} Y Angle Bas Gauche du rectangle
     * @param {Vecteur2} Z Angle Bas Droit du rectangle
     * @param {Vecteur2} W Angle Haut Droit du rectangle
     * @param {Vecteur2} P Point à tester
     * @returns Vrai si le point est dans le rectangle, faux sinon
     */
    static PointDansRectangle(X, Y, Z, W, P)
    {
        return (P.AGauche(X,Y) >= 0 && P.AGauche(Y, Z) >= 0 && P.AGauche(Z,W) >= 0 && P.AGauche(W,X) >= 0);
    }

    /**
     * Test si un point est à l'intérieur d'un polygone
     * 
     * @param {Array<Vecteur2>} Poly Liste des sommets du polygone
     * @param {Vecteur2} P Point à tester
     * @returns Vraie si le point est à l'intérieur du polygone, faux sinon
     */
    static PointDansPolygone(Poly, P)
    {
        for (let index = 0; index < Poly.length; index++) {
            let d = Poly[index];
            let e = Poly[(index + 1) % Poly.length];
            if (P.AGauche(d,e) < 0)
                return false;
        }
        return true;
    }


    /**
     * Fonction permettant de determiner si deux polygone se croisent à partir de la liste de leur sommet
     * Utilise le Separating Axis Theorem
     * 
     * @param {Array<Vecteur2>} a Tableau de Vecteur2 formant un Polygone
     * @param {Array<Vecteur2>} b Tableau de Vecteur2 formant un Polygone
     * @returns Vraie si les 2 polygone se croisent, faux sinon
     */
    static PolygonesIntersection (a, b) {
        var polygons = [a, b];
        var minA, maxA, projected, i, i1, j, minB, maxB;

        for (i = 0; i < polygons.length; i++) {

            // for each polygon, look at each edge of the polygon, and determine if it separates
            // the two shapes
            var polygon = polygons[i];
            for (i1 = 0; i1 < polygon.length; i1++) {

                // grab 2 vertices to create an edge
                var i2 = (i1 + 1) % polygon.length;
                var p1 = polygon[i1];
                var p2 = polygon[i2];

                // find the line perpendicular to this edge
                var normal = { x: p2.Y - p1.Y, y: p1.X - p2.X };

                minA = maxA = undefined;
                // for each vertex in the first shape, project it onto the line perpendicular to the edge
                // and keep track of the min and max of these values
                for (j = 0; j < a.length; j++) {
                    projected = normal.x * a[j].X + normal.y * a[j].Y;
                    if (isUndefined(minA) || projected < minA) {
                        minA = projected;
                    }
                    if (isUndefined(maxA) || projected > maxA) {
                        maxA = projected;
                    }
                }

                // for each vertex in the second shape, project it onto the line perpendicular to the edge
                // and keep track of the min and max of these values
                minB = maxB = undefined;
                for (j = 0; j < b.length; j++) {
                    projected = normal.x * b[j].X + normal.y * b[j].Y;
                    if (isUndefined(minB) || projected < minB) {
                        minB = projected;
                    }
                    if (isUndefined(maxB) || projected > maxB) {
                        maxB = projected;
                    }
                }

                // if there is no overlap between the projects, the edge we are looking at separates the two
                // polygons, and we know there is no overlap
                if (maxA < minB || maxB < minA) {
                    //CONSOLE("polygons don't intersect!");
                    return false;
                }
            }
        }
        return true;
    };
}