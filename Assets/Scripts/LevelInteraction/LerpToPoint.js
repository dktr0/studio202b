#pragma strict

var triggered = false; //Has this been activated?
var gameObj : GameObject; //Object to move

var changePos = true; //Change position of the object?
var changeAngle = false; //Change the angle too?


var useTrackObjInstead = true; //Use a tracking object instead?
var trackObj : Transform; //The transform of the object we are tracking


var endPoint : Vector3; //Position to move to
var endAngle : Vector3; //Angle to rotate towards?

var disableRigidBody = true; //Make rigidbody Kinematic
var enableRigidBody = false; //Enable the RB?
var objectRB : Rigidbody; //The rigidbody to make kinematic

var lerpTime = 1.0; //How fast to lerp to position?
var lerpAngTime = 1.0; //How fast to lerp to angle?

var wasDisabled = false;
var wasEnabled = false;

function Start () {
    if (gameObj == null) {
        Debug.Log("No object attached to: " + gameObject.name + "!");
    }
    else {
        objectRB = gameObj.GetComponent.<Rigidbody>();

        if (objectRB == null) {
            //Nothing here to get
            disableRigidBody = false;
            enableRigidBody = false;
            Debug.Log("No rigidbody attached to: " + gameObject.name + "!");
        }
    }

    if (useTrackObjInstead) {
        if (trackObj == null) {
            Debug.Log("No tracking object attached to: " + gameObject.name + "!");
            Debug.Log("Reverting to numerical values");

            useTrackObjInstead = false;
        }
    }
}

function Update () {
    if (triggered) {
        
        var step = lerpAngTime * 30.0 * Time.deltaTime;

        if (useTrackObjInstead) {
            //Track an object instead
            if (changePos) {
                gameObj.transform.position = Vector3.Lerp(gameObj.transform.position, trackObj.position, (lerpTime * Time.deltaTime));
            }

            if (changeAngle) {
                gameObj.transform.rotation = Quaternion.RotateTowards(gameObj.transform.rotation, trackObj.rotation, step);
            }
        } else {
            if (changePos) {
                //Move actively to the position
                var newPos : Vector3;

                newPos = gameObj.transform.position;

                newPos.x = Mathf.Lerp(newPos.x, endPoint.x, (lerpTime * Time.deltaTime));
                newPos.y = Mathf.Lerp(newPos.y, endPoint.y, (lerpTime * Time.deltaTime));
                newPos.z = Mathf.Lerp(newPos.z, endPoint.z, (lerpTime * Time.deltaTime));
        
                gameObj.transform.position = newPos;

            }

            if (changeAngle) {
                var targetRot = Quaternion.identity;
            
                if (endAngle != Vector3.zero) {
                    targetRot = Quaternion.LookRotation(endAngle);
                }

                // Rotate our transform a step closer to the target's.
                gameObj.transform.rotation = Quaternion.RotateTowards(gameObj.transform.rotation, targetRot, step);
            }
        }

        //Quick enable / disable physics stuff
        if (disableRigidBody && !wasDisabled) {
            //Disable the rigidbody
            objectRB.isKinematic = true;
            wasDisabled = true;
        }

        if (enableRigidBody && !wasEnabled) {
            //Enable the rigidbody
            objectRB.isKinematic = false;
            wasEnabled = true;
        }
    }
    else {
        if (wasEnabled) {
            //Disable the rigidbody
            objectRB.isKinematic = true;
            wasEnabled = false;
        }

        if (wasDisabled) {
            //Enable the rigidbody
            objectRB.isKinematic = false;
            wasDisabled = false;
        }
    }
}
