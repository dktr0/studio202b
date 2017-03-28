#pragma strict

var tagDetect = "Player"; //The tag to look for
var m_Anim : Animator; //My animator

var animBool = "start"; //Bool to set in the animation controller?
var setBoolTrue = true; //Set the bool to true

var triggerOnce = true; //Triggers once?

var wasTriggered = false; //Was this triggered?

function Start() {
    if (m_Anim == null) {
        m_Anim = GetComponent.<Animator>();
    }
}

function OnTriggerEnter(c : Collider) {
    if (c.tag == tagDetect && m_Anim != null) {
        if (!wasTriggered || !triggerOnce) {
            //We can trigger!
            m_Anim.SetBool(animBool, setBoolTrue);

            wasTriggered = true;
        }
    }
}
