#pragma strict
#pragma downcast

var dataObjName = "playerDataObj"; //The name of the prefab we are spawning if it doesn't exist
var dataObj : GameObject; //The object we need to get the script from
var dataScript : PlayerDataHolder; //The actual script holding our between-level data
var createdThisTime = false; //Whether we created it this scene or not, if not then we go to the spawn point we are told!
var skipSpawnPoint = false; //Skip going to a spawn point? Set in editor!

function Awake () {
    if (dataObj == null) {
        //We don't have a playerData object assigned, try and find it!
        dataObj = GameObject.FindWithTag("PlayerData");

        if (dataObj == null) {
            //Still null? Make one!
            dataObj = Instantiate(Resources.Load(dataObjName), Vector3.zero, Quaternion.identity);
            createdThisTime = true;
        }
    }

    if (dataObj != null) {
        //We have a playerDataObj now, let's get its script

        dataScript = dataObj.GetComponent.<PlayerDataHolder>();
    }

    if (!skipSpawnPoint && !createdThisTime && !dataScript.ignoreSpawnPoint) {
        //We also "spawn" !

        transform.position = dataScript.playerSpawnPoint; //Move to the correct position

        if (!dataScript.ignoreEulerAngle) {
            transform.eulerAngles = dataScript.playerEulerAngle;
        }
    }

    if (dataScript.ignoreSpawnPoint || dataScript.ignoreEulerAngle) {
        //Reset these values as we don't need to check anymore
        dataScript.ignoreSpawnPoint = false;
        dataScript.ignoreEulerAngle = false;
    }
}

function getDataObj() {
    return dataObj;
}

function getDataScript() {
    return dataScript;
}

function wasCreatedThisScene() {
    return createdThisTime;
}
