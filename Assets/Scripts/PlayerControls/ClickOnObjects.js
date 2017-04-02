#pragma strict

//Check if the player can click on objects from their Hand object
var cameraObj : Transform;
var handObj : Transform;

var physicsCheck : PhysicsHandGrab; //Make sure we're not carrying things

var clickDist = 3.0; //Max distance to try clicking?
var rayMask : LayerMask; //Layer to raycast on

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
    if (Input.GetButton("Fire1")) {
        //Based on https://docs.unity3d.com/ScriptReference/RaycastHit-collider.html
	    
        if (physicsCheck == null || physicsCheck.carryObjID == -1) {
            //Not carrying anything, we can click!
            var hit: RaycastHit;
            var direction : Vector3;

            direction = handObj.position - cameraObj.position;

            if (Physics.Raycast(cameraObj.position, direction.normalized, hit, clickDist, rayMask)) {
                if (hit.collider != null) {
                    var g : GameObject;
                    g = hit.collider.gameObject;

                    var clickObj : ClickableObject; //We're going to try and get the clickable object from the clicked target

                    clickObj = g.GetComponent.<ClickableObject>();

                    if (clickObj != null) {
                        clickObj.performClick(); //Try to click it!
                    }
                }
            }
        }
    }
}
