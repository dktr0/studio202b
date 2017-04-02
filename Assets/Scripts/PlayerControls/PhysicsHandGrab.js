#pragma strict

var cameraObj : Transform;
var handObj : Transform;

var grabDist = 2.0; //Max distance to try grabbing?
var holdDist = 1.0; //Min distance to hold object still?
var holdMass = 1.0; //Max mass to be held ?
var letGoDist = 15.0; //Max distance before we drop it?
var throwStrength = 10.0; //Strength of a throw?
var rayMask : LayerMask; //Layer to raycast on

var carryStrength = 1; //How much force to carry?
var carryObjID = -1; //Index of the object we are currently carrying
var carryObj : GameObject; //The object to carry
var carryRB : Rigidbody; //Rigidbody of the object we are carrying

var wasHeld = false; //Was holding an object?

function Start () {
    if (cameraObj == null) {
        //Try and find the camera
        var g : GameObject;
        g = GameObject.FindWithTag("MainCamera");

        if (g != null) {
            cameraObj = g.transform;
        }
    }

    if (handObj == null) {
        //Assume we are the hand
        handObj = gameObject.transform;
    }
}

function Update () {
    if (Input.GetButton("Fire1") && !Input.GetButton("Fire2")) {
	    //Based on https://docs.unity3d.com/ScriptReference/RaycastHit-collider.html
	    
        if (carryObjID == -1 && !wasHeld) {
            //Not carrying anything, look for something
            var hit: RaycastHit;
            var direction : Vector3;

            direction = handObj.position - cameraObj.position;

            if (Physics.Raycast(cameraObj.position, direction.normalized, hit, grabDist, rayMask)) {
                if (hit.collider != null) {
                    var g : GameObject;
                    g = hit.collider.gameObject;
                    
                    carryObjID = g.GetInstanceID();
                    carryObj = g;
                    carryRB = g.GetComponent.<Rigidbody>();

                    wasHeld = true;
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

    if (!Input.GetButton("Fire1")) {
        wasHeld = false;
        //Done holding it down
    }
}

function FixedUpdate() {
    //Pull the object towards our hand using force by default
    if (carryObjID != -1 && carryObj != null && carryRB != null) {

        var direction : Vector3;

        direction = handObj.position - carryObj.transform.position;

        var distance = direction.magnitude;

        if (!Input.GetButton("Fire2") || distance > holdDist) {
            //Actually only pull if not throwing it

            if (distance < holdDist && carryRB.mass <= holdMass) {
                //Close enough to hold still and it's not too heavy
                carryObj.transform.position = handObj.position;

                carryRB.velocity = new Vector3(0, 0, 0);
            } else if (distance < letGoDist) {
                //Pull it closer
                carryRB.AddForce(direction.normalized * carryStrength * Time.smoothDeltaTime);
            }
            else {
                //We drop it! Further than drop distance
                carryObjID = -1;
                carryObj = null;
                carryRB = null;
            }
        }
        else {
            //Throw the object if we are holding it
            carryRB.AddForce(cameraObj.forward * throwStrength * Time.smoothDeltaTime * 60); //60fps is target

            carryObjID = -1;
            carryObj = null;
            carryRB = null;
        }
    }
}
