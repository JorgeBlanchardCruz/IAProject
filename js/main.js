
"use strict";

window.onload = main;


var MapCAVE;
var MotherSHIP;

var MapParams;

var file_input;

function main() {

    MapCAVE = new C3DWorld(true);
    MapParams = MapCAVE.get_Params();
    
    set_HTMLObjects();

    Add_Events();
    
    FullScreen(document.documentElement);
}



//PROCEDURES
function set_HTMLObjects() {
 
    file_input = document.getElementById('file_input');

    //camera_position = document.getElementById('camera_position');
    //camera_rotation = document.getElementById('camera_rotation');

}

function Add_Events() {

    window.addEventListener('resize', onWindowResize, false);
    //document.addEventListener('mousemove', onDocumentMouseMove, false);

    document.onkeypress = AgentMove;

    file_input.onchange = function () {
        MapCAVE.Create_CaveofMapfile(this.files[0], Create_Mothership);
    };
}

function Create_Mothership() { //lo necesito para utilizarlo de callback
    MapParams = MapCAVE.get_Params();
    MotherSHIP = new CMothership(MapParams);
}

function FullScreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
}


function AgentMove(event) {
    if (MotherSHIP != null)
        MotherSHIP.Agent().Move(event.key);
}


//EVENTS
function onWindowResize() {
    MapParams.camera.aspect = window.innerWidth / window.innerHeight;
    MapParams.camera.updateProjectionMatrix();

    MapParams.renderer.setSize(window.innerWidth, window.innerHeight);
}

//function onDocumentMouseMove(event) {
//    camera_position.innerHTML = 'Camera position: ' + camera.position.x.toString() + ';' + camera.position.y.toString() + ';' + camera.position.z.toString();
//    camera_rotation.innerHTML = 'Camera rotation: ' + camera.rotation.x.toString() + ';' + camera.rotation.y.toString() + ';' + camera.rotation.z.toString();
//}









