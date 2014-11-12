
/**
 * @author Jorge O. Blanchard Cruz
 * 
 */

var CCartographerAgent = function (Params, speed, x, z) {
    "use strict";

    //ATTRIBUTES
    const _MAXSWING = 0.03;
    const _SWINGSPEED = 0.001;

    var _countswing = 0;
    var _dirswing = false;

    var _speed = speed;
    var _movement = 'stop';
    var _rotate = 0;
    var _direccion = 90;
    var _Wheatley;    
    
    
    //temp variable
    var camera_position;

    //INITIALIZE
    init();

    //PROCEDURES
    // Converts from radians to degrees.
    Math.degrees = function (radians) {
        return radians * 180 / Math.PI;
    };

    Math.radians = function (degrees) {
        return degrees * Math.PI / 180;
    };

    function init() {
        camera_position = document.getElementById('camera_position');
        Create_WheatleyMTL('meshes/WheatleyModel.obj', 'meshes/Ghost.mtl', x, 0, z, 0.08, 0.08, 0.08);

        animate();
    }
    
    function Create_WheatleyMTL(fileobj, filemtl, x, y, z, scalex, scaley, scalez) {
        try {
            THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
            var loader = new THREE.OBJMTLLoader();
            loader.load(fileobj, filemtl,
                function (object) {
                    object.position.set(x, y, z);
                    object.scale.set(scalex, scaley, scalez);

                    object.rotation.z = -Math.PI / 2;
                    object.rotation.y = Math.PI / 2;

                    object.castShadow = true;
                    object.receiveShadow = true;

                    _Wheatley = object;

                    Params.scene.add(_Wheatley);
                });
        }
        catch (err) { console.log(err); }
    }

    function Move(movement) {

        function CalculateDireccion(){


        }

        _movement = movement;
        switch (_movement) {
            case 'a':
                _rotate += Math.degrees(Math.PI / 2);
                //_direccion = 
                break;
            case 'd':
                _rotate -= Math.degrees(Math.PI / 2);
                break;
            default:
                _Wheatley.translateY(0);
                _Wheatley.translateX(0);
                break;
        }

    }

    function AccionAnimation(movement) {
        //Al haber rotado el agente (para colocarlo de forma más natural) se ha provocado que cambie su sistema de referencia.
        _movement = movement;
        switch (_movement) {
            case 'w':
                _Wheatley.translateZ((CaveBordersDelimeters() ? _speed : 0));
                break;
            case 'a':
            case 'd':
                _Wheatley.rotation.y = Math.radians(_rotate);
                _rotate = 0;
                break;
            default: //stop
                _Wheatley.translateZ(0);
                break;
        }

        Wheatley_SWING();


        //recoge las coordenadas globales del mundo 3d de Wheatley
        _Wheatley.updateMatrixWorld();
        var p = new THREE.Vector3(0, 0, 0);
        _Wheatley.localToWorld(p);

        
        camera_position.innerHTML = 'obj position: ' + p.x.toFixed(2).toString() + ';' + p.y.toFixed(2).toString() + ';' + p.z.toFixed(2).toString();
    }

    function Wheatley_SWING() {
        //provoca una pequeña animación de arriba-abajo a Wheatley
        if (_countswing <= _MAXSWING) {
            _Wheatley.position.y += (_dirswing == false ? _SWINGSPEED : _SWINGSPEED * (-1));
            _countswing += _SWINGSPEED;
        }
        else {
            _dirswing = (_dirswing == false ? true : false);
            _countswing = 0
        }
    }



    function CaveBordersDelimeters() {
        switch (_direccion) {
            case 90:
                if (_Wheatley.position.z >= Params.height)
                    return false;
                break;
            case 240:
                if (_Wheatley.position.z <= 0)
                    return false;
            case 0:
                if (_Wheatley.position.x >= Params.width)
                    return false;
                break;
            case 180:
                if (_Wheatley.position.x <= 0)
                    return false;
                break;
        }

        return true;
    }

    function animate() {
        requestAnimationFrame(animate);

        if (_Wheatley != null) { AccionAnimation(_movement); }

        render();
    }

    function render() {
        Params.renderer.render(Params.scene, Params.camera);
    }

    //METHODS
    this.Move = function (movement) { Move(movement); };

};