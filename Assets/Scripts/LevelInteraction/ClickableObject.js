#pragma strict

//This object is clickable, will perform an action if able

//Trigger conditions
var requiresItem = false; //Does this require an item?
var itemRequired = "water"; //The item to use
var numRequired = 1; //How many are required?
var useItem = false; //Use up the item when clicked?

var triggerOnce = true; //Only happen once?
var wasTriggered = false; //Was this triggered?

var forceTrigger = false; //Force it to trigger?

//Actions
var triggerAnimation : AnimationTrigger; //Try to activate an animation trigger?
var trigAnimSkipItemCheck = false; //Skip the item check on the animator?

var givesItem = false; //Does this give an item?
var itemGiven = "ice"; //Item to give the player?

//Spawn another object at position
var spawnObject : GameObject; //Spawn another object, best used for effects that die on their own, or prefabs that are otherwise interactive
var spawnPos : Transform; //Spawn at transform if given
var spawnAltPos : Vector3; //If no transform given, spawn at Vector3

//Trigger another clickable object
var triggerOtherClickable : ClickableObject;
var trigOtherSkipItemCheck = false; //Skip the item check on it?

//Sound specific code
var activatedSound : AudioSource;
var missingItemSound : AudioSource;

//Enable or disable game objects
var enableObject : GameObject; //Enable a game object
var disableObject : GameObject; //Disable a game object

var disableThisObject = false; //Does this get destroyed on click?

//Physics specific code
var affectRigidBody : Rigidbody;
var setKinematic = false; //Make it kinematic?
var disableGravity = false; //Disable gravity?
var setMass = false; //Change mass?
var newMass = 1.0; //The new mass
var setVelocity = false; //Set velocity?
var newVelocity : Vector3; //Force velocity to

//Change tag of an object
var changeTagOf : GameObject;
var changeTagTo = "Untagged"; //Change the tag of the object

//Change layer of an object
var changeLayerOf : GameObject;
var changeLayerTo = "Default"; //What layer to put it on?

var printDebugText = ""; //Print to debug log?

private var dataObj : GameObject; //The object we need to get the script from
private var dataScript : PlayerDataHolder; //The actual script holding our between-level data

function Start () {

}

function Update () {
    //Poll for the object we want to check inventory from
    if (dataObj == null) {
        //We don't have a playerData object assigned, try and find it!
        dataObj = GameObject.FindWithTag("PlayerData");

        if (dataObj != null) {
            //We have a playerDataObj now, let's get its script

            dataScript = dataObj.GetComponent.<PlayerDataHolder>();
        }
    }

    if (forceTrigger) {
        //Could be used for objects that are disabled at start, that activate when enabled
        performTrigger(true); //Skip item check

        forceTrigger = false;
    }
}

function performClick() {
    //We have been clicked!
    performTrigger(false); //Do what we're meant to! and don't skip item check
}

function performTrigger(skipCheck) {
    if (!triggerOnce || !wasTriggered) {
        //We haven't been triggered or can be triggered multiple times
        if (!requiresItem || (dataScript.haveItem(itemRequired) && numRequired <= 1) || (dataScript.haveItem(itemRequired) && numRequired <= dataScript.getNumOfItem(itemRequired)) || skipCheck) {
            //We have the item or don't need it!

            if (triggerAnimation != null) {
                //We have an animation to trigger!
                triggerAnimation.performTrigger(trigAnimSkipItemCheck); //Tell the animator to do what it needs to, and whether it needs to do an item check
            }

            if (givesItem) {
                dataScript.giveItem(itemGiven); //Give the player an item
            }

            if (enableObject != null) {
                //Enable an object
                enableObject.SetActive(true);
            }

            if (disableObject != null) {
                //Disable an object
                disableObject.SetActive(false);
            }

            if (spawnObject != null) {
                //Trigger an object to spawn too!
                if (spawnPos != null) {
                    //Spawn at another transform
                    Instantiate(spawnObject, spawnPos.position, Quaternion.identity);
                }
                else {
                    //Spawn at Vector3
                    Instantiate(spawnObject, spawnAltPos, Quaternion.identity);
                }
            }

            if (triggerOtherClickable != null) {
                //Trigger ANOTHER clickable object script to activate too, but with or without its item check
                triggerOtherClickable.performTrigger(trigOtherSkipItemCheck);
            }

            if (useItem && !skipCheck) {
                //Remove the item we required
                dataScript.useItem(itemRequired);
            }

            if (affectRigidBody != null) {
                //Affect a physical body

                affectRigidBody.isKinematic = setKinematic;
                affectRigidBody.useGravity = !disableGravity;
                
                if (setMass) {
                    affectRigidBody.mass = newMass;
                }

                if (setVelocity) {
                    affectRigidBody.velocity = newVelocity;
                }
            }

            if (changeTagOf != null) {
                //We have an object to change the tag of!
                changeTagOf.tag = changeTagTo;
            }

            if (changeLayerOf != null) {
                //We have an object to change the layer of!
                changeLayerOf.layer = LayerMask.NameToLayer(changeLayerTo);
            }

            wasTriggered = true; //We have been triggered

            if (activatedSound != null && !activatedSound.isPlaying) {
                //Play an activate sound if we are meant to
                activatedSound.Play();
            }

            if (printDebugText != "") {
                //Write some text to console
                Debug.Log(printDebugText);
            }

            if (disableThisObject) {
                //Disable ourselves
                gameObject.SetActive(false);
            }
        }
        else {
            if (missingItemSound != null && !missingItemSound.isPlaying) {
                //Play item missing sound if we are meant to
                missingItemSound.Play();
            }
        }
    }
}
