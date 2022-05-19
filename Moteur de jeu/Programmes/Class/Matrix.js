class Matrix
{
    /**
     * Créer une matrice de rotation à partir d'un angle
     * @param {float} angle Angle en radian de la rotation
     * @returns {Matrix} Matrice représentant la rotation
     */
    static fromrotation(angle)
    {
        var m = new Matrix(2,2);
        m.matrix[0][0] = Math.cos(angle);
        m.matrix[0][1] = Math.sin(angle);
        m.matrix[1][0] = -Math.sin(angle);
        m.matrix[1][1] = Math.cos(angle);
        return m;
    }

    /**
     * Créer une matrice de la taille donnée
     * @class
     * @param {int} sizex Largeur de la matrice
     * @param {int} sizey Hauteur de la matrice
     */
    constructor(sizex,sizey)
    {
        this.width = sizex;
        this.height = sizey;
        this.matrix = [];
        
        for(let i = 0; i < sizex; i++)
        {
            this.matrix.push([]);
            for(let j = 0; j < sizey; j++)
            {
                this.matrix[i].push(0);
            }
        }
    }

    /**
     * Multiplie la matrice avec une autre ou avec un vecteur.
     * @param {(Matrix|Vector)} Matrice ou vecteur.
     * @returns {(Matrix|Vector)} Matrice ou vecteur.
     */
    time(matrix)
    {
        if ((matrix instanceof Matrix))
        {
            if (this.width == matrix.height)
            {
                var m = new Matrix(matrix.width,this.height);
                for(let j = 0; j < matrix.width; j++)
                {
                    for(let i = 0; i < this.height; i++)
                    {
                        for(let k = 0; k < this.width; k++)
                        {
                            m.matrix[j][i] += this.matrix[k][i] * matrix.matrix[j][k];
                        }
                    }
                }
            }
            else
            {
                throw "Les deux matrices ne peuvent pas être multiplié car les tailles diffèrent";
            }
        }
        else if ((matrix instanceof Vector))
        {
            if (this.width < 4)
            {
                let x = this.matrix[0][0] * matrix.x;
                let y = 0;
                let z = matrix.z;
                if (this.width > 1)
                {
                    x += this.matrix[1][0] * matrix.y;
                    if (this.width > 2)
                    {
                        x += this.matrix[2][0] * matrix.z;
                    }
                }
                if (this.height > 1)
                {
                    y = this.matrix[0][1] * matrix.x;
                    if (this.width > 1)
                    {
                        y += this.matrix[1][1] * matrix.y;
                        if (this.width > 2)
                        {
                            y += this.matrix[2][1] * matrix.z;
                        }
                    }
                }
                if (this.height > 2)
                {
                    z = this.matrix[0][2] * matrix.x;
                    if (this.width > 1)
                    {
                        z += this.matrix[1][2] * matrix.y;
                        if (this.width > 2)
                        {
                            z += this.matrix[2][2] * matrix.z;
                        }
                    }
                }
                return new Vector(x, y, z);
            }
            else
            {
                throw "La matrice est trop large pour être multiplié avec un vecteur"
            }
        }
        else
        {
            console.log(matrix);
            throw "L'objet n'est ni un vecteur ni une matrice"
        }
    }


}