/**
 * Module de Calcul de contacts. Les fonctions principales sont :
 * Contacts.PointDansTriangle(A, B, C, P)
 * Contacts.PointDansRectangle(X, Y, Z, W, P)
 * Contacts.PointDansPolygone(Poly, P)
 * Contacts.PolygonesIntersection (a, b)
 * Contacts.CercleContreRectangle(X,Y,Z,W, P, Radius)
 * Contacts.RectContreRect(X1,Y1,W1,X2,Y2,W2)
 * Contacts.rotatedRectanglesCollide(r1X, r1Y, r1W, r1H, r1A, r2X, r2Y, r2W, r2H, r2A)
 * Contacts.AABB(X1, Y1, Z1, X2, Y2, Z2)
 * Contacts.AngleRebond(Normal, Direction)
 */
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
     * @param {Vecteur2} Y Angle Haut Droit du rectangle
     * @param {Vecteur2} Z Angle Bas Droit du rectangle
     * @param {Vecteur2} W Angle Bas Gauche du rectangle
     * @param {Vecteur2} P Point à tester
     * @returns Vrai si le point est dans le rectangle, faux sinon
     */
    static PointDansRectangle(X, Y, Z, W, P)
    {
        return (P.AGauche(X, Y) <= 0 && P.AGauche(Y, Z) <= 0 && P.AGauche(Z, W) <= 0 && P.AGauche(W, X) <= 0);
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


    /**
     * Test la collision entre un rectangle avec rotation et un cercle
     * @param {Vecteur2} X Position angle haut gauche
     * @param {Vecteur2} Y Position angle haut droit
     * @param {Vecteur2} Z Position angle bas droit
     * @param {Vecteur2} W Position angle bas gauche
     * @param {Vecteur2} P Centre du cercle
     * @param {float} Radius rayon du cercle
     * @returns Vrai si il y a contact, faux sinon
     */
    static CercleContreRectangle(X,Y,Z,W, P, Radius)
    {
        let a = Vecteur2.AVersB(X,Y).Normaliser(Radius);
        let b = Vecteur2.AVersB(X,W).Normaliser(Radius);
        let NX = new Vecteur2(X.X - a.X - b.X, X.Y - a.Y - b.Y);
        let NY = new Vecteur2(Y.X + a.X - b.X, Y.Y + a.Y - b.Y);
        let NZ = new Vecteur2(Z.X + a.X + b.X, Z.Y + a.Y + b.Y);
        let NW = new Vecteur2(W.X - a.X + b.X, W.Y - a.Y + b.Y);
        if (Contacts.PointDansRectangle(NX, NY, NZ, NW, P))
        {
            if ((P.AGauche(X,Y) > 0) && (P.AGauche(W,X) > 0))           //0
            {
                return new Vecteur2(NX.X - X.X, NX.Y - X.Y)
            }
            else if (P.AGauche(X,Y) > 0 && P.AGauche(Y,Z) > 0)      //1
            {
                return new Vecteur2(NY.X - Y.X, NY.Y - Y.Y)
            }
            else if (P.AGauche(X,Y) > 0)                            //2
            {
                return new Vecteur2((NY.X + NX.X - Y.X - X.X) / 2, (NY.Y + NX.Y - Y.Y - X.Y) / 2)
            }
            else if (P.AGauche(W,X) > 0 && P.AGauche(Z,W) > 0)      //3
            {
                return new Vecteur2(NW.X - W.X, NW.Y - W.Y)
            }
            else if (P.AGauche(W,X) > 0)                            //4
            {
                return new Vecteur2((NW.X + NX.X - W.X - X.X) / 2, (NW.Y + NX.Y - W.Y - X.Y) / 2)
            }
            else if (P.AGauche(Y,Z) > 0 && P.AGauche(Z,W) > 0)      //5
            {
                return new Vecteur2(NZ.X - Z.X, NZ.Y - Z.Y)
            }
            else if (P.AGauche(Z,W) > 0)                            //6
            {
                return new Vecteur2((NW.X + NZ.X - W.X - Z.X) / 2, (NW.Y + NZ.Y - W.Y - Z.Y) / 2)
            }
            else if (P.AGauche(Y, Z) > 0)                           //7
            {
                return new Vecteur2((NY.X + NZ.X - Y.X - Z.X) / 2, (NY.Y + NZ.Y - Y.Y - Z.Y) / 2)
            }
        }
        return 0;
    }

    /**
     * Test si deux rectangle avec une rotation sont en collision.
     * @param {Vecteur2} X1 Position angle haut gauche du rectangle 1
     * @param {Vecteur2} Y1 Position angle haut droit du rectangle 1
     * @param {Vecteur2} W1 Position angle bas gauche du rectangle 1
     * @param {Vecteur2} X2 Position angle haut gauche du rectangle 2
     * @param {Vecteur2} Y2 Position angle haut droit du rectangle 2
     * @param {Vecteur2} W2 Position angle bas gauche du rectangle 2
     * @returns Vrai si les deux rectangle sont en collision, faux sinon
     */
    static RectContreRect(X1,Y1,W1,X2,Y2,W2)
    {
        let w1 = Math.sqrt((X1.X-Y1.X) * (X1.X-Y1.X) + (X1.Y-Y1.Y) * (X1.Y-Y1.Y))
        let h1 = Math.sqrt((X1.X-W1.X) * (X1.X-W1.X) + (X1.Y-W1.Y) * (X1.Y-W1.Y))
        let a1 = Math.atan2((X1.X-Y1.X), (X1.Y-Y1.Y))
        let w2 = Math.sqrt((X2.X-Y2.X) * (X2.X-Y2.X) + (X2.Y-Y2.Y) * (X2.Y-Y2.Y))
        let h2 = Math.sqrt((X2.X-W2.X) * (X2.X-W2.X) + (X2.Y-W2.Y) * (X2.Y-W2.Y))
        let a2 = Math.atan2((X2.X-Y2.X), (X2.Y-Y2.Y))
        return rotatedRectanglesCollide(X1.X, X1.Y, w1, h1, a1, X2.X, X2.Y, w2, h2, a2)
    }

    /**
     * Test si deux rectangleavec une rotation sont en collision.
     * @param {float} r1X Position X angle haut gauche du rectangle 1
     * @param {float} r1Y Position Y angle haut gauche du rectangle 1
     * @param {float} r1W Largeur du rectangle 1
     * @param {float} r1H Hauteur du rectangle 1
     * @param {float} r1A Angle de rotation du rectangle 1
     * @param {float} r2X Position X angle haut gauche du rectangle 2
     * @param {float} r2Y Position Y angle haut gauche du rectangle 2
     * @param {float} r2W Largeur du rectangle 2
     * @param {float} r2H Hauteur du rectangle 2
     * @param {float} r2A Angle de rotation du rectangle 2
     * @returns Vrai si les deux rectangle sont en collision, faux sinon
     */
    static rotatedRectanglesCollide(r1X, r1Y, r1W, r1H, r1A, r2X, r2Y, r2W, r2H, r2A) {
        let r1HW = r1W / 2;
        let r1HH = r1H / 2;
        let r2HW = r2W / 2;
        let r2HH = r2H / 2;
      
        let r1CX = r1X + r1HW;
        let r1CY = r1Y + r1HH;
        let r2CX = r2X + r2HW;
        let r2CY = r2Y + r2HH;
      
        let cosR1A = Math.cos(r1A);
        let sinR1A = Math.sin(r1A);
        let cosR2A = Math.cos(r2A);
        let sinR2A = Math.sin(r2A);
      
        let r1RX =  cosR2A * (r1CX - r2CX) + sinR2A * (r1CY - r2CY) + r2CX - r1HW;
        let r1RY = -sinR2A * (r1CX - r2CX) + cosR2A * (r1CY - r2CY) + r2CY - r1HH;
        let r2RX =  cosR1A * (r2CX - r1CX) + sinR1A * (r2CY - r1CY) + r1CX - r2HW;
        let r2RY = -sinR1A * (r2CX - r1CX) + cosR1A * (r2CY - r1CY) + r1CY - r2HH;
      
        let cosR1AR2A = Math.abs(cosR1A * cosR2A + sinR1A * sinR2A);
        let sinR1AR2A = Math.abs(sinR1A * cosR2A - cosR1A * sinR2A);
        let cosR2AR1A = Math.abs(cosR2A * cosR1A + sinR2A * sinR1A);
        let sinR2AR1A = Math.abs(sinR2A * cosR1A - cosR2A * sinR1A);
      
        let r1BBH = r1W * sinR1AR2A + r1H * cosR1AR2A;
        let r1BBW = r1W * cosR1AR2A + r1H * sinR1AR2A;
        let r1BBX = r1RX + r1HW - r1BBW / 2;
        let r1BBY = r1RY + r1HH - r1BBH / 2;
      
        let r2BBH = r2W * sinR2AR1A + r2H * cosR2AR1A;
        let r2BBW = r2W * cosR2AR1A + r2H * sinR2AR1A;
        let r2BBX = r2RX + r2HW - r2BBW / 2;
        let r2BBY = r2RY + r2HH - r2BBH / 2;
      
        return r1X < r2BBX + r2BBW && r1X + r1W > r2BBX && r1Y < r2BBY + r2BBH && r1Y + r1H > r2BBY &&
               r2X < r1BBX + r1BBW && r2X + r2W > r1BBX && r2Y < r1BBY + r1BBH && r2Y + r2H > r1BBY;
      }

    /**
     * Test si deux rectangle avec sans rotation sont en collision.
     * @param {Vecteur2} X1 Position angle haut gauche du rectangle 1
     * @param {Vecteur2} Z1 Position angle bas droit du rectangle 1
     * @param {Vecteur2} X2 Position angle haut gauche du rectangle 2
     * @param {Vecteur2} Z2 Position angle bas droit du rectangle 2
     * @returns Vrai si les deux rectangle sont en collision, faux sinon
     */
    static AABB(X1, Z1, X2, Z2)
    {
        return X1.X < Z2.X && Z1.X > X2.X && X1.Y < Z2.Y && Z1.Y > X2.Y;
    }

    /**
     * Calcul l'angle de rebond avec une surface
     * @param {Vecteur2} Normal Vecteur Normal à la collision
     * @param {Float} Direction Angle d'arrivé
     * @returns Angle de renvoie
     */
    static AngleRebond(Normal, Direction)
    {
        let v = Vecteur2.AngleVersVecteur(Direction)
        let u = Normal.Normaliser(Vecteur2.Dot(v, Normal))
        let w = Vecteur2.AVersB(u,v);
        return Math.atan2(w.Y - u.Y,w.X - u.X) * 180 / Math.PI
    }

}