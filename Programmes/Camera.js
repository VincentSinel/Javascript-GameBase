class Camera
{
    static X = 0;
    static Y = 0;
    static Zoom = 100;
    static Direction = 0;

    /**
     * Adapte une position X à celle de la camera
     * @param {number} posX 
     * @returns Position X vis à vis de la camera
     */
    static AdapteX(posX)
    {
        return posX - this.X;
    }
    /**
     * Adapte une position Y à celle de la camera
     * @param {number} posY 
     * @returns Position Y vis à vis de la camera
     */
    static AdapteY(posY)
    {
        return - (posY - this.Y);
    }
    /**
     * Adapte un Zoom à celui de la camera
     * @param {number} posX 
     * @returns Zoom vis à vis de la camera
     */
    static AdapteZoom(zoom)
    {
        return this.Zoom / 100.0 * zoom / 100.0
    }
}