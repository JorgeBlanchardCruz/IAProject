
/**
 * @author Jorge O. Blanchard Cruz
 * 
 */



var CCartographerAgent = function (scene, renderer, camera, speed, color, initialx, initialz) {
    "use strict";

    //ATTRIBUTES
    var _cavescene = scene;
    var _renderer = renderer;
    var _camera = camera;
    var _speed = speed;
    var _color = color;

    var _movement = 'stop';
    var _VisualAgent; 
    
    
    //INITIALIZE
    _VisualAgent = Create_VisualAgent(color, initialx, initialz);

    animate();


    //PROCEDURES
    function Create_VisualAgent(color, initialx, initialz) {
        var object = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 32), new THREE.MeshLambertMaterial({ color: color }));
        object.position.set(initialx, 0, initialz);
        object.castShadow = true;
        object.receiveShadow = true;

        _cavescene.add(object);

        return object;   
    }

    function Move(movement) {
        _movement = movement;

        switch (_movement) {
            case 'w':
                _VisualAgent.translateX(_speed);
                break;
            case 's':
                _VisualAgent.translateX(_speed*(-1));
                break;
            case 'a':
                _VisualAgent.translateZ(_speed*(-1));
                break;
            case 'd':
                _VisualAgent.translateZ(_speed);
                break;
            case 'stop':
                _VisualAgent.translateX(0);
                _VisualAgent.translateZ(0);
                break;
        }
    }

    function animate() {
        requestAnimationFrame(animate);

        Move(_movement);

        render();
    }

    function render() {
        _renderer.render(_cavescene, _camera);
    }



    //METHODS
    this.Move = function (movement) { Move(movement); };

};