
/**
 * @author Jorge O. Blanchard Cruz
 * 
 */



var CCartographerAgent = function (scene, renderer, camera, speed, x, z) {
    "use strict";

    //ATTRIBUTES
    var _speed = speed;
    var _movement = 'stop';
    var _direction = 0;
    var _VisualAgent;    
    
    
    
    //INITIALIZE
    //_VisualAgent = Create_VisualAgent(color, initialx, initialz);
    var camera_position = document.getElementById('camera_position');
    Create_VisualAgentMTL('meshes/WheatleyModel.obj', 'meshes/Ghost.mtl', x, 0, z, 0.08, 0.08, 0.08);

    animate();


    //PROCEDURES
    function Create_VisualAgent(fileobj, filetexture, x, y, z, scalex, scaley, scalez) {
        try {
            // texture
            var manager = new THREE.LoadingManager();
            manager.onProgress = function (item, loaded, total) {
                console.log(item, loaded, total);
            };

            var texture = new THREE.Texture();
            var loader = new THREE.ImageLoader(manager);
            loader.load(filetexture, function (image) {
                texture.image = image;
                texture.needsUpdate = true;
            });

            // model
            var loader = new THREE.OBJLoader(manager);
            loader.load(fileobj, function (object) {
                object.traverse(function (child) {
                    if (child instanceof THREE.Mesh) {
                        child.material.map = texture;
                    }
                });

                object.position.set(x, y, z);
                object.castShadow = true;
                object.receiveShadow = true;
                object.scale.set(scalex, scaley, scalez);

                //el rotation hace que el sistema de referencia del agente sea diferente
                object.rotation.x = -Math.PI / 2;
                object.rotation.z = Math.PI / 2;
                object.localToWorld(new THREE.Vector3(x, y, z));

                _VisualAgent = object;

                scene.add(object);
            });
        }
        catch (err) { console.log(err); }
    }

    function Create_VisualAgentMTL(fileobj, filemtl, x, y, z, scalex, scaley, scalez) {
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

                    _VisualAgent = object;

                    scene.add(object);
                });
        }
        catch (err) { console.log(err); }
    }


    //function Create_VisualAgent(color, initialx, initialz) {
    //    var object = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), new THREE.MeshLambertMaterial({ color: color }));
    //    object.position.set(initialx, 0, initialz);
    //    object.castShadow = true;
    //    object.receiveShadow = true;

    //    scene.add(object);

    //    return object;   
    //}

    function Move(movement) {

        _movement = movement;

        switch (_movement) {
            case 'a':
                _direction += Math.PI / 2;
                break;
            case 'd':
                _direction -= Math.PI / 2;
                break;
            default:
                _VisualAgent.translateY(0);
                _VisualAgent.translateX(0);
                break;
        }
    }

    function AccionAnimation(movement) {

        //Al haber rotado el agente (para colocarlo de forma más natural) se ha provocado que cambie su sistema de referencia.
        _movement = movement;

        switch (_movement) {
            case 'w':
                _VisualAgent.translateZ(_speed);
                break;
            case 'a':
                _VisualAgent.rotation.y = _direction;
                break;
            case 'd':
                _VisualAgent.rotation.y = _direction;
                break;
            default:
                _VisualAgent.translateY(0);
                _VisualAgent.translateX(0);
                break;
        }

        _VisualAgent.updateMatrixWorld();
        var p = new THREE.Vector3(0, 0, 0);
        _VisualAgent.localToWorld(p);

        camera_position.innerHTML = 'obj position: ' + p.x.toFixed(2).toString() + ';' + p.y.toFixed(2).toString() + ';' + p.z.toFixed(2).toString();
    }

    function animate() {
        requestAnimationFrame(animate);

        if (_VisualAgent != null) { AccionAnimation(_movement); }

        render();
    }

    function render() {
        renderer.render(scene, camera);
    }



    //METHODS
    this.Move = function (movement) { Move(movement); };

};