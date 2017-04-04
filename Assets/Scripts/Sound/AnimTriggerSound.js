#pragma strict

//Play a sound when triggered by an animator
//Check playSnd from animator to play a sound
//Check resetSnd and uncheck playSnd to reset the trigger to be able to play a sound again when playSnd is checked once more

var source : AudioSource;

var playSnd = false;
var resetSnd = false;

private var playedSnd = false; //Have we played the sound?

function Start () {
    source = GetComponent.<AudioSource>();
}

function Update () {
    if (playSnd && !playedSnd)
    {
        source.Play();

        playedSnd = true;
    }

    if (resetSnd && !playSnd) {
        playedSnd = false;
    }
}