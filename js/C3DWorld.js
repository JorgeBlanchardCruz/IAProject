
/**
 * @author Jorge O. Blanchard Cruz
 * 
 */



var C3DWorld = function (WaterScene) {
    "use strict";

    //ATTRIBUTES
    var SEP_ATTRIBUTE = ',';
    var COLOR_BACKGROUNDSCENE = '#E5E8D3';
    var COLOR_MAPPLATAFORM = '#998462';
    var COLOR_BLOCK0 = 'white';

    var _container;
    var _scene, _renderer, _camera, _controls;
    var _objLoad, _water, _directionalLight;

    
    //INITIALIZE
    Initialize();


    //PROCEDURES
    function Initialize() {
        _container = document.createElement('div');
        document.body.appendChild(_container);

        _renderer = new THREE.WebGLRenderer({ antialias: true }); //inicializar Three.js
        _renderer.setSize(window.innerWidth, window.innerHeight);
        _renderer.shadowMapType = THREE.PCFSoftShadowMap;
        _renderer.setClearColor(COLOR_BACKGROUNDSCENE, 1);

        document.body.appendChild(_renderer.domElement);

        _scene = new THREE.Scene(); //crear escena
        _scene.fog = new THREE.FogExp2(0xcccccc, 0.002);
        _scene.position.set(0, 0, 0);

        _camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.5, 3000000); //creando la cámara
        _camera.position.set(-25, 50, 0);
        //_camera.rotation.set(0, 0, 0);
        _camera.lookAt(_scene.position);

        _controls = Create_TrackballControls();

        //crear objetos
        Create_directionalLight(0xffffff, 30, 20, -22);
        _directionalLight = Create_directionalLight(0xffffff, -18, 10, 12);

        if (WaterScene) { Create_WaterScene(_directionalLight); }

        animate();
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
        //debe tener como posición inicial (0,0,0)
        var cntr = new THREE.TrackballControls(_camera);

        cntr.rotateSpeed = 0.8;
        cntr.zoomSpeed = 25.0;
        cntr.panSpeed = 5.0;

        cntr.noZoom = false;
        cntr.noPan = false;

        cntr.staticMoving = false;
        cntr.dynamicDampingFactor = 0.3;

        cntr.keys = [65, 83, 68];

        cntr.addEventListener('change', render);

        return cntr;
    }

    function Create_ambientLight (color, x, y, z) {
        var ambientLight = new THREE.AmbientLight(color);
        ambientLight.position.set(x, y, z).normalize();
        ambientLight.castShadow = true;
        ambientLight.shadowDarkness = 0.5;
        ambientLight.shadowCameraVisible = true;
        ambientLight.shadowCameraRight = 5;
        ambientLight.shadowCameraLeft = -5;
        ambientLight.shadowCameraTop = 5;
        ambientLight.shadowCameraBottom = -5;

        _scene.add(ambientLight);

        return ambientLight;
    }

    function Create_directionalLight (color, x, y, z) {
        var directionalLight = new THREE.DirectionalLight(color);
        directionalLight.position.set(x, y, z);
        directionalLight.castShadow = true;
        directionalLight.shadowDarkness = 0.5;
        directionalLight.shadowCameraVisible = true;
        directionalLight.shadowCameraRight = 5;
        directionalLight.shadowCameraLeft = -5;
        directionalLight.shadowCameraTop = 5;
        directionalLight.shadowCameraBottom = -5;

        _scene.add(directionalLight);

        return directionalLight;
    }

    function Create_cube(h, w, l, color, x, y, z) {
        var cube = new THREE.Mesh(new THREE.BoxGeometry(h, w, l), new THREE.MeshLambertMaterial({ color: color }));
        cube.id = Number(x.toString() + '100' + z.toString())
        cube.position.set(x, y, z);
        cube.castShadow = true;
        cube.receiveShadow = true;
        //cube.rotateOnAxis(new THREE.Vector3(0, 0, 1).normalize(), 0.075);
        _scene.add(cube);

        return cube;
    }

    function Create_torus(radius, tube, radialSegments, tubularSegments, color, x, y, z) {
        var torus = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments), new THREE.MeshLambertMaterial({ color: color }));
        torus.position.set(x, y, z);
        torus.castShadow = true;
        torus.receiveShadow = true;
        //torus.rotateOnAxis(new THREE.Vector3(0, 0, 1).normalize(), 0.075);
        _scene.add(torus);

        return torus;
    }

    function Create_cylinder(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, color, x, y, z) {
        var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, false), new THREE.MeshLambertMaterial({ color: color }));
        cylinder.position.set(x, y, z);
        cylinder.castShadow = true;
        cylinder.receiveShadow = true;
        //cylinder.rotateOnAxis(new THREE.Vector3(1, 1, 0), 1);
        _scene.add(cylinder);

        return cylinder;
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
                object.castShadow = true;
                object.receiveShadow = true;
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
                    object.castShadow = true;
                    object.receiveShadow = true;

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
            _objLoad.castShadow = true;
            _objLoad.receiveShadow = true;
        });
    }

      

    //METHODS
        
        //-------------------------------------------------------
        //getters
        this.get_Camera = function () { return _camera; };

        this.get_Renderer = function () { return _renderer; };

        this.get_Scene = function () { return _scene; };

        //setters

        //-------------------------------------------------------
    
    this.Create_CaveofMapfile = function (file) {
        var reader = new FileReader();

        reader.onload = function (progressEvent) {

            //separa el contenido del fichero por \n
            var content = this.result.split('\n');

            //recogemos las dimensiones del mapa
            var width = content[0].substring(0, content[0].lastIndexOf('x'));
            var height = content[0].substring(content[0].lastIndexOf('x') + 1, content[0].length);

            width = Number(width); height = Number(height);

            //Creamos los bloques ocupando todo el mapa
            for (var x = 0; x < height; x++)
                for (var z = 0; z < width; z++)
                    Create_cube(1, 1, 1, COLOR_BLOCK0, x, 0, z);

            //crea una plataforma (cubo) donde sustentar el mapa
            width = Number(width) + 1; height = Number(height) + 1;
            Create_cube(width, .25, height, COLOR_MAPPLATAFORM, (height / 2) - 1, -0.5, (width / 2) - 1);

            //leemos linea a linea del fichero de texto y eliminamos los bloques encontrados
            for (var i = 1; i < content.length; i++) {

                var line = content[i];
                var x = line.substring(0, line.lastIndexOf(SEP_ATTRIBUTE));
                var z = line.substring(line.lastIndexOf(SEP_ATTRIBUTE) + 1, line.length);

                var selectedObject = _scene.getObjectById(Number(x.toString() + '100' + z.toString()));
                _scene.remove(selectedObject);
            }
        };

        reader.readAsText(file);
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