#pragma strict
public var myLight: Light;
public var col: GameObject;
public var buah;
//public var light2 : GameObject;

function Start () {
    myLight = GetComponent(Light);
    //col = GetComponent(Collider);
    buah = col.GetComponent(Collider);
}

function Update () {
    
    if (Input.GetKeyDown(KeyCode.Space)) {
        myLight.enabled = !myLight.enabled;
        col.gameObject.SetActive(!col.gameObject.activeSelf);
        //buah.isTrigger = !buah.isTrigger;
        //col.collider.isTrigger = !col.collider.isTrigger;

        //light2.light.enabled = ! light2.light.enabled ;
    }
}
