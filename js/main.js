
/**
 * @author Jorge O. Blanchard Cruz
 * 
 */


"use strict";

window.onload = main;


var MapCAVE;
var MotherSHIP;

var MapParams;

var OceanScene = false, Antialiasing = false, Textures = true;


//UI objects
    var btnfile_input;
    var btnFullScreen;
    var btnReset;
    var chbOceanScene;
    var chbAntialiasing;
    var chbTexturas;
    var btnPlay;
    var btnPause;
    var btnRev;
//--------------------


function main() {
    Load3DUI();
    
    set_HTMLObjects();

    Add_Events();
}


//PROCEDURES
function set_HTMLObjects() {
    btnPlay = document.getElementById('btnPlay');
    btnPause = document.getElementById('btnPause');
    btnRev = document.getElementById('btnRev');

    btnfile_input = document.getElementById('btnfile_input');
    btnFullScreen = document.getElementById('btnFullScreen');
    btnReset = document.getElementById('btnReset');
    chbOceanScene = document.getElementById('chbOceanScene');
    chbAntialiasing = document.getElementById('chbAntialiasing');
    chbTexturas = document.getElementById('chbTexturas');

    chbOceanScene.checked = OceanScene;
    chbAntialiasing.checked = Antialiasing;
    chbTexturas.checked = Textures;
}

function Add_Events() {

    document.onkeypress = document_onkeypress;
    window.addEventListener('resize', onWindowResize, false);

    btnPlay.addEventListener('click', Play);
    btnPause.addEventListener('click', Pause);
    btnRev.addEventListener('click', Rev);

    btnfile_input.addEventListener('change', btnfile_input_onchange);
    btnFullScreen.addEventListener('click', toggleFullScreen, false);
    btnReset.addEventListener('click', Load3DUI, false);
    chbOceanScene.addEventListener('change', onConfigChange);
    chbAntialiasing.addEventListener('change', onConfigChange);
    chbTexturas.addEventListener('change', onConfigChange);

}

function Load3DUI() {
    if (MapCAVE != null) MapCAVE.Clear_all();

    MapCAVE = new C3DWorld(Antialiasing, OceanScene);
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

function AgentMove(key) {
    if (MotherSHIP != null)
        MotherSHIP.Agent().Move(key);
}

function Play() {
    AgentMove('i');
}

function Pause() {
    AgentMove('stop');
}

function Rev() {
    if (MotherSHIP != null)
        MotherSHIP.Agent().Rev();
}


//EVENTS
function onWindowResize() {
    MapParams.camera.aspect = window.innerWidth / window.innerHeight;
    MapParams.camera.updateProjectionMatrix();

    MapParams.renderer.setSize(window.innerWidth, window.innerHeight);
}

function document_onkeypress(event) {
    AgentMove(event.key);
}

function onConfigChange() {
    OceanScene = chbOceanScene.checked;
    Antialiasing = chbAntialiasing.checked;
    Textures = chbTexturas.checked;
}

function btnfile_input_onchange() {
    MapCAVE.Clear_Cave();
    MapCAVE.Create_CaveofMapfile(this.files[0], Create_Mothership, Textures);
}












