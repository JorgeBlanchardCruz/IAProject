
/**
 * @author Jorge O. Blanchard Cruz
 * 
 */


"use strict";

window.onload = main;


function position(z, x) {
    this.z = z;
    this.x = x;

    this.equal = function (poscompare) {
        if ((this.z == poscompare.z) && (this.x == poscompare.x))
            return true;

        return false;
    }

    this.get_direction = function (poscompare, prevpos) {
        //no hay movimientos en diagonal
        if ((this.z == poscompare.z) && (this.x == poscompare.x))
            return null;

        if (this.z == poscompare.z){
            if (prevpos == 0  || prevpos == 270){
                if (poscompare.x > this.x)
                    return 90;
                else if (poscompare.x < this.x)
                    return 270;
            }
        if (prevpos == 180 || prevpos == 90) {
                if (poscompare.x > this.x)
                    return 90;
                else if (poscompare.x < this.x)
                    return 270;
            }
        }

        if (this.x == poscompare.x){
            if (prevpos == 270 || prevpos == 0) {
                if (poscompare.z > this.z)
                    return 0;  //revisado
                else if (poscompare.z < this.z)
                    return 180;
            }
            if (prevpos == 90 || prevpos == 180) {
                if (poscompare.z > this.z)
                    return 0;
                else if (poscompare.z < this.z)
                    return 180;
            }
        }
        
        return prevpos;
    }
};


var MapCAVE;
var MotherSHIP;

var MapParams;

var OceanScene = false, Antialiasing = true, Textures = false, Mapcalculation = false;

var AgentSpeed = 0.05;


//UI objects
    var btnfile_input;
    var btnFullScreen;
    var btnReset;
    var chbOceanScene;
    var chbAntialiasing;
    var chbTexturas;
    var chbMapcalculation;
    var btnCalcASTAR;
    var btnPlay;
    var btnPlayFast;
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
    btnCalcASTAR = document.getElementById('btnCalcASTAR');
    btnPlay = document.getElementById('btnPlay');
    btnPlayFast = document.getElementById('btnPlayFast');
    btnPause = document.getElementById('btnPause');
    btnRev = document.getElementById('btnRev');

    btnfile_input = document.getElementById('btnfile_input');
    btnFullScreen = document.getElementById('btnFullScreen');
    btnReset = document.getElementById('btnReset');
    chbOceanScene = document.getElementById('chbOceanScene');
    chbAntialiasing = document.getElementById('chbAntialiasing');
    chbTexturas = document.getElementById('chbTexturas');
    chbMapcalculation = document.getElementById('chbMapcalculation');

    chbOceanScene.checked = OceanScene;
    chbAntialiasing.checked = Antialiasing;
    chbTexturas.checked = Textures;
    chbMapcalculation.checked = Mapcalculation;
}

function Add_Events() {

    document.onkeypress = document_onkeypress;
    window.addEventListener('resize', onWindowResize, false);

    btnCalcASTAR.addEventListener('click', CalculateASTAR);
    btnPlay.addEventListener('click', Play);
    btnPlayFast.addEventListener('click', ChangeSpeed);
    btnPause.addEventListener('click', Pause);
    btnRev.addEventListener('click', Rev);

    btnfile_input.addEventListener('change', btnfile_input_onchange);
    btnFullScreen.addEventListener('click', toggleFullScreen, false);
    btnReset.addEventListener('click', Load3DUI, false);
    chbOceanScene.addEventListener('change', onConfigChange);
    chbAntialiasing.addEventListener('change', onConfigChange);
    chbTexturas.addEventListener('change', onConfigChange);
    chbMapcalculation.addEventListener('change', onConfigChange);

}

function Load3DUI() {
    if (MapCAVE != null) MapCAVE.Clear_all();
   
    MapCAVE = new C3DWorld(Antialiasing, OceanScene);
    MapParams = MapCAVE.get_Params();
    MotherSHIP = null;
}

function Create_Mothership() { //lo necesito para utilizarlo de callback
    MapParams = MapCAVE.get_Params();
    MotherSHIP = new CMothership(MapParams, AgentSpeed);
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

function CalculateASTAR() {
    if (MotherSHIP != null)
        MotherSHIP.CalculateASTAR(Mapcalculation);
}

function Play() {
    AgentMove('i');
}

function ChangeSpeed() {
    if (MotherSHIP == null)
        return undefined;

    switch (AgentSpeed) {
        case 0.05:
            AgentSpeed = 0.2;
            break;
        case 0.2:
            AgentSpeed = 0.5;
            break;  
        default:
            AgentSpeed = 0.05;
    }
    MotherSHIP.Agent().ChangeSpeed(AgentSpeed);
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
    Mapcalculation = chbMapcalculation.checked;
}

function btnfile_input_onchange() {
    MapCAVE.Clear_Cave();
    MapCAVE.Create_CaveofMapfile(this.files[0], Create_Mothership, Textures);
}












