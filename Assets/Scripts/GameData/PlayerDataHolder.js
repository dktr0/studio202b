#pragma strict

var playerSpawnPoint : Vector3; //What position are we spawning at?
var ignoreSpawnPoint = false; //Ignore spawning? Set in editor or by another script

var playerEulerAngle : Vector3; //What angle should the player be facing?
var ignoreEulerAngle = false; //Ignore the angle?

function Start () {
    DontDestroyOnLoad(gameObject); //This object never dies now
}

function Update () {
	
}
