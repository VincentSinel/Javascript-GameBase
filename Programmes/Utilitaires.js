 //=====================================================
/**
 * Renvoie un nombre entier aléatoire entre le min et le max inclus
 * @param {number} min minimum
 * @param {number} max maximum
 * @returns nombre entier aléatoire entre le min et le max inclus
 */
 function EntierAleat(min, max)
 {
     if (max == undefined)
     {
        return Math.floor(Math.random() * min)
     }
     else
     {
        if (max < min)
        {
            throw Error('Le maximum doit être plus grand que le minimum');
        }
        return min + Math.floor(Math.random() * (max - min))
     }
 }
 //=====================================================


 //=====================================================
/**
 * Renvoie un nombre aléatoire entre le min et le max inclus
 * @param {number} min minimum
 * @param {number} max maximum
 * @returns nombre entier aléatoire entre le min et le max inclus
 */
 function NombreAleat(min, max)
 {
    if (max == undefined)
    {
       return Math.random() * min
    }
    else
    {
        if (max < min)
        {
            throw Error('Le maximum doit être plus grand que le minimum');
        }
        return min + Math.random() * (max - min)
    }
 }
 //=====================================================


function PointInTriangle(A, B, C, P)
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

function PointInRectangle(X, Y, Z, W, P)
{
    P.AGauche(X,Y)
    return (P.AGauche(X,Y) > 0 && P.AGauche(Y, Z) > 0 && P.AGauche(Z,W) > 0 && P.AGauche(W,X) > 0);
}