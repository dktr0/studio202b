#pragma strict

import UnityEngine.UI;


var iconObj : GameObject; //The object we are enabling/disabling as we fade it
var iconImage : Image; //The sprite renderer of the object

//When to show it
var inventoryItem = "water"; //Show when an item is picked up?
var showOnce = true; //Only show once per object in inventory? Otherwise, do we show this all the time we have the item(s)?
var showWhenAmount = 1; //How many of them do we need to show up?

var wasShown = false; //The icon was shown?

//How to hide it
var fadesOut = true; //This fades out? If not it stays!
var startColor : Color; //Start of fade color
var endColor : Color; //End of fade color
var fadeTime = 1.0; //How many seconds to fade out in?

var hideWhenFadeEnd = true; //Hide the icon when fade has ended?

private var fadeT = 0.0; //How much fading have we done so far?

private var dataObj : GameObject; //The object we need to get the script from
private var dataScript : PlayerDataHolder; //The actual script holding our between-level data

function Start () {
    if (iconObj == null) {
        iconObj = gameObject; //Assume this object is the one we want to show/hide
    }

    if (iconObj != null) {
        //Hide at start and get the sprite if null
        if (iconImage == null) {
            iconImage = iconObj.GetComponent.<Image>();
        }

        iconObj.SetActive(false);
    }
}

function Update () {
    //Poll for the object we want to update position of
    if (dataObj == null) {
        //We don't have a playerData object assigned, try and find it!
        dataObj = GameObject.FindWithTag("PlayerData");

        if (dataObj != null) {
            //We have a playerDataObj now, let's get its script

            dataScript = dataObj.GetComponent.<PlayerDataHolder>();
        }
    }

    if (iconObj != null && iconImage != null) {
        //We have an object to show!

        if (!showOnce || !wasShown) {
            //Time to check if we can show the icon!
            if ((!dataScript.haveItem(inventoryItem) && showWhenAmount == 0) || (dataScript.haveItem(inventoryItem) && showWhenAmount == 1) || (dataScript.haveItem(inventoryItem) && showWhenAmount <= dataScript.getNumOfItem(inventoryItem))) {
                //Show the icon!

                //Show it!
                iconObj.SetActive(true);
                iconImage.color = startColor;
                fadeT = 0.0;

                wasShown = true; //We showed the icon!
            }
        }


        if (iconObj.activeInHierarchy) {
            //We have an icon here!

            if (!dataScript.haveItem(inventoryItem) || dataScript.getNumOfItem(inventoryItem) < showWhenAmount) {
                //We don't have the item anymore! Hide!
                iconObj.SetActive(false);
            }
            else
            {
                //Otherwise, do normal checks

                if (fadesOut) {
                    //And it fades out!

                    if (fadeTime <= 0.0) fadeTime = 0.01; //Prevent divide by 0

                    fadeT += (Time.deltaTime / fadeTime); //Adds up every frame to be 1 / fadeTime, making fadeTime actually represent the time in seconds!

                    var startV4 : Vector4;
                    var endV4 : Vector4;
                    var outColor : Color;

                    startV4 = startColor;
                    endV4 = endColor;

                    outColor = Vector4.Lerp(startV4, endV4, fadeT); //Fade out into a color

                    iconImage.color = outColor; //Update color

                    if (fadeT >= 1.0 && hideWhenFadeEnd) {
                        iconObj.SetActive(false); //Hide it!
                    }
                }
            }
        }
    }
}
