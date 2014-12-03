
/**
 * @author Jorge O. Blanchard Cruz
 * 
 */

"use strict";

var C3DWorld = function (Antialias, OceanScene) {

    //STRUCTURES
    function Block(id, type, pathtexture, color, height) {
        this._id = id;
        this._type = type;
        this._pathtexture = pathtexture; //si utilizamos texturas el rendimiento es mucho menor
        this._color = color;
        this._height = height;
    };

    //ATTRIBUTES
    const SEP_COORD = ',';
    const SET_TYPE = ';';
    const COLOR_BACKGROUNDSCENE = '#BDE6F2';
    const LIMAP_CONTENT = 4;

        //Objetos para la escena
        var _container;
        var _scene, _renderer, _camera, _controls;
        var _objLoad, _water, _directionalLight;
        //----------------------

        //atributos del mapa
        var _MAPMatrix;
        var _MapWidth = 0, _MapHeight = 0;
        var _Path;
        var _NodeSTART;
        var _NodeOBJETIVE;
        //---------------------

    var _TypeBlock;
    var _Blocks;
 
    
    //INITIALIZE
    init();
    init_Blocks();

    //PROCEDURES
    function init() {
        _container = document.createElement('div');
        _container.id = "3DCanvas";
        document.body.appendChild(_container);

        _renderer = new THREE.WebGLRenderer({ antialias: Antialias }); //inicializar Three.js
        _renderer.setSize(window.innerWidth, window.innerHeight);
        //_renderer.shadowMapType = THREE.PCFSoftShadowMap;
        _renderer.setClearColor(COLOR_BACKGROUNDSCENE, 1);

        _renderer.domElement.id = "RenderdomElement";
        document.body.appendChild(_renderer.domElement);

        _scene = new THREE.Scene(); //crear escena
        //_scene.fog = new THREE.FogExp2(0xcccccc, 0.002);
        _scene.position.set(0, 0, 0);

        _camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.01, 3000000); //creando la c�mara
        _camera.position.set(50, 100, 50);
        //_camera.rotation.set(25, 25, 0);
        //_camera.lookAt(_scene.position);

        _controls = Create_TrackballControls();

        //crear objetos
        Create_directionalLight(0xffffff, 30, 20, -22);
        _directionalLight = Create_directionalLight(0xffffff, -18, 10, 12);

        if (OceanScene) { Create_WaterScene(_directionalLight); }

        animate();
    }

    function init_Blocks() {
        _TypeBlock = ['obstacle', 'removable', 'floor'];

        //Poned colores y texturas a los blockes asi como el tipo de bloque.
        //(Solo 'obstacle' funcionar� para las colisiones)
        _Blocks = [
            new Block('suelo', _TypeBlock[2], 'meshes/rock3.jpg', '#91683C', 0.25),
            new Block('pared', _TypeBlock[0], 'meshes/rock.jpg', '#6B5A37', 1),
            new Block('escombros', _TypeBlock[1], 'meshes/plywood.jpg', '#F2D21D', 1),
            new Block('pozo', _TypeBlock[0], 'meshes/water.jpg', '#3D85B3', 0.1)
        ];
    }

    function Clear_all() {
        Clear_Cave();
        document.getElementById(_container.id).remove();
        document.getElementById(_renderer.domElement.id).remove();
    }

    function animate() {
        requestAnimationFrame(animate);

        //_camera.translateX(0.01);

        if (_controls != null) { _controls.update(); }

        if (_water != null) {
            _water.material.uniforms.time.value += 1.0 / 200.0;
            _water.render();
        }

        render();
    }

    function render() {
        _renderer.render(_scene, _camera);
    }

    function Create_WaterScene(directionalLight) {

        _scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

        var parameters = {
            width: 2000,
            height: 2000,
            widthSegments: 250,
            heightSegments: 250,
            depth: 1500,
            param: 4,
            filterparam: 1,
            x: 0,
            y: -50,
            z: 0
        }

        var waterNormals = new THREE.ImageUtils.loadTexture('meshes/waternormals.jpg');
        waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

        _water = new THREE.Water(_renderer, _camera, _scene, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: waterNormals,
            alpha: 1.0,
            sunDirection: directionalLight.position.normalize(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 50.0,
        });

        var mirrorMesh = new THREE.Mesh(new THREE.PlaneGeometry(parameters.width * 500, parameters.height * 500, 50, 50), _water.material);

        mirrorMesh.add(_water);
        mirrorMesh.rotation.x = -Math.PI * 0.5;
        mirrorMesh.position.set(parameters.x, parameters.y, parameters.z);
        _scene.add(mirrorMesh);

        // load skybox
        var cubeMap = new THREE.CubeTexture([]);
        cubeMap.format = THREE.RGBFormat;
        cubeMap.flipY = false;

        var loader = new THREE.ImageLoader();
        loader.load('meshes/skyboxsun25degtest.png', function (image) {
            var getSide = function (x, y) {
                var size = 1024;

                var canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;

                var context = canvas.getContext('2d');
                context.drawImage(image, -x * size, -y * size);

                return canvas;
            };

            cubeMap.images[0] = getSide(2, 1); // px
            cubeMap.images[1] = getSide(0, 1); // nx
            cubeMap.images[2] = getSide(1, 0); // py
            cubeMap.images[3] = getSide(1, 2); // ny
            cubeMap.images[4] = getSide(1, 1); // pz
            cubeMap.images[5] = getSide(3, 1); // nz
            cubeMap.needsUpdate = true;
        });

        var cubeShader = THREE.ShaderLib['cube'];
        cubeShader.uniforms['tCube'].value = cubeMap;

        var skyBoxMaterial = new THREE.ShaderMaterial({
            fragmentShader: cubeShader.fragmentShader,
            vertexShader: cubeShader.vertexShader,
            uniforms: cubeShader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        });

        var skyBox = new THREE.Mesh(new THREE.BoxGeometry(1000000, 1000000, 1000000), skyBoxMaterial);

        skyBox.position.set(parameters.x, parameters.y, parameters.z);
        _scene.add(skyBox);
    }

    function Create_TrackballControls() {
        //para que funcione TrackballControls la camara no 
        //debe tener como posici�n inicial (0,0,0)
        var cntr = new THREE.TrackballControls(_camera);

        cntr.rotateSpeed = 0.8;
        cntr.zoomSpeed = 10.0;
        cntr.panSpeed = 2.0;

        cntr.noZoom = false;
        cntr.noPan = false;

        cntr.staticMoving = true;
        cntr.dynamicDampingFactor = 50;

        cntr.keys = [65, 83, 68];

        cntr.addEventListener('change', render);

        return cntr;
    }

    function Create_ambientLight (color, x, y, z) {
        var ambientLight = new THREE.AmbientLight(color);
        ambientLight.position.set(x, y, z).normalize();

        _scene.add(ambientLight);

        return ambientLight;
    }

    function Create_directionalLight (color, x, y, z) {
        var directionalLight = new THREE.DirectionalLight(color);
        directionalLight.position.set(x, y, z);

        _scene.add(directionalLight);

        return directionalLight;
    }

    function Create_cube(h, w, l, color, x, y, z, name) {
        var cube = new THREE.Mesh(new THREE.BoxGeometry(w, h, l), new THREE.MeshLambertMaterial({ color: color }));
        cube.id = Number('10' + z.toString() + '10' + x.toString());
        cube.name = name;
        cube.position.set(x, y, z);
        //cube.rotateOnAxis(new THREE.Vector3(0, 0, 1).normalize(), 0.075);
        _scene.add(cube);

        return cube;
    }

    function Create_cubeBlock(block, w, l, x, y, z, Textures) {
        if ((block._pathtexture != '') && (Textures))
            Create_cubeTexture(block, w, l, x, y, z);
        else
            Create_cube(block._height, w, l, block._color, x, y, z, block._type);
    }

    function Create_cubeTexture(block, w, l, x, y, z) {
        var material = new THREE.MeshLambertMaterial({
            map: THREE.ImageUtils.loadTexture(block._pathtexture)
        })
        //new THREE.MeshLambertMaterial({ map: block.texture, color: 0xffffff, ambient: 0x777777, shading: THREE.SmoothShading })

        var cube = new THREE.Mesh(new THREE.BoxGeometry(w, block._height, l), material);
        cube.id = Number('10' + z.toString() + '10' + x.toString());
        cube.name = block._type;
        cube.position.set(x, y, z);

        _scene.add(cube);

        return cube;
    }

    function Create_torus(radius, tube, radialSegments, tubularSegments, color, x, y, z) {
        var torus = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments), new THREE.MeshLambertMaterial({ color: color }));
        torus.position.set(x, y, z);
        //torus.rotateOnAxis(new THREE.Vector3(0, 0, 1).normalize(), 0.075);
        _scene.add(torus);

        return torus;
    }

    function Create_cylinder(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, color, x, y, z) {
        var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, false), new THREE.MeshLambertMaterial({ color: color }));
        cylinder.position.set(x, y, z);
        //cylinder.rotateOnAxis(new THREE.Vector3(1, 1, 0), 1);
        _scene.add(cylinder);

        return cylinder;
    }

    function Create_sphere(radius, widthSegments, heightSegments, color, x, y, z) {
        var object = new THREE.Mesh(new THREE.SphereGeometry(radius, widthSegments, heightSegments), new THREE.MeshLambertMaterial({ color: color }));
        object.id = Number('10' + z.toString() + '10' + x.toString());
        object.position.set(x, y, z);

        _scene.add(object);

        return object;
    }

    function Load_obj(fileobj, filetexture, x, y, z, scalex, scaley, scalez) {
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
                object.scale.set(scalex, scaley, scalez);

                _objLoad = object;

                //_scene.add(object);
            });
        }
        catch (err) { alert("Error al cargar el mesh!"); }
    }

    function Load_objmtl(fileobj, filemtl, x, y, z, scalex, scaley, scalez) {
        try {
            THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
            var loader = new THREE.OBJMTLLoader();
            loader.load(fileobj, filemtl,
                function (object) {
                    object.position.set(x, y, z);
                    object.scale.set(scalex, scaley, scalez);

                    _objLoad = object;

                    //_scene.add(object);
                });
        }
        catch (err) { alert("Error al cargar el mesh!"); }
    }

    function Load_objjs(fileobj) {
        var loader = new THREE.JSONLoader(true);
        loader.load(fileobj, function (geometry) {
            // Now that our object is loaded we can add it to our _scene.
            var material = new THREE.MeshPhongMaterial({ color: 0xffffff, specular: 0xffffff, shininess: 20, morphTargets: true, morphNormals: true, vertexColors: THREE.FaceColors, shading: THREE.SmoothShading, perPixel: false });
            var material2 = new THREE.MeshLambertMaterial({ color: 0xffffff, morphTargets: true, vertexColors: THREE.FaceColors, shading: THREE.FlatShading });

            //geometry.computeMorphNormals();
            morphColorsToFaceColors(geometry);
            _objLoad = new THREE.MorphAnimMesh(geometry, material2);
            _objLoad.scale.set(.5, .5, .5);
        });
    }

    function getObjectByName (namesearch) {
        for (var i = 0, l = _scene.children.length; i < l; i ++) {
            var child = _scene.children[i];
            var name = child.name.toString();
            if (name == namesearch) {
                return child;
            }
        }
        return undefined;
    }

    function Read_FileMap_Way(content, Textures) {
        //Creamos los bloques ocupando todo el mapa y tambien la matriz del mapa
        _MAPMatrix = new Array();
        for (var z = 0; z < _MapHeight ; z++) {
            var row = new Array()
            for (var x = 0; x < _MapWidth; x++)
                row.push(1);

            _MAPMatrix.push(row);
        }

        //leemos linea a linea del fichero de texto y eliminamos los bloques encontrados
        for (var i = LIMAP_CONTENT; i < content.length; i++) {
            var line = content[i];
            var z = Number(line.substring(0, line.lastIndexOf(SEP_COORD)));
            var x = Number(line.substring(line.lastIndexOf(SEP_COORD) + 1, line.lastIndexOf(SET_TYPE)));
            var type = Number(line.substring(line.lastIndexOf(SET_TYPE) + 1, line.length));

            var id = Number('10' + Number(z) + '10' + Number(x));
            var selectedObject = _scene.getObjectById(id);
            _scene.remove(selectedObject);
            if (type != -1) Create_cubeBlock(_Blocks[type], 1, 1, x, 0, z, Textures);

            //modifica el elemento del array de mapa correspondiente
            _MAPMatrix[z][x] = type;
        }
    }

    function Read_FileMap_Blocks(content, Textures) {
        //Creamos  la matriz del mapa
        _MAPMatrix = new Array();
        for (var z = 0; z < _MapHeight; z++) {
            var row = new Array()
            for (var x = 0; x < _MapWidth; x++)
                row.push(-1);

            _MAPMatrix.push(row);
        }

        //leemos linea a linea del fichero de texto e insertamos los bloques encontrados
        for (var i = LIMAP_CONTENT; i < content.length; i++) {
            var line = content[i];
            var z = Number(line.substring(0, line.lastIndexOf(SEP_COORD)));
            var x = Number(line.substring(line.lastIndexOf(SEP_COORD) + 1, line.lastIndexOf(SET_TYPE)));
            var type = Number(line.substring(line.lastIndexOf(SET_TYPE) + 1, line.length));

            var y = (_Blocks[type]._height < 1 ? -0.25 - _Blocks[type]._height : 0);

            //si el bloque es de tipo 1, tenemos el nodo objetivo
            if (type == 2)
                _NodeOBJETIVE = new position(z, x);

            Create_cubeBlock(_Blocks[type], 1, 1, x, y, z, Textures);

            //modifica el elemento del array de mapa correspondiente
            _MAPMatrix[z][x] = type;
        }
    }

    function Clear_Cave() {
        for (var i = 0; i < _scene.children.length; i++) {
            var object = _scene.children[i];
            if ((object.name == _TypeBlock[0]) ||
                (object.name == _TypeBlock[1]) ||
                (object.name == _TypeBlock[2]) ||
                (object.name == "agent") ||
                (object.name == "marker") ||
                (object.name == "markerCalc")) {
                _scene.remove(object);
                i--;
            }
        }
    }

    //METHODS    
        
        //getters
    this.get_Params = function () {
        return {
            scene: _scene,
            renderer: _renderer,
            camera: _camera,
            width: _MapWidth,
            height: _MapHeight,
            typesblocks: _TypeBlock,
            blocks: _Blocks,
            path: _Path,
            MAPMatrix: _MAPMatrix,
            NodeSTART: _NodeSTART,
            NodeOBJETIVE: _NodeOBJETIVE
        };
    }
        //-------------------------------------------------------

        //setters

        //-------------------------------------------------------
 
    this.Create_CaveofMapfile = function (file, callback, Textures) {
        /*

            El formato del fichero es el siguiente:
            1� l�nea: especifica 'way' (se eliminar�n los bloques que crean los caminos) 
                        o 'blocks' (donde se a�adir�n los boques introducidos)
            2� l�nea: tama�o del mapa (ejemplo: 15x15)
            3� l�nea: se definir� la posici�n de los Agentes o robots (z,x)
            4� l�nea: se definir� la trayectoria que recorrer� el agente, ejemplo: wwwwwwswwwwawwwwww
            5� l�nea en adelante: posici�n de los bloques o caminos con el formato z,x;tipobloque.

        */
        var reader = new FileReader();
        reader.onload = function (progressEvent) {
            //separa el contenido del fichero por \n
            var content = this.result.split('\n');

            //recogemos el tipo de procedimiento que se va a realizar
            var procetype = content[0];

            //recogemos las dimensiones del mapa
            var height = content[1].substring(0, content[1].lastIndexOf('x'));
            var width = content[1].substring(content[1].lastIndexOf('x') + 1, content[1].length);
    
            width = Number(width);
            height = Number(height);
            _MapWidth = width;
            _MapHeight = height;

            //crea una plataforma (cubo) donde sustentar el mapa
            width = Number(width) + 1; height = Number(height) + 1;
            Create_cubeBlock(_Blocks[0], width, height, (width / 2) - 1, -0.5, (height / 2) - 1, Textures);

            //recoge la posici�n del agente (z,x)
            _NodeSTART = new position(Number(content[2].substring(0, content[2].lastIndexOf(SEP_COORD))), Number(content[2].substring(content[2].lastIndexOf(SEP_COORD) + 1, content.length - 1)));
            //_NodeOBJETIVE = new position(1, 0);

            //recoge la trayectoria del agente
            _Path = content[3];
         
            if (procetype.substring(0, 3) == 'way')
                Read_FileMap_Way(content, Textures);
            else if (procetype.substring(0, 6) == 'blocks')
                Read_FileMap_Blocks(content, Textures);

            callback(); //ejecuta las funciones posteriores a cuando termina la carga del mapa
        };

        reader.readAsText(file);
    };

    this.Clear_Cave = function () {
        Clear_Cave();
    };

    this.Clear_all = function () {
        Clear_all();
    };

    this.Create_ambientLight = function (color, x, y, z) {
        Create_ambientLight(color, x, y, z);
    };

    this.Create_directionalLight = function (color, x, y, z) {
        Create_directionalLight(color, x, y, z);
    };

    this.Create_cube = function (h, w, l, color, x, y, z) {
        Create_cube(h, w, l, color, x, y, z);
    };

    this.Create_torus = function (radius, tube, radialSegments, tubularSegments, color, x, y, z) {
        Create_torus(radius, tube, radialSegments, tubularSegments, color, x, y, z);
    };

    this.Create_cylinder = function (radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, color, x, y, z) {
        Create_cylinder(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, color, x, y, z);
    };

    this.Load_obj = function (fileobj, filetexture, x, y, z, scalex, scaley, scalez) {
        Load_obj(fileobj, filetexture, x, y, z, scalex, scaley, scalez);
    };

    this.Load_objmtl = function (fileobj, filemtl, x, y, z, scalex, scaley, scalez) {
        Load_objmtl(fileobj, filemtl, x, y, z, scalex, scaley, scalez);
    };

    this.Load_objjs = function (fileobj) {
        Load_objjs(fileobj);
    };
    
};