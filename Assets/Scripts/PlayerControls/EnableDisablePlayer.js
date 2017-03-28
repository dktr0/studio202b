#pragma strict

var playerScript : UnityStandardAssets.Characters.FirstPerson.FirstPersonController;

var playerEnabled = true;

function Update () {
    if (playerScript != null) {
        playerScript.enabled = playerEnabled;	
    }
}
