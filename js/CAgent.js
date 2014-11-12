
/**
 * @author Jorge O. Blanchard Cruz
 * 
 */

var CAgent = function (Params, speed, z, x) {
    "use strict";

    //ATTRIBUTES
    const _MAXSWING = 0.03;
    const _SWINGSPEED = 0.001;

    var _Wheatley;  //objeto visual en el mundo 3d  

    //SWING
    var _countswing = 0;
    var _dirswing = false;

    //movement
    var _speed = speed;
    var _movement = 'stop';
    
    var _direction = 0;
    
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
        Load_objmtl('meshes/WheatleyModel.obj', 'meshes/Ghost.mtl', x, 0, z, 0.08, 0.08, 0.08);

        animate();
    }
    
    function Load_objmtl(fileobj, filemtl, x, y, z, scalex, scaley, scalez) {
        try {
            THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
            var loader = new THREE.OBJMTLLoader();
            loader.load(fileobj, filemtl,
                function (object) {
                    object.position.set(x, y, z);
                    object.scale.set(scalex, scaley, scalez);
                    object.castShadow = true;
                    object.receiveShadow = true;

                    object.rotation.z = -Math.PI / 2;
                    //object.rotation.y = Math.PI / 2;

                    _Wheatley = object;

                    Params.scene.add(_Wheatley);
                });
        }
        catch (err) { console.log(err); }
    }

    function Move(movement) {
        _movement = movement;

        var rotate = 0;
        switch (_movement) {
            case 'a':
                rotate = Math.degrees(Math.PI / 2);
                break;
            case 'd':
                rotate = Math.degrees(Math.PI / 2) * (-1);
                break;
            default:
                break;
        }

        Calculate_direction(rotate);

        function Calculate_direction(rotate) {
            _direction += rotate;
            _direction = (_direction == -90 ? 270 : _direction);
            _direction = (_direction >= 360 ? 0 : _direction);       
        }
    }

    function AccionAnimation() {
        //Al haber rotado el agente (para colocarlo de forma más natural) se ha provocado que cambie su sistema de referencia.
        switch (_movement) {
            case 'w':      
                _Wheatley.translateZ((CaveBordersDelimeters() == true ? _speed : 0));
                break;
            case 'a':
            case 'd':
                _Wheatley.rotation.y = Math.radians(_direction);
                _movement = 'stop';
                break;
            default: //stop
                _Wheatley.translateZ(0);
                break;
        }

        Swing();

        //recoge las coordenadas globales del mundo 3d de Wheatley
        //_Wheatley.updateMatrixWorld();
        //var p = new THREE.Vector3(0, 0, 0);
        //_Wheatley.localToWorld(p);
        
        //camera_position.innerHTML = 'obj position: ' + _Wheatley.position.x.toFixed(2).toString() + ';' + _Wheatley.position.y.toFixed(2).toString() + ';' + _Wheatley.position.z.toFixed(2).toString();
        camera_position.innerHTML = 'Wheatley pos(z,x): ' + _Wheatley.position.z.toFixed(2).toString() + ' ; ' + _Wheatley.position.x.toFixed(2).toString();
    }

    function CaveBordersDelimeters() {
        var possible = true;
        switch (_direction) { //movimiento Wheatley en el mapa
            case 0: //de frente
                if (_Wheatley.position.z >= Params.height - 1)
                    possible = false;
                break;
            case 90: //izquierda
                if (_Wheatley.position.x >= Params.width - 1)
                    possible = false;
                break;
            case 180: //atrás
                if (_Wheatley.position.z <= 0)
                    possible = false
                break;
            case 270: //derecha
                if (_Wheatley.position.x <= 0)
                    possible = false;
                break;
        }
        _movement = (possible == false ? 'stop' : _movement);
        return possible;
    }

    function Swing() {
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

    function animate() {
        requestAnimationFrame(animate);

        if (_Wheatley != null) AccionAnimation();

        render();
    }

    function render() {
        Params.renderer.render(Params.scene, Params.camera);
    }

    //METHODS
    this.Move = function (movement) { Move(movement); };

};