#pragma strict

//Loop a sound while an animation is playing
//Will loop the sound at a source as long as the animation is the one we're looking for

var source : AudioSource;

var anim : Animator;
var animState: AnimatorStateInfo;

var animName = "AnimationName";
var animTag = "AnimationTag";

function Start () {
    if (anim == null) anim = GetComponent.<Animator>();

    source = GetComponent.<AudioSource>();
}

function Update () {
    animState = anim.GetCurrentAnimatorStateInfo(0);

    if ((animName != "" && animState.IsName(animName)) || (animTag != "" && animState.IsTag(animTag))) {
        //Play our sound!
        if (!source.isPlaying) {
            source.Play();
        }
    }
    else {
        //Otherwise nope!
        if (source.isPlaying) {
            source.Pause();
        }
    }
}
