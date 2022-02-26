class Scene
{
    constructor()
    {
        this.ZObject = []
    }

    Calcul(Delta)
    {
        // For performance reasons, we will first map to a temp array, sort and map the temp array to the objects array.
        var map = this.ZObject.map(function (el, index) {
            return { index : index, value : el.Z };
        });
        
        // Now we need to sort the array by z index.
        map.sort(function (a, b) {
            return a.value - b.value;
        });
        
        let objects = this.ZObject;
        // We finaly rebuilt our sorted objects array.
        this.ZObject = map.map(function (el) {
            return objects[el.index];
        });
    }

    Dessin(Context)
    {
        for (var i = 0; i < this.ZObject.length; i++) {
            this.ZObject[i].Dessin(Context);
        }
    }
}