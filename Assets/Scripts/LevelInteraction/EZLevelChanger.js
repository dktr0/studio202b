#pragma strict

import UnityEngine.SceneManagement;

var levelName = ""; //Level to go to (without the .scn)
var checkTag = "Player"; //Tag to look for

var forcePosition = true; //Force player position on the other side?
var targetPosition : Vector3; //Target position to "arrive at" on the other side

private var dataObj : GameObject; //The object we need to get the script from
private var dataScript : PlayerDataHolder; //The actual script holding our between-level data

var objEulerAngle : Vector3; //The Euler Angle of the object
var sendAngle = true; //Send our angle?

var triggerChange = false; //Trigger the changeover?

function Start () {
    if (levelName == "") {
        Debug.Log("No level name entered!");
    }
}

function Update() {
    //Poll for the object we want to update position of
    if (dataObj == null) {
        //We don't have a playerData object assigned, try and find it!
        dataObj = GameObject.FindWithTag("PlayerData");

        if (dataObj != null) {
            //We have a playerDataObj now, let's get its script

            dataScript = dataObj.GetComponent.<PlayerDataHolder>();
        }
    }

    if (triggerChange) {
        //Triggering a change removes the forces
        forcePosition = false;
        sendAngle = false;

        dataScript.ignoreSpawnPoint = true;
        dataScript.ignoreEulerAngle = true;

        //Now change scene
        SceneManager.LoadScene(levelName);
    }
}

function OnTriggerEnter(c : Collider) {
    if (c.tag == checkTag && levelName != "") {
        //This object changes the level!
        objEulerAngle = c.transform.eulerAngles; //Get the angle

        //First update where the player moves to over there
        if (dataObj != null) {
            if (forcePosition) {
                dataScript.playerSpawnPoint = targetPosition;
                dataScript.ignoreSpawnPoint = false;

                if (sendAngle) {
                    dataScript.playerEulerAngle = objEulerAngle;
                }
            } 
            else {
                dataScript.playerSpawnPoint = Vector3(0f, 0f, 0f);
                dataScript.playerEulerAngle = Vector3(0f, 0f, 0f);

                dataScript.ignoreSpawnPoint = true;
                dataScript.ignoreEulerAngle = true;
            }
        }

        //Now change scene
        SceneManager.LoadScene(levelName);
    }
}
