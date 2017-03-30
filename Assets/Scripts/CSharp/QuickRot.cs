using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class QuickRot : MonoBehaviour {

    public Vector3 rotPerSec = new Vector3(0f, 0f, 0f);

	// Use this for initialization
	void Start () {
		
	}
	
	// Update is called once per frame
	void Update () {
        transform.Rotate(rotPerSec * Time.deltaTime);
    }
}
