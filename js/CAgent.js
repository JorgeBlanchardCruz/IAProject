
/**
 * @author Jorge O. Blanchard Cruz
 * 
 */

"use strict";

//la dimensión 'y' ha sido bloqueada
var CAgent = function (Params, speed, ActiveCollisions) {


    //STRUCTURES
    function path(name, indx, block, begin, path) {
        this._name = name;
        this._indx = indx;
        this._block = block;
        this._begin = begin;
        this._path = path.toString().split(''); //convierte por ejemplo: wwwdaww a 'w','w','w','d','a','w','w'

        this.add_indx = function (Callback) {  //Recorre el vector de trayectoria
            if (!this._begin)
                return;

            if (this._indx < this._path.length - 1) {
                this._indx++;

                Callback('i');
            }
            else if (this._indx >= this._path.length - 1) {
                this.reset();
            }
                 
        }

        this.get_CurrentMove = function () {
            return this._path[this._indx];
        }

        this.play = function () {
            this._begin = true;
        }

        this.stop = function () {
            this._begin = false;
        }

        this.reset = function () {
             this._begin = false;
             this._indx = 0;
         }
    }

    function branch(nodes, value, heuristic) {
        this.nodes = nodes;
        this.value = Number(value);
        this.heuristic = Number(heuristic);

        this.SearchNode = function (nodesearch) {
            for (var i = 0; i < this.nodes.length; i++)
                if (this.nodes[i].equal(nodesearch))
                    return i;

            return null;
        }

        this.CompareLastNode = function (nodesearch) {
            if (this.nodes[this.nodes.length - 1].equal(nodesearch))
                return true

            return false;
        }

        this.clone = function () {
            return new branch(this.nodes.slice(0), this.value, this.heuristic);
        }

        this.get_StringPath = function () {
            var stringpath = (Params.NodeSTART.x > Params.NodeOBJETIVE.x ? "d" : "a");
            var anglestart = (Params.NodeSTART.x > Params.NodeOBJETIVE.x ? 270 : 90);
         
            if (this.nodes.length < 1) {
                return stringpath;
            }
            
            var mov = "horizontal";
            var change = this.nodes[0].get_direction(this.nodes[1], anglestart);
            var prevchange = change;
            for (var i = 0; i < this.nodes.length - 1; i++) {
                change = (this.nodes[i].get_direction(this.nodes[i + 1], prevchange));

                var prev    = this.nodes[i]
                var current = this.nodes[i + 1];

                if ((mov == "horizontal" && prev.z == current.z) || (mov == "vertical" && prev.x == current.x))
                    stringpath += "w";
                else {
                    if (mov == "horizontal" && prev.z != current.z) {
                        mov = "vertical";

                        if (prevchange == 90) {
                            if (current.z > prev.z)
                                stringpath += "dw";
                            else if (current.z < prev.z)
                                stringpath += "aw";

                        } else if (prevchange == 270) {
                            if (current.z > prev.z)
                                stringpath += "aw";
                            else if (current.z < prev.z)
                                stringpath += "dw";
                        }
                    }
                    else if (mov == "vertical" && prev.x != current.x) {
                        mov = "horizontal";

                        if (prevchange == 180) {
                            if (current.x > prev.x)
                                stringpath += "dw";
                            else if (current.x < prev.x)
                                stringpath += "aw";

                        } else if (prevchange == 0) {
                            if (current.x > prev.x)
                                stringpath += "aw";
                            else if (current.x < prev.x)
                                stringpath += "dw";
                        }
                    }   
                    var prevchange = change;
                }
            }
            return stringpath;
        }
    }
    

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

    //path
    var _Path;
    
    //temp variable
    var obj_position;

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
        obj_position = document.getElementById('info1');

        Load_objmtl('meshes/WheatleyModel.obj', 'meshes/Ghost.mtl', Params.NodeSTART.x, 0, Params.NodeSTART.z, 0.08, 0.08, 0.08);

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
                    object.name = "agent";

                    object.rotation.z = -Math.PI / 2;

                    _Visualobj = object;

                    Params.scene.add(_Visualobj);
                });
        }
        catch (err) { console.log(err); }
    }

    function Create_marker(z, x) {
        var object = new THREE.Mesh(new THREE.SphereGeometry(.15, 50, 50), new THREE.MeshBasicMaterial({ /*transparent: true, opacity: 0.7,*/ color: '#49A32A' }));
        object.name = "marker";
        object.position.set(x, 0, z);

        Params.scene.add(object);
    }

    function Create_markerCalc(z, x) {
        var object = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.5, color: '#7938D9' }));
        object.name = "markerCalc";
        object.position.set(x, 0.2, z);

        Params.scene.add(object);
    }

    function Move(movement) {
        _movement = movement;

        //Pulsar i para iniciar el recorrido
        if (movement == 'i') _Path.play();
        else                 _Path.stop();
    
        if (_Path._begin) { _movement = _Path.get_CurrentMove(); }

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
        switch (_movement.toLowerCase()) {
            case 'w':
                BlockbyBlock();
                break;
            case 'a':
            case 'd':
                _Visualobj.rotation.y = Math.radians(_direction);
                _movement = 'stop';

                _Path.add_indx(Move);
                break;
            default: //stop
                _Visualobj.translateZ(0);
                break;
        }

        Swing();
        
        obj_position.innerHTML = '<small> Robot(z,x): ' + _Visualobj.position.z.toFixed(2).toString() + ' ; ' + _Visualobj.position.x.toFixed(2).toString() + '</small>';       
    }

    function BlockbyBlock() {
        if (_Path._block < 1) {
            _Visualobj.translateZ((Borders_Delimeters() ? (ActiveCollisions ? (Collisions() ? _speed : 0) : _speed) : 0));
            _Path._block += _speed;
        }
        else {      
            _movement = 'stop';
            _Visualobj.translateZ(0);

            _Path._block = 0;
            _Path.add_indx(Move);

            Create_marker(_Visualobj.position.z, _Visualobj.position.x);
        }
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

        if (!possible) {
            _movement = 'stop'
            _Path.reset();
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

                                    _Path.reset();
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

                                    _Path.reset();
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

                                    _Path.reset();
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

                                    _Path.reset();
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

                                    _Path.reset();
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

                                    _Path.reset();
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

                                    _Path.reset();
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

    function Rev() {
        _Path.reset();
        _Visualobj.position.set(Params.NodeSTART.x, 0, Params.NodeSTART.z);
        _Visualobj.rotation.y = Math.radians(0);
    }

    function Searchstrategy_ASTAR(START, OBJETIVE, Mapcalculation) {

        function next_calculation() {
            var count_newbranchs = 0;

            function AddCalculation(nbranch, z, x, type) {
                if ((type == -1) || ((type >= 0 && type <= Params.typesblocks.length - 1) && (Params.blocks[type]._type != 'obstacle'))) {

                    var newnode = new position(z, x);
                    nbranch.nodes.push(newnode);
                    nbranch.value += 1;
                    nbranch.heuristic = heuristic(newnode, OBJETIVE);

                    /* 2B3.Añadir las nuevas trayectorias a la lista ABIERTA, si existen. */
                    OPEN.push(nbranch);

                    if (Mapcalculation) Create_markerCalc(z, x); //crea un markador de calculo en el mapa

                    count_newbranchs++;
                }


            }

            //añadir las trayectorias posibles

            var NEWbranch = OPEN.shift(); //asigna y elimina la primera rama
            CLOSE.push(NEWbranch.clone());

            var z = Number(NEWbranch.nodes[NEWbranch.nodes.length - 1].z);
            var x = Number(NEWbranch.nodes[NEWbranch.nodes.length - 1].x);

            var newz;
            var newx;


            /*  2B2.Formar nuevas trayectorias a partir de la trayectoria eliminada de ABIERTA 
            ramificando el último nodo de la misma.  */
            //ramificar abajo
            newz = z + 1;            
            if (newz < Params.height) {
                var type = Params.MAPMatrix[newz][x];
                AddCalculation(NEWbranch.clone(), newz, x, type);
            }
                  
            //ramificar arriba
            newz = z - 1;             
            if (newz >= 0) {
                var type = Params.MAPMatrix[newz][x];
                AddCalculation(NEWbranch.clone(), newz, x, type);
            }


            //ramificar derecha
            newx = x + 1;
            if (newx < Params.width) {
                var type = Params.MAPMatrix[z][newx];
                AddCalculation(NEWbranch.clone(), z, newx, type);
            }
 
            //ramificar izquierda
            newx = x - 1;               
            if (newx >= 0) {
                var type = Params.MAPMatrix[z][newx];
                AddCalculation(NEWbranch.clone(), z, newx, type);
            }                        

            return count_newbranchs;
        }

        function bound(listA, listB, samelist) {

            for (var i = 0; i < listA.length; i++) {        
                var branchA = listA[i];
                var costA   = (branchA.value + branchA.heuristic);
     
                for (var j = 0; j < listB.length; j++) {
                    var branchB = listB[j];
                    var costB   = (branchB.value + branchB.heuristic);

                    //compara los dos últimos nodos de las listas A y B, y elimina de B la rama que sea de mayor coste
                    if ((branchA.nodes[branchA.nodes.length - 1].equal(branchB.nodes[branchB.nodes.length - 1]) == true) && (costA <= costB)) {
                        if ((!samelist) || (samelist && i != j)) {
                            listB.splice(j, 1);
                            j--;
                            i--;
                        }
                    }                        
                }
            }

        }

        function heuristic(node, objetive){
            //distancia Manhattan
            var Manhattan = (Math.abs(Number(node.x) - Number(objetive.x)) + Math.abs(Number(node.z) - Number(objetive.z)));
            return Manhattan;
        }
        //--------------------------------------------

        /*  1. Formar una lista de trayectorias parciales, ABIERTA, con una trayectoria inicial
            que comienza en el nodo raíz. Formar una lista CERRADA, de trayectorias 
            desechadas mínimas, inicialmente vacía.     */
        var OPEN = new Array();
        OPEN.push(new branch(null, 0, heuristic(START, OBJETIVE)));
        OPEN[0].nodes = new Array();
        OPEN[0].nodes.push(START);

        var CLOSE = new Array();

        var i = 0;
        /*  2. Hasta que la lista ABIERTA esté vacía o se encuentre el objetivo, analizar su
        primera trayectoria: */
        /*  2A.Si la trayectoria termina en el nodo objetivo, se finaliza el bucle. */
        while (((OPEN.length != 0) && (!OPEN[0].CompareLastNode(OBJETIVE)))) {       
            /*  2B.Si la primera trayectoria no termina en el nodo objetivo:    */


            /*  2B1.Eliminar la primera trayectoria de la lista ABIERTA, incluyendola en la 
                lista CERRADA. En el caso de que ya exista una similar, eliminar la de
                mayor coste.                
                
                2B2.Formar nuevas trayectorias a partir de la trayectoria eliminada de ABIERTA 
                ramificando el último nodo de la misma.
                
                2B3.Añadir las nuevas trayectorias a la lista ABIERTA, si existen.   */
            var count_newbranchs = next_calculation();

            //  En el caso de que ya exista una similar, eliminar la de mayor coste.
            bound(OPEN, OPEN, true);

            /*  2B5. Si dos o más trayectorias de ABIERTA acaban en un nodo común, borrar las 
                mismas excepto la que posee mínimo coste entre ellas. Eliminar esta última
                también si existe una similar con menor coste en la lista CERRADA. Al 
                eliminar trayectorias de ABIERTA deben insertarse en CERRADA salvo que ya
                exista allí una similar de menor coste. */
            bound(CLOSE, OPEN, false);
            
            /*  2B4.Ordenar la lista ABIERTA en base al costo total estimado de cada una,
                colocando la de mínimo coste al inicio de la lista. */
            OPEN.sort(function (nodeA, nodeB) {
                return (nodeA.value + nodeA.heuristic) - (nodeB.value + nodeB.heuristic);
            });
            
            i++;
        }

        /*  3. Si se alcanza el nodo objetivo, el problema tiene solución y se determina la 
            trayectoria óptima, en caso contrario no existe solución. */
        if (OPEN.length != 0)
            return OPEN[0].get_StringPath();

        return "";
    }

    //METHODS
    this.Move = function (movement) { Move(movement); };

    this.setPath = function (name, agentpath) {
        _Path = new path(name, 0, 0, false, agentpath);
    }

    this.Rev = function () {
        Rev();
    }

    this.Searchstrategy_ASTAR = function (START, OBJETIVE, Mapcalculation) {
        return Searchstrategy_ASTAR(START, OBJETIVE, Mapcalculation);
    }

};