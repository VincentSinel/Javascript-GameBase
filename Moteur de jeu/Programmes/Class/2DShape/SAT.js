// Crédit : Andrew Sevenson
// SOURCE : https://www.sevenson.com.au/programming/sat/
// https://github.com/sevdanski/SAT_JS/blob/main/src/js/sat.js

// Modifié pour mon utilisation

class SATCollisionInfo
{
    shapeA = null;						// the first shape
    shapeB = null;						// the second shape
    distance = 0;					    // how much overlap there is
    vector = new Vector();			    // the direction you need to move - unit vector
    shapeAContained = false;		    // is object A contained in object B
    shapeBContained = false;		    // is object B contained in object A
    separation = new Vector();           // how far to separate
}
/**
 * Module de detection de collision entre deux objets
 * @class
 */
class SAT
{
    /**
     * Effectue un test de collision entre un objet A et B.
     * @param {Shape} shapeA Forme A
     * @param {Shape} shapeB Forme B
     * @returns {SATCollisionInfo} Info concernant la collision
     */
    static test(shapeA, shapeB)
    {
        if (shapeA instanceof Circle && shapeB instanceof Circle)
        {
            return this._circleCircleTest(shapeA, shapeB)
        }
        else if (shapeA instanceof Polygon && shapeB instanceof Polygon)
        {
            // run a test of each polygon against the other
            let testAB = this._polygonPolygonTest(shapeA, shapeB);
            if (!testAB) return null; // a gap was found
            
            let testBA = this._polygonPolygonTest(shapeB, shapeA, true);  // note the 'flip' flag is set.
            if (!testBA) return null; // a gap was found
            
            // figure out the shortest of the two result sets
            let result = (Math.abs(testAB.distance) < Math.abs(testBA.distance)) ? testAB : testBA;

            // hack the contained flag to be the union of the two
            result.shapeAContained = testAB.shapeAContained && testBA.shapeAContained;
            result.shapeBContained = testAB.shapeBContained && testBA.shapeBContained;

            return result;
        }

        // circle / polygon is all that is left
        if ((shapeA instanceof Circle && shapeB instanceof Polygon) || (shapeB instanceof Circle && shapeA instanceof Polygon))
        {
            let shapeAIsCircle = shapeA instanceof Circle;
            return this._circlePolygonTest(
                shapeAIsCircle ? shapeA : shapeB, 
                shapeAIsCircle ? shapeB : shapeA,
                !shapeAIsCircle);
        }

        return null;
    }

    // tests two polygons by comparing them on all sides of polygonA
    static _polygonPolygonTest(polygonA, polygonB, flipResultPositions = false)
    {
        let shortestDist = Number.MAX_VALUE;


        // set up the result object
        let result = new SATCollisionInfo();
        result.shapeA = flipResultPositions ? polygonB : polygonA;
        result.shapeB = flipResultPositions ? polygonA : polygonB;
        result.shapeAContained = true;
        result.shapeBContained = true;

        // collect all of the verts in new arrays so you don't corrupt the originals
        let verts1 = polygonA.getTransformedVerts();
        let verts2 = polygonB.getTransformedVerts();

        // small hack to make line segments work by adding in a small amount of depth
        this._patchLineVerts(verts1);
        this._patchLineVerts(verts2);

        // get the offset between the two shapes
        let vOffset = new Vector(polygonA.x - polygonB.x, polygonA.y - polygonB.y);
        
        // loop over all of the sides on the first polygon and check the perpendicular axis
        for (let i = 0; i < verts1.length; i++)
        {
            // get the perpendicular axis that we will be projecting onto
            let axis = SAT._getPerpendicularAxis(verts1, i);
            // project each point onto the axis 
            let polyARange = SAT._projectVertsForMinMax(axis, verts1);
            let polyBRange = SAT._projectVertsForMinMax(axis, verts2);

            // shift the first polygons min max along the axis by the amount of offset between them
            var scalerOffset = SAT._vectorDotProduct(axis, vOffset);
            polyARange.min += scalerOffset;
            polyARange.max += scalerOffset;

            // now check for a gap betwen the relative min's and max's
            if ( (polyARange.min - polyBRange.max > 0) || (polyBRange.min - polyARange.max > 0)  )
            {
                // there is a gap - bail
                return null;
            }

            // check for containment
            this._checkRangesForContainment(polyARange, polyBRange, result, flipResultPositions);

            // calc the separation and store if this is the shortest
            let distMin = (polyBRange.max - polyARange.min) * -1;
            if (flipResultPositions) distMin *= -1;

            // check if this is the shortest by using the absolute val
            let distMinAbs = Math.abs(distMin);
            if (distMinAbs < shortestDist)
            {
                shortestDist = distMinAbs;

                result.distance = distMin;
                result.vector = axis;
            }
        }

        // calc the final separation
        result.separation = new Vector(result.vector.x * result.distance, result.vector.y * result.distance);

        // if you make it here then no gaps were found
        return result;

    }

    static _circlePolygonTest(circle, polygon, flipResultPositions)
    {
        let shortestDist = Number.MAX_VALUE;

        // set up the result object
        let result = new SATCollisionInfo();
        result.shapeA = flipResultPositions ? polygon : circle;
        result.shapeB = flipResultPositions ? circle : polygon;
        result.shapeAContained = true;
        result.shapeBContained = true;  
        
        // collect all of the verts in new arrays so you don't corrupt the originals
        let verts = polygon.getTransformedVerts();
        // small hack to make line segments work by adding in a small amount of depth
        this._patchLineVerts(verts);        

        // get the offset between the two shapes
        let vOffset = new Vector(polygon.x - circle.x, polygon.y - circle.y);

        // find the closest point
        let closestVertex = new Vector();
        for (let vert of verts)
        {
            let dist = Math.pow(circle.x - (polygon.x + vert.x), 2) + Math.pow(circle.y - (polygon.y + vert.y), 2);
            if (dist < shortestDist)
            {
                shortestDist = dist;
                closestVertex.x = polygon.x + vert.x;
                closestVertex.y = polygon.y + vert.y;
            }
        }


        // calculate the axis from the circle to the point
        let axis = new Vector(closestVertex.x - circle.x, closestVertex.y - circle.y);
        axis = axis.normalize();

        // project the polygon onto this axis
        let polyRange = SAT._projectVertsForMinMax(axis, verts);

        // shift the polygon along the axis
        var scalerOffset = SAT._vectorDotProduct(axis, vOffset);
        polyRange.min += scalerOffset;
        polyRange.max += scalerOffset;

        // project the circle onto this axis
        let circleRange = this._projectCircleForMinMax(axis, circle);

        // if there is a gap then bail now
        if ( (polyRange.min - circleRange.max > 0) || (circleRange.min - polyRange.max > 0)  )
        {
            // there is a gap - bail
            return null;
        }


        // calc the separation and store if this is the shortest
        let distMin = (circleRange.max - polyRange.min);
        if (flipResultPositions) distMin *= -1;

        // store this as the shortest distances because it is the first
        shortestDist = Math.abs(distMin);

        result.distance = distMin;
        result.vector = axis;
        
        // check for containment
        this._checkRangesForContainment(polyRange, circleRange, result, flipResultPositions);


        // now loop over the polygon sides and do a similar thing
        for (let i = 0; i < verts.length; i++)
        {
            // get the perpendicular axis that we will be projecting onto
            axis = SAT._getPerpendicularAxis(verts, i);
            // project each point onto the axis and circle 
            polyRange = SAT._projectVertsForMinMax(axis, verts);

            // shift the first polygons min max along the axis by the amount of offset between them
            var scalerOffset = SAT._vectorDotProduct(axis, vOffset);
            polyRange.min += scalerOffset;
            polyRange.max += scalerOffset;

            // project the circle onto this axis
            circleRange = this._projectCircleForMinMax(axis, circle);

            // now check for a gap betwen the relative min's and max's
            if ( (polyRange.min - circleRange.max > 0) || (circleRange.min - polyRange.max > 0)  )
            {
                // there is a gap - bail
                return null;
            }

            // check for containment
            this._checkRangesForContainment(polyRange, circleRange, result, flipResultPositions);

            distMin = (circleRange.max - polyRange.min);// * -1;
            if (flipResultPositions) distMin *= -1;

            // check if this is the shortest by using the absolute val
            let distMinAbs = Math.abs(distMin);
            if (distMinAbs < shortestDist)
            {
                shortestDist = distMinAbs;

                result.distance = distMin;
                result.vector = axis;
            }
        }

        // calc the final separation
        result.separation = new Vector(result.vector.x * result.distance, result.vector.y * result.distance);

        // if you make it here then no gaps were found
        return result;



    }


    // helper method that compares 2 ranges and updates the contained flag in the related info
    static _checkRangesForContainment(rangeA, rangeB, collisionInfo, flipResultPositions)
    {
        if (flipResultPositions)
        {
            if (rangeA.max < rangeB.max || rangeA.min > rangeB.min) collisionInfo.shapeAContained = false;				
            if (rangeB.max < rangeA.max || rangeB.min > rangeA.min) collisionInfo.shapeBContained = false;	
        }
        else
        {
            if (rangeA.max > rangeB.max || rangeA.min < rangeB.min) collisionInfo.shapeAContained = false;
            if (rangeB.max > rangeA.max || rangeB.min < rangeA.min) collisionInfo.shapeBContained = false;
        }
    }



    // loops over all of the vertices in an array, projects them onto the given axis, and return the min / max range of all points
    static _projectVertsForMinMax(axis, verts)
    {
        // note that we project the first point to both min and max
        let min = SAT._vectorDotProduct(axis, verts[0]);
        let max = min;

        // now we loop over the remiaing vers, updating min/max as required
        for (let j = 1; j < verts.length; j++)
        {
            let temp = SAT._vectorDotProduct(axis, verts[j]);
            if (temp < min) min = temp;
            if (temp > max) max = temp;
        }

        return {min: min, max: max};
    }

    static _projectCircleForMinMax(axis, circle) {
        let proj = this._vectorDotProduct(axis, new Vector(0,0) );
        return {
            min: proj - circle.radius,
            max: proj + circle.radius
        };
    }

    // helper for calculating the dot product of 2 vectors
    static _vectorDotProduct(pt1, pt2)
    {
        return (pt1.x * pt2.x) + (pt1.y * pt2.y);
    }


    // small helper method that looks at the verts of the polygon and return the perpendicular axis of a particular side
    static _getPerpendicularAxis(verts, index)
    {
        let pt1 = verts[index];
        let pt2 = index >= verts.length-1 ? verts[0] : verts[index+1];  // get the next index, or wrap around if at the end

        let axis = new Vector(-(pt2.y - pt1.y), pt2.x - pt1.x);
        axis = axis.normalize();
        return axis;
    }


    // if a polygon is a line, then add in a third point to make it act line a very thing rectangle
    static _patchLineVerts(verts)
    {
        if (verts.length == 2)
        {
            let [p1,p2] = verts;
            var pt = new Vector(-(p2.y - p1.y), p2.x - p1.x);
            pt = pt.time(0.000001)
            //pt.magnitude = 0.000001;
            verts.push(pt);
        }
    }


    static _circleCircleTest(circleA, circleB,)
    {
        let radiusTotal = circleA.radius + circleB.radius;
        let distanceBetween = Math.sqrt(Math.pow(circleB.x - circleA.x, 2) + Math.pow(circleB.y - circleA.y, 2));

        if (distanceBetween >radiusTotal)
            return null; // too far apart

        // there is overlap
        let result = new SATCollisionInfo();
        result.shapeA = circleA;
        result.shapeB = circleB;
        
        // vector is based on the two center points
        result.vector = new Vector(circleB.x - circleA.x, circleB.y - circleA.y);
        result.vector = result.vector.normalize();  // turn it into a unit vector

        // distance between
        result.distance = distanceBetween

        // separation is based on the vector and the difference
        var diff = radiusTotal - distanceBetween
        result.separation = new Vector(result.vector.x * diff, result.vector.y * diff);

        //  calc if they are contained based on if the shape is smaller and too close
        var radA = circleA.radius;
        var radB = circleB.radius;
        result.shapeAContained = radA <= radB && distanceBetween <= radB - radA;
        result.shapeBContained = radB <= radA && distanceBetween <= radA - radB;

        return result;
    }
}