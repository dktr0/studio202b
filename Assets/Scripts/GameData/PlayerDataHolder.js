#pragma strict

var playerSpawnPoint : Vector3; //What position are we spawning at?
var ignoreSpawnPoint = false; //Ignore spawning? Set in editor or by another script

var playerEulerAngle : Vector3; //What angle should the player be facing?
var ignoreEulerAngle = false; //Ignore the angle?

var inventory = new Array(); //An array of strings which will hold what objects we have

var debugInventory = false; //Print out the inventory?
var debugClearInventory = false; //Clear the inventory?
var debugAddItem = false; //Add an item?
var debugItemAdded = "water"; //Item to add to inventory?

function Start () {
    DontDestroyOnLoad(gameObject); //This object never dies now
}

function Update () {
    if (debugInventory) {
        //We are printing out our inventory
        var strOut = "";

        for (var i = 0; i < inventory.length; i++) {
            //Add the item to the string
            strOut = strOut + inventory[i];

            if (i < inventory.length - 1) {
                //More to go
                strOut = strOut + ", ";
            }
        }

        Debug.Log(strOut); //Print it out

        debugInventory = false;
    }	

    if (debugClearInventory) {
        //Clear the inventory
        inventory = new Array();
        debugClearInventory = false;
    }

    if (debugAddItem) {
        //Add an item to inventory
        inventory.push(debugItemAdded);

        debugAddItem = false;
    }
}

function giveItem(item) {
    //Add an item to the inventory
    inventory.Push(item);
}

function haveItem(item) {
    //Check if we have an item in inventory
    for (var i = 0; i < inventory.length; i++) {
        if (inventory[i] == item) {
            return true;
        }
    }

    return false;
}

function useItem(item) {
    //Take an item string and remove it from inventory, not really needed unless we have items we will pick up multiple times
    for (var i = 0; i < inventory.length; i++) {
        if (inventory[i] == item) {
            inventory.RemoveAt(i);
            break;
        }
    }
}

function getItemsCount() {
    //Return the number of items we have
    return inventory.length;
}

function getOldestItem() {
    //Return the oldest item
    if (inventory.length > 0) {
        return inventory[0];
    }

    return "";
}

function getNewestItem() {
    //Get newest item
    if (inventory.length > 0) {
        return inventory[inventory.length - 1];
    }

    return "";
}

function getInventory() {
    //Return the whole inventory object for external sorting / processing
    return inventory;
}

function getNumOfItem(item) {
    //How many of a specific item does a player have?
    var ans = 0;

    for (var i = 0; i < inventory.length; i++) {
        if (inventory[i] == item) {
            ans = ans + 1; //Found another!
        }
    }

    return ans;
}
