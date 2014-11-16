
/**
 * @author Jorge O. Blanchard Cruz
 * 
 */

//la dimensión 'y' ha sido bloqueada
var CAgent = function (Params, speed, ActiveCollisions, z, x) {
    "use strict";

    //ATTRIBUTES
    const _MAXSWING = 0.03;
    const _SWINGSPEED = 0.001;
    const _SIZE = 0.3;

    var _Visualobj;  //objeto visual en el mundo 3d  

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

                    _Visualobj = object;

                    Params.scene.add(_Visualobj);
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
        switch (_movement) {
            case 'w':      
                _Visualobj.translateZ((Borders_Delimeters() ? (ActiveCollisions ? (Collisions() ? _speed : 0) : _speed) : 0));
                break;
            case 'a':
            case 'd':
                _Visualobj.rotation.y = Math.radians(_direction);
                _movement = 'stop';
                break;
            default: //stop
                _Visualobj.translateZ(0);
                break;
        }

        Swing();
        
        //camera_position.innerHTML = 'obj position: ' + _Visualobj.position.x.toFixed(2).toString() + ';' + _Visualobj.position.y.toFixed(2).toString() + ';' + _Visualobj.position.z.toFixed(2).toString();
        camera_position.innerHTML = 'Wheatley pos(z,x): ' + _Visualobj.position.z.toFixed(2).toString() + ' ; ' + _Visualobj.position.x.toFixed(2).toString();
    }

    function Borders_Delimeters() {
        var possible = true;
        switch (_direction) { //según el movimiento Wheatley en el mapa
            case 0: //adelante
                if (_Visualobj.position.z >= Params.height - 1)
                    possible = false;
                break;
            case 90: //izquierda
                if (_Visualobj.position.x >= Params.width - 1)
                    possible = false;
                break;
            case 180: //atrás
                if (_Visualobj.position.z <= 0)
                    possible = false
                break;
            case 270: //derecha
                if (_Visualobj.position.x <= 0)
                    possible = false;
                break;
        }
        _movement = (possible == false ? 'stop' : _movement);
        return possible;
    }

    function Collisions() {
        //TODO ESTO HAY QUE OPTIMIZARLO, y MUCHO!
        //unificar los 4 bloques de código de colisión en una sola función dejaría dicha función con un montón de parámetros de entrada.
        //casi es mejor dejarlo así, tal vez sea más entendible, aunque complicado de modificar.

        for (var i = 0, l = Params.scene.children.length; i < l; i++) {      
            if (Params.scene.children[i].name == Params.typesblocks[0]) { //Params.typesblocks.[0] = 'obstacle'
                var object = Params.scene.children[i];

                switch (_direction) { //según el movimiento Wheatley en el mapa
                    case 0: //adelante

                        //mismo eje de movimiento y sentido correcto
                        if ((_Visualobj.position.x.toFixed(0) == object.position.x.toFixed(0)) && (_Visualobj.position.z < object.position.z)) {

                            var distance = object.position.z - _Visualobj.position.z; 
                            if (distance < 1) { //desechamos los lejanos
                                var distancetoObstacle = (object.position.z - (object.scale.z / 2)) - (_Visualobj.position.z + (_SIZE / 2));
                                if (distancetoObstacle <= 0.0) { //comprobamos la distancia del cercano
                                    _movement = Params.typesblocks[0] + _direction;
                                    return false;
                                }
                            }
                        } else if ((_Visualobj.position.z < object.position.z) && (_Visualobj.position.z - object.position.z < 1)) { //sentido correcto y objecto más cercano
                            var objwallmin = (object.position.x - (object.scale.x / 2)) - (_SIZE / 2);
                            var objwallMax = (object.position.x + (object.scale.x / 2)) + (_SIZE / 2);
                            if ((_Visualobj.position.x >= objwallmin) && ((_Visualobj.position.x) <= objwallMax)) {
                                var distancetoObstacle = Math.abs((object.position.z - (object.scale.z / 2)) - (_Visualobj.position.z + (_SIZE / 2)));
                                if (distancetoObstacle == 0.0) { //comprobamos la distancia del cercano
                                    _movement = Params.typesblocks[0] + _direction;
                                    return false;
                                }
                            }
                        }

                        break;

                    case 180: //atrás

                        //mismo eje de movimiento y sentido correcto
                        if ((_Visualobj.position.x.toFixed(0) == object.position.x.toFixed(0)) && (_Visualobj.position.z > object.position.z)) {

                            var distance = _Visualobj.position.z - object.position.z;
                            if (distance < 1) { //desechamos los lejanos
                                var distancetoObstacle = (_Visualobj.position.z - (_SIZE / 2)) - (object.position.z + (object.scale.z / 2));
                                if (distancetoObstacle <= 0.0) { //comprobamos la distancia del cercano
                                    _movement = Params.typesblocks[0] + _direction;
                                    return false;
                                }
                            }
                        } else if ((_Visualobj.position.z > object.position.z) && (object.position.z - _Visualobj.position.z < 1)) { //sentido correcto y objecto más cercano
                            var objwallmin = (object.position.x - (object.scale.x / 2)) - (_SIZE / 2);
                            var objwallMax = (object.position.x + (object.scale.x / 2)) + (_SIZE / 2);
                            if ((_Visualobj.position.x >= objwallmin) && ((_Visualobj.position.x) <= objwallMax)) {
                                var distancetoObstacle = Math.abs((_Visualobj.position.z - (_SIZE / 2)) - (object.position.z + (object.scale.z / 2)));
                                if (distancetoObstacle == 0.0) { //comprobamos la distancia del cercano
                                    _movement = Params.typesblocks[0] + _direction;
                                    return false;
                                }
                            }
                        }

                        break;

                    case 90: //izquierda

                        //mismo eje de movimiento y sentido correcto
                        if ((_Visualobj.position.z.toFixed(0) == object.position.z.toFixed(0)) && (_Visualobj.position.x < object.position.x)) {

                            var distance = object.position.x - _Visualobj.position.x;
                            if (distance < 1) { //desechamos los lejanos
                                var distancetoObstacle = (object.position.x - (object.scale.x / 2)) - (_Visualobj.position.x + (_SIZE / 2));
                                if (distancetoObstacle <= 0.0) { //comprobamos la distancia del cercano
                                    _movement = Params.typesblocks[0] + _direction;
                                    return false;
                                }
                            }
                        } else if ((_Visualobj.position.x < object.position.x) && (object.position.x - _Visualobj.position.x < 1)) { //sentido correcto y objecto más cercano
                            var objwallmin = (object.position.z - (object.scale.z / 2)) - (_SIZE / 2);
                            var objwallMax = (object.position.z + (object.scale.z / 2)) + (_SIZE / 2);
                            if ((_Visualobj.position.z >= objwallmin) && ((_Visualobj.position.z) <= objwallMax)) {
                                var distancetoObstacle = Math.abs((object.position.x - (object.scale.x / 2)) - (_Visualobj.position.x + (_SIZE / 2)));
                                if (distancetoObstacle == 0.0) { //comprobamos la distancia del cercano
                                    _movement = Params.typesblocks[0] + _direction;
                                    return false;
                                }
                            }
                        }

                        break;

                    case 270: //derecha
                        //mismo eje de movimiento y sentido correcto
                        if ((_Visualobj.position.z.toFixed(0) == object.position.z.toFixed(0)) && (_Visualobj.position.x > object.position.x)) {

                            var distance = _Visualobj.position.x - object.position.x;
                            if (distance < 1) { //desechamos los lejanos
                                var distancetoObstacle = (_Visualobj.position.x - (_SIZE / 2)) - (object.position.x + (object.scale.x / 2));
                                if (distancetoObstacle <= 0.0) { //comprobamos la distancia del cercano
                                    _movement = Params.typesblocks[0] + _direction;
                                    return false;
                                }
                            }
                        } else if ((_Visualobj.position.x > object.position.x) && (_Visualobj.position.x - object.position.x < 1)) { //sentido correcto y objecto más cercano
                            var objwallmin = (object.position.z - (object.scale.z / 2)) - (_SIZE / 2);
                            var objwallMax = (object.position.z + (object.scale.z / 2)) + (_SIZE / 2);
                            if ((_Visualobj.position.z >= objwallmin) && ((_Visualobj.position.z) <= objwallMax)) {
                                var distancetoObstacle = Math.abs((_Visualobj.position.x - (_SIZE / 2)) - (object.position.x + (object.scale.x / 2)));
                                if (distancetoObstacle == 0.0) { //comprobamos la distancia del cercano
                                    _movement = Params.typesblocks[0] + _direction;
                                    return false;
                                }
                            }
                        }
                        break;
                }
            }
        }
        return true;
    }

    function Swing() {
        //provoca una pequeña animación de arriba-abajo a Wheatley
        if (_countswing <= _MAXSWING) {
            _Visualobj.position.y += (_dirswing == false ? _SWINGSPEED : _SWINGSPEED * (-1));
            _countswing += _SWINGSPEED;
        }
        else {
            _dirswing = (_dirswing == false ? true : false);
            _countswing = 0
        }
    }

    function animate() {
        requestAnimationFrame(animate);

        if (_Visualobj != null) AccionAnimation();

        render();
    }

    function render() {
        Params.renderer.render(Params.scene, Params.camera);
    }

    //METHODS
    this.Move = function (movement) { Move(movement); };

};