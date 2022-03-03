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

 ChargerImage = async img => {
    return new Promise((resolve, reject) => {
        img.onload = async () => {
            console.log("Image Loaded");
            resolve(true);
        };
    });
};
