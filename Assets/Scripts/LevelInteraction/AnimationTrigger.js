#pragma strict

var tagDetect = "Player"; //The tag to look for
var m_Anim : Animator; //My animator

var animBool = "start"; //Bool to set in the animation controller?
var setBoolTrue = true; //Set the bool to true

var triggerOnce = true; //Triggers once?

var wasTriggered = false; //Was this triggered?

var forceTrigger = false; //Force the trigger active?

//Extra inventory-specific code
private var dataObj : GameObject; //The object we need to get the script from
private var dataScript : PlayerDataHolder; //The actual script holding our between-level data

var requiresItem = false; //Requires an item?
var item = "keycard"; //The item we require
var numRequired = 1; //How many are required?
var removeItem = false; //Remove the item from the player? Only removes one!

//Sound specific code
var activatedSound : AudioSource;
var missingItemSound : AudioSource;

function Start() {
    if (m_Anim == null) {
        m_Anim = GetComponent.<Animator>();
    }
}

function Update() {
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

function OnTriggerEnter(c : Collider) {
    if (c.tag == tagDetect && m_Anim != null) {
        performTrigger(false); //Try to trigger and don't skip inventory check
    }
}

function performTrigger(skipCheck) {
    if (!wasTriggered || !triggerOnce) {
        //We can trigger! Maybe! Check if we need inventory

        if (!requiresItem || (dataScript.haveItem(item) && numRequired <= 1) || (dataScript.haveItem(item) && numRequired <= dataScript.getNumOfItem(item)) || skipCheck) {
            //We either don't need items or we have the item(s) in question

            m_Anim.SetBool(animBool, setBoolTrue);

            wasTriggered = true;

            if (removeItem && !skipCheck) {
                //Remove the item from inventory if we must
                dataScript.useItem(item);
            }

            if (activatedSound != null) {
                //Play an activate sound if we are meant to
                activatedSound.Play();
            }
        }
        else {
            if (missingItemSound != null) {
                //Play item missing sound if we are meant to
                missingItemSound.Play();
            }
        }
            
    }
}