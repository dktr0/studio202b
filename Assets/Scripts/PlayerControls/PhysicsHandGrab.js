#pragma strict

var cameraObj : Transform;
var handObj : Transform;

var grabDist = 2; //Max distance to try grabbing?
var rayMask : LayerMask; //Layer to raycast on

var carryStrength = 1; //How much force to carry?
var carryObjID = -1; //Index of the object we are currently carrying
var carryObj : GameObject; //The object to carry
var carryRB : Rigidbody; //Rigidbody of the object we are carrying

function Start () {
	
}

function Update () {
    if (Input.GetButton("Fire1")) {
	    //Based on https://docs.unity3d.com/ScriptReference/RaycastHit-collider.html
	    
        if (carryObjID == -1) {
            //Not carrying anything, look for something
            var hit: RaycastHit;
            var direction : Vector3;

            direction = handObj.position - cameraObj.position;

            if (Physics.Raycast(cameraObj.position, direction.normalized, hit, grabDist, rayMask)) {
                if (hit.collider != null) {
                    var g : GameObject;
                    g = hit.collider.gameObject;
                    Debug.Log(g.tag);
                    
                    carryObjID = g.GetInstanceID();
                    carryObj = g;
                    carryRB = g.GetComponent.<Rigidbody>();
                }
            }
        }
    }
    else {
        //Let go of of the object
        carryObjID = -1;
        carryObj = null;
        carryRB = null;
    }
}

function FixedUpdate() {
    if (carryObjID != -1 && carryObj != null && carryRB != null) {
        //Pull the object towards our hand using force
        var direction : Vector3;

        direction = handObj.position - carryObj.transform.position;

        carryRB.AddForce(direction.normalized * carryStrength * Time.smoothDeltaTime);
    }
}
