#pragma strict

//Triggers an action of some sort when collides with another object
//Similar to a clickable object, but this can't be forced and is designed more as a reaction than an action
//Also can trigger a clickable object

//Trigger conditions
var requiresItem = false; //Does this require an item?
var itemRequired = "water"; //The item to use
var numRequired = 1; //How many are required?
var useItem = false; //Use up the item when clicked?

var tagDetect = "Untagged"; //The tag to look for
var triggerOnce = false; //Trigger once?
var wasTriggered = false; //Was triggered?

//Affect ourselves
var disableSelf = false; //Disable ourselves?
var changeSelfTag = false; //Change our tag?
var selfNewTag = "Untagged"; //The new tag to assign to ourselves

//Affect objects that touch us
var disableDetected = false; //Disable what we have detected?

var movesObject = false; //Moves the object somewhere else? (TELEPORT!)
var moveToObj : Transform; //Move object to new position
var moveToPos : Vector3; //Move to position if not object
var posIsOffset = false; //The suggested position is actually an offset?

var spawnAtObj = false; //Spawn something at the object?
var objToSpawn : GameObject; //Object to spawn
var spawnOffset : Vector3; //Offset to spawn at?
var spawnOnce = false; //Only once?
var haveSpawned = false; //Have we spawned?

//Physics specific code
var affectRigidBody = false; //Affect the rigidbody on this object?
var setKinematic = false; //Make it kinematic?
var disableGravity = false; //Disable gravity?
var setMass = false; //Change mass?
var newMass = 1.0; //The new mass
var setVelocity = false; //Set velocity?
var newVelocity : Vector3; //Force velocity to

//Change tag of the object
var changeObjectTag = false;
var changeTagTo = "Untagged"; //Change the tag of the object

//Change layer of an object
var changeObjectLayer = false;
var changeLayerTo = "Default"; //What layer to put it on?

//Misc object specific code
var debugNameDetected = false; //Print the name of detected?

//Affect other things
var triggerClickable : ClickableObject; //Trigger another clickable object
var trigClickSkipItemCheck = false; //Trigger the clickable item to skip item check?

var givesItem = false; //Does this give an item?
var itemGiven = "ice"; //Item to give the player?
var givesOnce = true; //Gives just one?
var haveGiven = false; //Have given?

//Sound specific code
var activatedSound : AudioSource;
var missingItemSound : AudioSource;

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
}

function OnTriggerEnter(c : Collider) {
    if (c.tag == tagDetect) {
        //We found our object, now act on this
        performTrigger(c.gameObject);
    }
}

function performTrigger(g : GameObject) {
        
    var rb : Rigidbody;
        
    if (g != null) {
        //Just in case we do physics changes to object
        rb = g.GetComponent.<Rigidbody>();
    }

    if (!triggerOnce || !wasTriggered) {
        //We haven't triggered before or can trigger multiple times?

        if (!requiresItem || (dataScript.haveItem(itemRequired) && numRequired <= 1) || (dataScript.haveItem(itemRequired) && numRequired <= dataScript.getNumOfItem(itemRequired))) {
            //We can trigger!

            if (movesObject) {
                //Basically teleport the object!
                if (moveToObj != null) {
                    //We move to the target object
                    if (posIsOffset) {
                        //Use the position as an offset
                        g.transform.position = moveToObj.position + moveToPos;
                    } else {
                        //No use of position
                        g.transform.position = moveToObj.position;
                    }
                }
                else {
                    //We have no target
                    if (posIsOffset) {
                        //Move at offset from objects CURRENT position!
                        g.transform.position = g.transform.position + moveToPos;
                    }
                    else {
                        //Move directly to position
                        g.transform.position = moveToPos;
                    }
                }
            }

            if (spawnAtObj && objToSpawn != null && (!haveSpawned || !spawnOnce)) {
                //Spawn an object at the position, great for particle effects!
                Instantiate(objToSpawn, g.transform.position + spawnOffset, Quaternion.identity);

                haveSpawned = true;
            }

            if (affectRigidBody && rb != null) {
                //Affects a physical body
                rb.isKinematic = setKinematic;
                rb.useGravity = !disableGravity;
                
                if (setMass) {
                    rb.mass = newMass;
                }

                if (setVelocity) {
                    rb.velocity = newVelocity;
                }
            }

            if (changeObjectTag) {
                //Change the tag of the object that touched us, could be used to put an item through stages of matter!
                g.tag = changeTagTo;
            }

            if (changeObjectLayer) {
                //Change the layer of the object
                g.layer = LayerMask.NameToLayer(changeLayerTo);
            }

            if (givesItem && (!haveGiven || !givesOnce)) {
                dataScript.giveItem(itemGiven); //Give the player an item

                haveGiven = true;
            }

            if (triggerClickable != null) {
                //Trigger ANOTHER clickable object script to activate too, but with or without its item check
                triggerClickable.performTrigger(trigClickSkipItemCheck);
            }

            if (useItem) {
                //Remove the item we required
                dataScript.useItem(itemRequired);
            }

            wasTriggered = true; //We have been triggered

            if (activatedSound != null && !activatedSound.isPlaying) {
                //Play an activate sound if we are meant to
                activatedSound.Play();
            }

            if (disableDetected) {
                g.SetActive(false); //Disable it
            }

            if (changeSelfTag) {
                gameObject.tag = selfNewTag;
            }

            if (disableSelf) {
                gameObject.SetActive(false);
            }
        } else {
            if (missingItemSound != null && !missingItemSound.isPlaying) {
                //Play item missing sound if we are meant to
                missingItemSound.Play();
            }
        }
    }

    if (debugNameDetected) {
        //Name it if we want to
        Debug.Log(g.name);
    }
}