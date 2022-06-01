 //=====================================================
/**
 * Renvoie un nombre entier aléatoire entre le min et le max inclus
 * @param {int} min minimum
 * @param {int} max maximum
 * @returns {int}nombre entier aléatoire entre le min et le max inclus
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
 * @param {float} min minimum
 * @param {float} max maximum
 * @returns {float} Nombre entier aléatoire entre le min et le max inclus
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

 
 ChargerImage = async img => {
    return new Promise((resolve, reject) => {
        img.onload = async () => {
            console.log("Image Loaded");
            resolve(true);
        };
    });
};
