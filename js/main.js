
/**
 * @author Jorge O. Blanchard Cruz
 * 
 */


"use strict";

window.onload = main;


var MapCAVE;
var MotherSHIP;

var MapParams;

var btnfile_input;
var btnFullScreen;
var btnReset;
var chbWaterScene;
var chbAntialiasing;


var WaterScene = false, Antialiasing = false; 

function main() {

    Load3DUI();
    
    set_HTMLObjects();

    Add_Events();
}


//PROCEDURES
function set_HTMLObjects() {
 
    btnfile_input = document.getElementById('btnfile_input');
    btnFullScreen = document.getElementById('btnFullScreen');
    btnReset = document.getElementById('btnReset');
    chbWaterScene = document.getElementById('chbWaterScene');
    chbAntialiasing = document.getElementById('chbAntialiasing');

    //camera_position = document.getElementById('camera_position');
    //camera_rotation = document.getElementById('camera_rotation');

}

function Add_Events() {

    window.addEventListener('resize', onWindowResize, false);
    btnFullScreen.addEventListener('click', toggleFullScreen, false);
    btnReset.addEventListener('click', Load3DUI, false);
    chbWaterScene.addEventListener('change', onConfigChange);
    chbAntialiasing.addEventListener('change', onConfigChange);

    document.onkeypress = AgentMove;

    btnfile_input.onchange = function () {
        MapCAVE.Clear_Cave();
        MapCAVE.Create_CaveofMapfile(this.files[0], Create_Mothership);
    };
}

function Load3DUI() {
    if (MapCAVE != null) MapCAVE.destructor();

    MapCAVE = new C3DWorld(Antialiasing, WaterScene);
    MapParams = MapCAVE.get_Params();
}

function Create_Mothership() { //lo necesito para utilizarlo de callback
    MapParams = MapCAVE.get_Params();
    MotherSHIP = new CMothership(MapParams);
}

function toggleFullScreen() {
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {  // current working methods
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
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


function onConfigChange() {
    WaterScene = chbWaterScene.checked;
    Antialiasing = chbAntialiasing.checked;
}









