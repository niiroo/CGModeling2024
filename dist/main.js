/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app.ts":
/*!********************!*\
  !*** ./src/app.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var three__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! three */ "./node_modules/three/build/three.module.js");
/* harmony import */ var three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! three/examples/jsm/controls/OrbitControls */ "./node_modules/three/examples/jsm/controls/OrbitControls.js");
/* harmony import */ var cannon_es__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! cannon-es */ "./node_modules/cannon-es/dist/cannon-es.js");
/* harmony import */ var _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @tweenjs/tween.js */ "./node_modules/@tweenjs/tween.js/dist/tween.esm.js");




class ThreeJSContainer {
    scene;
    light;
    light1;
    constructor() {
    }
    // 画面部分の作成(表示する枠ごとに)*
    createRendererDOM = (width, height, cameraPos) => {
        const renderer = new three__WEBPACK_IMPORTED_MODULE_2__.WebGLRenderer();
        renderer.setSize(width, height);
        renderer.setClearColor(new three__WEBPACK_IMPORTED_MODULE_2__.Color(0x495ed));
        renderer.shadowMap.enabled = true; //シャドウマップを有効にする
        //カメラの設定
        const camera = new three__WEBPACK_IMPORTED_MODULE_2__.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.copy(cameraPos);
        camera.lookAt(new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(0, 0, 0));
        const orbitControls = new three_examples_jsm_controls_OrbitControls__WEBPACK_IMPORTED_MODULE_0__.OrbitControls(camera, renderer.domElement);
        this.createScene();
        // 毎フレームのupdateを呼んで，render
        // reqestAnimationFrame により次フレームを呼ぶ
        const render = (time) => {
            orbitControls.update();
            renderer.render(this.scene, camera);
            requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
        renderer.domElement.style.cssFloat = "left";
        renderer.domElement.style.margin = "10px";
        return renderer.domElement;
    };
    // シーンの作成(全体で1回)
    createScene = () => {
        this.scene = new three__WEBPACK_IMPORTED_MODULE_2__.Scene();
        const world = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.World({ gravity: new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3(0, -9.82, 0) });
        world.defaultContactMaterial.restitution = 0.0;
        world.defaultContactMaterial.friction = 0.00;
        // 風鈴作成
        let SphereSize = 1; // Sphereのサイズを決める
        let addSphereGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.SphereGeometry(SphereSize, 32, 16, 0, Math.PI * 2, 0, 2.1);
        let SphereMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshLambertMaterial({
            side: three__WEBPACK_IMPORTED_MODULE_2__.DoubleSide,
            color: 0xffffff,
            opacity: 0.5,
            transparent: true // 透明度を有効にする        
        });
        let SphereMesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(addSphereGeometry, SphereMaterial);
        // Sphereオブジェクトを移動する
        SphereMesh.position.x = 0;
        SphereMesh.position.y = 5;
        SphereMesh.position.z = 0;
        this.scene.add(SphereMesh);
        // 風鈴の紙作成
        const col = 5;
        const row = 10;
        const clothSize = 1;
        const dist = clothSize / col; //パーティクル間の距離
        const shape = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Particle();
        const particles = [];
        //各パーティクルのCANNON.Bodyを作成  
        for (let i = 0; i <= col; i++) {
            particles.push([]);
            for (let j = 0; j <= row; j++) {
                const positionX = (i - col * 0.5) * dist;
                const positionY = (j - row * 0.5) * dist + 1.1;
                const positionZ = 0;
                const initialPosition = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3(positionX, positionY, positionZ);
                const particle = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Body({
                    //一番上を固定して他の点を自由に動かすため
                    //現在の行数が総行数と等しい場合、質量（mass）を0
                    mass: j === row ? 0 : 1,
                    shape,
                    position: initialPosition,
                    //パーティクルが布の上端からどれだけ離れているかを示し、これに-0.1を掛けて初期速度を計算
                    //布の下端がより速く動き、上端がほぼ動かない
                    velocity: new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3(0, 0, -0.1 * (row - j))
                });
                particles[i].push(particle);
                world.addBody(particle);
            }
        }
        //パーティクルがdistの距離を保つように制約するための関数  
        function connect(i1, j1, i2, j2) {
            world.addConstraint(new cannon_es__WEBPACK_IMPORTED_MODULE_3__.DistanceConstraint(particles[i1][j1], particles[i2][j2], dist));
        }
        //各パーティクルにCANNON.DistanceConstraint（制約）を設定  
        for (let i = 0; i <= col; i++) {
            for (let j = 0; j <= row; j++) {
                if (i < col)
                    connect(i, j, i + 1, j);
                if (j < row)
                    connect(i, j, i, j + 1);
            }
        }
        const clothGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.PlaneGeometry(1, 1, col, row);
        const clothMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshLambertMaterial({
            color: '#00ffff',
            side: three__WEBPACK_IMPORTED_MODULE_2__.DoubleSide,
            //  wireframe: true,
        });
        const clothMesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(clothGeometry, clothMaterial);
        clothMesh.position.y = 2;
        clothMesh.rotation.y = 0.5;
        this.scene.add(clothMesh);
        // 風の力を定義
        const windForce = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Vec3(0.1, 0, 0);
        // 浮き輪作成
        let TorusGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.TorusGeometry(0.7, 0.3, 16, 100);
        let TorusMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshLambertMaterial({
            side: three__WEBPACK_IMPORTED_MODULE_2__.DoubleSide,
            color: 0x00ffff,
            opacity: 0.5,
            transparent: true // 透明度を有効にする        
        });
        let TorusMaterial1 = new three__WEBPACK_IMPORTED_MODULE_2__.MeshLambertMaterial({
            side: three__WEBPACK_IMPORTED_MODULE_2__.DoubleSide,
            color: 0xff00ff,
            opacity: 0.6,
            transparent: true // 透明度を有効にする        
        });
        let TorusMaterial2 = new three__WEBPACK_IMPORTED_MODULE_2__.MeshLambertMaterial({
            side: three__WEBPACK_IMPORTED_MODULE_2__.DoubleSide,
            color: 0xffff00,
            opacity: 0.7,
            transparent: true // 透明度を有効にする        
        });
        let TorusMesh = [];
        TorusMesh[0] = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(TorusGeometry, TorusMaterial);
        TorusMesh[1] = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(TorusGeometry, TorusMaterial1);
        TorusMesh[2] = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(TorusGeometry, TorusMaterial2);
        for (let i = 0; i < 3; i++) {
            TorusMesh[i].position.set(i * 3 - 3, 0, i * 3 + 5);
            TorusMesh[i].rotateX(Math.PI / 2);
            this.scene.add(TorusMesh[i]);
        }
        // 浮き輪の物理
        const TorusShape = cannon_es__WEBPACK_IMPORTED_MODULE_3__.Trimesh.createTorus(0.7, 0.3, 16, 100);
        const TorusBody = [];
        for (let i = 0; i < 3; i++) {
            TorusBody[i] = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Body({
                mass: 0.5
            });
            TorusBody[i].addShape(TorusShape);
            TorusBody[i].position.set(TorusMesh[i].position.x, TorusMesh[i].position.y, TorusMesh[i].position.z);
            TorusBody[i].quaternion.set(TorusMesh[i].quaternion.x, TorusMesh[i].quaternion.y, TorusMesh[i].quaternion.z, TorusMesh[i].quaternion.w);
            world.addBody(TorusBody[i]);
        }
        // 地面作成
        const phongMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshPhongMaterial({ color: 0x0055ff });
        const planeGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.PlaneGeometry(25, 25);
        const planeMesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(planeGeometry, phongMaterial);
        planeMesh.material.side = three__WEBPACK_IMPORTED_MODULE_2__.DoubleSide; // 両面
        planeMesh.rotateX(-Math.PI / 2);
        this.scene.add(planeMesh);
        const planeShape = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Plane();
        const planeBody = new cannon_es__WEBPACK_IMPORTED_MODULE_3__.Body({ mass: 0 });
        planeBody.addShape(planeShape);
        planeBody.position.set(planeMesh.position.x, planeMesh.position.y, planeMesh.position.z);
        planeBody.quaternion.set(planeMesh.quaternion.x, planeMesh.quaternion.y, planeMesh.quaternion.z, planeMesh.quaternion.w);
        world.addBody(planeBody);
        // 太陽作成
        let SunSize = 2; // Sphereのサイズを決める
        let SunGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.SphereGeometry(SunSize, 32, 16, 0, Math.PI * 2, 0);
        let SunMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshLambertMaterial({
            side: three__WEBPACK_IMPORTED_MODULE_2__.DoubleSide,
            color: 0xff9900,
        });
        let SunMesh = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(SunGeometry, SunMaterial);
        // Sphereオブジェクトを移動する
        SunMesh.position.set(-8, 6, -5);
        this.scene.add(SunMesh);
        // Tweenでコントロールする変数の定義
        let tweeninfo = { scale: 1 };
        //  Tweenでパラメータの更新の際に呼び出される関数
        let updateScale = () => {
            SunMesh.scale.x = tweeninfo.scale;
        };
        // Tweenの作成
        const tween = new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_1__.Tween(tweeninfo).to({ scale: 1.3 }, 700).easing(_tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_1__.Easing.Bounce.Out).onUpdate(updateScale);
        const tweenBack = new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_1__.Tween(tweeninfo).to({ scale: 1 }, 1000).delay(1000).onUpdate(updateScale);
        tween.chain(tweenBack);
        tweenBack.chain(tween);
        // アニメーションの開始
        tween.start();
        // 日差し作成
        let SunlightGeometry = new three__WEBPACK_IMPORTED_MODULE_2__.CylinderGeometry(0.05, 0.3, 3, 16);
        let SunlightMaterial = new three__WEBPACK_IMPORTED_MODULE_2__.MeshLambertMaterial({
            side: three__WEBPACK_IMPORTED_MODULE_2__.DoubleSide,
            color: 0xffaa00,
        });
        let SunlightMesh = [];
        for (let i = 0; i < 4; i++) {
            SunlightMesh[i] = new three__WEBPACK_IMPORTED_MODULE_2__.Mesh(SunlightGeometry, SunlightMaterial);
            // オブジェクトを移動する
            SunlightMesh[i].rotation.set(0, 0, Math.PI / 5 * i);
            this.scene.add(SunlightMesh[i]);
        }
        SunlightMesh[0].position.set(-8.5, 1.8, -5);
        SunlightMesh[1].position.set(-6, 2.5, -5);
        SunlightMesh[2].position.set(-4, 4.5, -5);
        SunlightMesh[3].position.set(-3.5, 7, -5);
        // Tweenでコントロールする変数の定義
        let SunlightTweeninfo = { scaleX: 0, scaleY: 0 };
        //  Tweenでパラメータの更新の際に呼び出される関数
        let updateHeight = () => {
            for (let i = 0; i < 4; i++) {
                SunlightMesh[i].scale.x = SunlightTweeninfo.scaleX;
                SunlightMesh[i].scale.y = SunlightTweeninfo.scaleY;
            }
        };
        // Tweenの作成
        const SunlightTween = new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_1__.Tween(SunlightTweeninfo).to({ scaleX: 1.1, scaleY: 1.1 }, 250).delay(800).easing(_tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_1__.Easing.Quadratic.Out).onUpdate(updateHeight);
        const SunlightTweenBack = new _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_1__.Tween(SunlightTweeninfo).to({ scaleX: 0, scaleY: 0 }, 500).delay(1000).onUpdate(updateHeight);
        SunlightTween.chain(SunlightTweenBack);
        SunlightTweenBack.chain(SunlightTween);
        // アニメーションの開始
        SunlightTween.start();
        // // グリッド表示
        // const gridHelper = new THREE.GridHelper(10,);
        // this.scene.add(gridHelper);
        // // 軸表示
        // const axesHelper = new THREE.AxesHelper(5);
        // this.scene.add(axesHelper);
        //ライトの設定
        this.light = new three__WEBPACK_IMPORTED_MODULE_2__.DirectionalLight(0xffffff);
        const lvec = new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(1, 1, 1).clone().normalize();
        this.light.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light);
        this.light1 = new three__WEBPACK_IMPORTED_MODULE_2__.HemisphereLight(0x507fff, 0xd0e040, 0.3);
        this.light1.position.set(lvec.x, lvec.y, lvec.z);
        this.scene.add(this.light1);
        let update = (time) => {
            world.fixedStep();
            // 風鈴の紙
            for (let i = 0; i <= col; i++) {
                for (let j = 0; j <= row; j++) {
                    //2Dのパーティクル配列から1DのPlaneGeometryの頂点へのマッピングが必要
                    //そのために2Dのiとjの位置を1Dのインデックスに変換
                    const index = j * (col + 1) + i;
                    const positionAttribute = clothGeometry.attributes.position;
                    //パーティクルの位置の位置を取得
                    //（row-j）でy軸方向の順序を反転させて、PlaneGeometryの頂点の位置にあわせる
                    const position = particles[i][row - j].position;
                    positionAttribute.setXYZ(index, position.x, position.y, position.z);
                    positionAttribute.needsUpdate = true;
                    particles[i][j].applyForce(windForce, particles[i][j].position);
                }
            }
            // 浮き輪
            for (let i = 0; i < 3; i++) {
                TorusBody[i].applyForce(windForce, TorusBody[i].position);
                TorusBody[i].velocity.set(0, 0, Math.random() * -1 - 0.1);
                if (TorusBody[i].position.z < -10) {
                    TorusBody[i].position.set(i * 3 - 3, 0, i * 3 + 5);
                }
                TorusMesh[i].position.set(TorusBody[i].position.x, TorusBody[i].position.y, TorusBody[i].position.z);
            }
            // 風のキーボード操作
            document.addEventListener('keydown', (event) => {
                switch (event.key) {
                    case 'ArrowRight':
                        //右方向
                        windForce.set(5, 0, 0);
                        break;
                    case 'ArrowLeft':
                        //左方向
                        windForce.set(-5, 0, 0);
                        break;
                    case 'ArrowDown':
                        //手前
                        windForce.set(0, 0, 5);
                        break;
                    case 'ArrowUp':
                        //奥
                        windForce.set(0, 0, -5);
                        break;
                }
            });
            document.addEventListener('keyup', (event) => {
                switch (event.key) {
                    case 'ArrowRight':
                        //右方向
                        windForce.set(0, 0, 0);
                        break;
                    case 'ArrowLeft':
                        //左方向
                        windForce.set(0, 0, 0);
                        break;
                    case 'ArrowDown':
                        //手前
                        windForce.set(0, 0, 5);
                        break;
                    case 'ArrowUp':
                        //奥
                        windForce.set(0, 0, 0);
                        break;
                }
            });
            _tweenjs_tween_js__WEBPACK_IMPORTED_MODULE_1__.update();
            requestAnimationFrame(update);
        };
        requestAnimationFrame(update);
    };
}
window.addEventListener("DOMContentLoaded", init);
function init() {
    let container = new ThreeJSContainer();
    let viewport = container.createRendererDOM(640, 480, new three__WEBPACK_IMPORTED_MODULE_2__.Vector3(-3, 3, 9));
    document.body.appendChild(viewport);
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkcgprendering"] = self["webpackChunkcgprendering"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_tweenjs_tween_js_dist_tween_esm_js-node_modules_cannon-es_dist_cannon-es-180163"], () => (__webpack_require__("./src/app.ts")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUM7SUFDbEYsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDeEMsQ0FBQzs7Ozs7OztVQ3BZRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOztVQUVBO1VBQ0E7Ozs7O1dDekJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsK0JBQStCLHdDQUF3QztXQUN2RTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlCQUFpQixxQkFBcUI7V0FDdEM7V0FDQTtXQUNBLGtCQUFrQixxQkFBcUI7V0FDdkM7V0FDQTtXQUNBLEtBQUs7V0FDTDtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7Ozs7O1dDM0JBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7OztXQ05BOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxNQUFNLHFCQUFxQjtXQUMzQjtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBOztXQUVBO1dBQ0E7V0FDQTs7Ozs7VUVoREE7VUFDQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL2NncHJlbmRlcmluZy8uL3NyYy9hcHAudHMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvY2h1bmsgbG9hZGVkIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2NncHJlbmRlcmluZy93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vY2dwcmVuZGVyaW5nL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IE9yYml0Q29udHJvbHMgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2NvbnRyb2xzL09yYml0Q29udHJvbHNcIjtcbmltcG9ydCAqIGFzIENBTk5PTiBmcm9tICdjYW5ub24tZXMnO1xuaW1wb3J0ICogYXMgVFdFRU4gZnJvbSBcIkB0d2VlbmpzL3R3ZWVuLmpzXCI7XG5cblxuY2xhc3MgVGhyZWVKU0NvbnRhaW5lciB7XG4gICAgcHJpdmF0ZSBzY2VuZTogVEhSRUUuU2NlbmU7XG4gICAgcHJpdmF0ZSBsaWdodDogVEhSRUUuTGlnaHQ7XG4gICAgcHJpdmF0ZSBsaWdodDE6IFRIUkVFLkxpZ2h0O1xuXG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIH1cblxuICAgIC8vIOeUu+mdoumDqOWIhuOBruS9nOaIkCjooajnpLrjgZnjgovmnqDjgZTjgajjgaspKlxuICAgIHB1YmxpYyBjcmVhdGVSZW5kZXJlckRPTSA9ICh3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlciwgY2FtZXJhUG9zOiBUSFJFRS5WZWN0b3IzKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoKTtcbiAgICAgICAgcmVuZGVyZXIuc2V0U2l6ZSh3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgcmVuZGVyZXIuc2V0Q2xlYXJDb2xvcihuZXcgVEhSRUUuQ29sb3IoMHg0OTVlZCkpO1xuICAgICAgICByZW5kZXJlci5zaGFkb3dNYXAuZW5hYmxlZCA9IHRydWU7IC8v44K344Oj44OJ44Km44Oe44OD44OX44KS5pyJ5Yq544Gr44GZ44KLXG5cbiAgICAgICAgLy/jgqvjg6Hjg6njga7oqK3lrppcbiAgICAgICAgY29uc3QgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKDc1LCB3aWR0aCAvIGhlaWdodCwgMC4xLCAxMDAwKTtcbiAgICAgICAgY2FtZXJhLnBvc2l0aW9uLmNvcHkoY2FtZXJhUG9zKTtcbiAgICAgICAgY2FtZXJhLmxvb2tBdChuZXcgVEhSRUUuVmVjdG9yMygwLCAwLCAwKSk7XG5cbiAgICAgICAgY29uc3Qgb3JiaXRDb250cm9scyA9IG5ldyBPcmJpdENvbnRyb2xzKGNhbWVyYSwgcmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgICAgICAgdGhpcy5jcmVhdGVTY2VuZSgpO1xuICAgICAgICAvLyDmr47jg5Xjg6zjg7zjg6Djga51cGRhdGXjgpLlkbzjgpPjgafvvIxyZW5kZXJcbiAgICAgICAgLy8gcmVxZXN0QW5pbWF0aW9uRnJhbWUg44Gr44KI44KK5qyh44OV44Os44O844Og44KS5ZG844G2XG4gICAgICAgIGNvbnN0IHJlbmRlcjogRnJhbWVSZXF1ZXN0Q2FsbGJhY2sgPSAodGltZSkgPT4ge1xuICAgICAgICAgICAgb3JiaXRDb250cm9scy51cGRhdGUoKTtcblxuICAgICAgICAgICAgcmVuZGVyZXIucmVuZGVyKHRoaXMuc2NlbmUsIGNhbWVyYSk7XG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcbiAgICAgICAgfVxuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUocmVuZGVyKTtcblxuICAgICAgICByZW5kZXJlci5kb21FbGVtZW50LnN0eWxlLmNzc0Zsb2F0ID0gXCJsZWZ0XCI7XG4gICAgICAgIHJlbmRlcmVyLmRvbUVsZW1lbnQuc3R5bGUubWFyZ2luID0gXCIxMHB4XCI7XG4gICAgICAgIHJldHVybiByZW5kZXJlci5kb21FbGVtZW50O1xuICAgIH1cblxuICAgIC8vIOOCt+ODvOODs+OBruS9nOaIkCjlhajkvZPjgacx5ZueKVxuICAgIHByaXZhdGUgY3JlYXRlU2NlbmUgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuc2NlbmUgPSBuZXcgVEhSRUUuU2NlbmUoKTtcblxuICAgICAgICBjb25zdCB3b3JsZCA9IG5ldyBDQU5OT04uV29ybGQoeyBncmF2aXR5OiBuZXcgQ0FOTk9OLlZlYzMoMCwgLTkuODIsIDApIH0pO1xuICAgICAgICB3b3JsZC5kZWZhdWx0Q29udGFjdE1hdGVyaWFsLnJlc3RpdHV0aW9uID0gMC4wO1xuICAgICAgICB3b3JsZC5kZWZhdWx0Q29udGFjdE1hdGVyaWFsLmZyaWN0aW9uID0gMC4wMDtcblxuXG5cbiAgICAgICAgLy8g6aKo6Yi05L2c5oiQXG4gICAgICAgIGxldCBTcGhlcmVTaXplOiBudW1iZXIgPSAxOyAgICAgLy8gU3BoZXJl44Gu44K144Kk44K644KS5rG644KB44KLXG4gICAgICAgIGxldCBhZGRTcGhlcmVHZW9tZXRyeTogVEhSRUUuQnVmZmVyR2VvbWV0cnkgPSBuZXcgVEhSRUUuU3BoZXJlR2VvbWV0cnkoU3BoZXJlU2l6ZSwgMzIsIDE2LCAwLCBNYXRoLlBJICogMiwgMCwgMi4xKTtcbiAgICAgICAgbGV0IFNwaGVyZU1hdGVyaWFsOiBUSFJFRS5NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtcbiAgICAgICAgICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsXG4gICAgICAgICAgICBjb2xvcjogMHhmZmZmZmYsXG4gICAgICAgICAgICBvcGFjaXR5OiAwLjUsIC8vIOmAj+aYjuW6puOCkuioreWumlxuICAgICAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUgLy8g6YCP5piO5bqm44KS5pyJ5Yq544Gr44GZ44KLICAgICAgICBcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBTcGhlcmVNZXNoOiBUSFJFRS5NZXNoID0gbmV3IFRIUkVFLk1lc2goYWRkU3BoZXJlR2VvbWV0cnksIFNwaGVyZU1hdGVyaWFsKTtcbiAgICAgICAgLy8gU3BoZXJl44Kq44OW44K444Kn44Kv44OI44KS56e75YuV44GZ44KLXG4gICAgICAgIFNwaGVyZU1lc2gucG9zaXRpb24ueCA9IDA7XG4gICAgICAgIFNwaGVyZU1lc2gucG9zaXRpb24ueSA9IDU7XG4gICAgICAgIFNwaGVyZU1lc2gucG9zaXRpb24ueiA9IDA7XG5cbiAgICAgICAgdGhpcy5zY2VuZS5hZGQoU3BoZXJlTWVzaCk7XG5cblxuXG4gICAgICAgIC8vIOmiqOmItOOBrue0meS9nOaIkFxuICAgICAgICBjb25zdCBjb2wgPSA1O1xuICAgICAgICBjb25zdCByb3cgPSAxMDtcbiAgICAgICAgY29uc3QgY2xvdGhTaXplID0gMTtcbiAgICAgICAgY29uc3QgZGlzdCA9IGNsb3RoU2l6ZSAvIGNvbDsgLy/jg5Hjg7zjg4bjgqPjgq/jg6vplpPjga7ot53pm6JcbiAgICAgICAgY29uc3Qgc2hhcGUgPSBuZXcgQ0FOTk9OLlBhcnRpY2xlKCk7XG4gICAgICAgIGNvbnN0IHBhcnRpY2xlcyA9IFtdO1xuICAgICAgICAvL+WQhOODkeODvOODhuOCo+OCr+ODq+OBrkNBTk5PTi5Cb2R544KS5L2c5oiQICBcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gY29sOyBpKyspIHtcbiAgICAgICAgICAgIHBhcnRpY2xlcy5wdXNoKFtdKTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDw9IHJvdzsgaisrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcG9zaXRpb25YID0gKGkgLSBjb2wgKiAwLjUpICogZGlzdDtcbiAgICAgICAgICAgICAgICBjb25zdCBwb3NpdGlvblkgPSAoaiAtIHJvdyAqIDAuNSkgKiBkaXN0ICsgMS4xO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uWiA9IDA7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5pdGlhbFBvc2l0aW9uID0gbmV3IENBTk5PTi5WZWMzKHBvc2l0aW9uWCwgcG9zaXRpb25ZLCBwb3NpdGlvblopO1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcnRpY2xlID0gbmV3IENBTk5PTi5Cb2R5KHtcbiAgICAgICAgICAgICAgICAgICAgLy/kuIDnlarkuIrjgpLlm7rlrprjgZfjgabku5bjga7ngrnjgpLoh6rnlLHjgavli5XjgYvjgZnjgZ/jgoFcbiAgICAgICAgICAgICAgICAgICAgLy/nj77lnKjjga7ooYzmlbDjgYznt4/ooYzmlbDjgajnrYnjgZfjgYTloLTlkIjjgIHos6rph4/vvIhtYXNz77yJ44KSMFxuICAgICAgICAgICAgICAgICAgICBtYXNzOiBqID09PSByb3cgPyAwIDogMSxcbiAgICAgICAgICAgICAgICAgICAgc2hhcGUsXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBpbml0aWFsUG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgIC8v44OR44O844OG44Kj44Kv44Or44GM5biD44Gu5LiK56uv44GL44KJ44Gp44KM44Gg44GR6Zui44KM44Gm44GE44KL44GL44KS56S644GX44CB44GT44KM44GrLTAuMeOCkuaOm+OBkeOBpuWIneacn+mAn+W6puOCkuioiOeul1xuICAgICAgICAgICAgICAgICAgICAvL+W4g+OBruS4i+err+OBjOOCiOOCiumAn+OBj+WLleOBjeOAgeS4iuerr+OBjOOBu+OBvOWLleOBi+OBquOBhFxuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eTogbmV3IENBTk5PTi5WZWMzKDAsIDAsIC0wLjEgKiAocm93IC0gaikpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcGFydGljbGVzW2ldLnB1c2gocGFydGljbGUpO1xuICAgICAgICAgICAgICAgIHdvcmxkLmFkZEJvZHkocGFydGljbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8v44OR44O844OG44Kj44Kv44Or44GMZGlzdOOBrui3nembouOCkuS/neOBpOOCiOOBhuOBq+WItue0hOOBmeOCi+OBn+OCgeOBrumWouaVsCAgXG4gICAgICAgIGZ1bmN0aW9uIGNvbm5lY3QoaTEsIGoxLCBpMiwgajIpIHtcbiAgICAgICAgICAgIHdvcmxkLmFkZENvbnN0cmFpbnQobmV3IENBTk5PTi5EaXN0YW5jZUNvbnN0cmFpbnQoXG4gICAgICAgICAgICAgICAgcGFydGljbGVzW2kxXVtqMV0sXG4gICAgICAgICAgICAgICAgcGFydGljbGVzW2kyXVtqMl0sXG4gICAgICAgICAgICAgICAgZGlzdCxcbiAgICAgICAgICAgICkpO1xuICAgICAgICB9XG4gICAgICAgIC8v5ZCE44OR44O844OG44Kj44Kv44Or44GrQ0FOTk9OLkRpc3RhbmNlQ29uc3RyYWludO+8iOWItue0hO+8ieOCkuioreWumiAgXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IGNvbDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8PSByb3c7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChpIDwgY29sKSBjb25uZWN0KGksIGosIGkgKyAxLCBqKTtcbiAgICAgICAgICAgICAgICBpZiAoaiA8IHJvdykgY29ubmVjdChpLCBqLCBpLCBqICsgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjbG90aEdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lR2VvbWV0cnkoMSwgMSwgY29sLCByb3cpO1xuICAgICAgICBjb25zdCBjbG90aE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe1xuICAgICAgICAgICAgY29sb3I6ICcjMDBmZmZmJyxcbiAgICAgICAgICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsXG4gICAgICAgICAgICAvLyAgd2lyZWZyYW1lOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgY29uc3QgY2xvdGhNZXNoID0gbmV3IFRIUkVFLk1lc2goY2xvdGhHZW9tZXRyeSwgY2xvdGhNYXRlcmlhbCk7XG4gICAgICAgIGNsb3RoTWVzaC5wb3NpdGlvbi55ID0gMjtcbiAgICAgICAgY2xvdGhNZXNoLnJvdGF0aW9uLnkgPSAwLjU7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKGNsb3RoTWVzaCk7XG5cblxuICAgICAgICAvLyDpoqjjga7lipvjgpLlrprnvqlcbiAgICAgICAgY29uc3Qgd2luZEZvcmNlID0gbmV3IENBTk5PTi5WZWMzKDAuMSwgMCwgMCk7XG5cblxuICAgICAgICAvLyDmta7jgY3ovKrkvZzmiJBcbiAgICAgICAgbGV0IFRvcnVzR2VvbWV0cnk6IFRIUkVFLkJ1ZmZlckdlb21ldHJ5ID0gbmV3IFRIUkVFLlRvcnVzR2VvbWV0cnkoMC43LCAwLjMsIDE2LCAxMDApO1xuICAgICAgICBsZXQgVG9ydXNNYXRlcmlhbDogVEhSRUUuTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7XG4gICAgICAgICAgICBzaWRlOiBUSFJFRS5Eb3VibGVTaWRlLFxuICAgICAgICAgICAgY29sb3I6IDB4MDBmZmZmLFxuICAgICAgICAgICAgb3BhY2l0eTogMC41LCAvLyDpgI/mmI7luqbjgpLoqK3lrppcbiAgICAgICAgICAgIHRyYW5zcGFyZW50OiB0cnVlIC8vIOmAj+aYjuW6puOCkuacieWKueOBq+OBmeOCiyAgICAgICAgXG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgVG9ydXNNYXRlcmlhbDE6IFRIUkVFLk1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe1xuICAgICAgICAgICAgc2lkZTogVEhSRUUuRG91YmxlU2lkZSxcbiAgICAgICAgICAgIGNvbG9yOiAweGZmMDBmZixcbiAgICAgICAgICAgIG9wYWNpdHk6IDAuNiwgLy8g6YCP5piO5bqm44KS6Kit5a6aXG4gICAgICAgICAgICB0cmFuc3BhcmVudDogdHJ1ZSAvLyDpgI/mmI7luqbjgpLmnInlirnjgavjgZnjgosgICAgICAgIFxuICAgICAgICB9KTtcbiAgICAgICAgbGV0IFRvcnVzTWF0ZXJpYWwyOiBUSFJFRS5NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtcbiAgICAgICAgICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsXG4gICAgICAgICAgICBjb2xvcjogMHhmZmZmMDAsXG4gICAgICAgICAgICBvcGFjaXR5OiAwLjcsIC8vIOmAj+aYjuW6puOCkuioreWumlxuICAgICAgICAgICAgdHJhbnNwYXJlbnQ6IHRydWUgLy8g6YCP5piO5bqm44KS5pyJ5Yq544Gr44GZ44KLICAgICAgICBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgbGV0IFRvcnVzTWVzaDogVEhSRUUuTWVzaFtdID0gW107XG5cbiAgICAgICAgVG9ydXNNZXNoWzBdID0gbmV3IFRIUkVFLk1lc2goVG9ydXNHZW9tZXRyeSwgVG9ydXNNYXRlcmlhbCk7XG4gICAgICAgIFRvcnVzTWVzaFsxXSA9IG5ldyBUSFJFRS5NZXNoKFRvcnVzR2VvbWV0cnksIFRvcnVzTWF0ZXJpYWwxKTtcbiAgICAgICAgVG9ydXNNZXNoWzJdID0gbmV3IFRIUkVFLk1lc2goVG9ydXNHZW9tZXRyeSwgVG9ydXNNYXRlcmlhbDIpO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgICAgICBUb3J1c01lc2hbaV0ucG9zaXRpb24uc2V0KGkgKiAzIC0gMywgMCwgaSAqIDMgKyA1KTtcbiAgICAgICAgICAgIFRvcnVzTWVzaFtpXS5yb3RhdGVYKE1hdGguUEkgLyAyKTtcblxuICAgICAgICAgICAgdGhpcy5zY2VuZS5hZGQoVG9ydXNNZXNoW2ldKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOa1ruOBjei8quOBrueJqeeQhlxuICAgICAgICBjb25zdCBUb3J1c1NoYXBlID0gQ0FOTk9OLlRyaW1lc2guY3JlYXRlVG9ydXMoMC43LCAwLjMsIDE2LCAxMDApO1xuICAgICAgICBjb25zdCBUb3J1c0JvZHk6IENBTk5PTi5Cb2R5W10gPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgVG9ydXNCb2R5W2ldID0gbmV3IENBTk5PTi5Cb2R5KHtcbiAgICAgICAgICAgICAgICBtYXNzOiAwLjVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBUb3J1c0JvZHlbaV0uYWRkU2hhcGUoVG9ydXNTaGFwZSk7XG4gICAgICAgICAgICBUb3J1c0JvZHlbaV0ucG9zaXRpb24uc2V0KFRvcnVzTWVzaFtpXS5wb3NpdGlvbi54LCBUb3J1c01lc2hbaV0ucG9zaXRpb24ueSwgVG9ydXNNZXNoW2ldLnBvc2l0aW9uLnopO1xuICAgICAgICAgICAgVG9ydXNCb2R5W2ldLnF1YXRlcm5pb24uc2V0KFRvcnVzTWVzaFtpXS5xdWF0ZXJuaW9uLngsIFRvcnVzTWVzaFtpXS5xdWF0ZXJuaW9uLnksIFRvcnVzTWVzaFtpXS5xdWF0ZXJuaW9uLnosIFRvcnVzTWVzaFtpXS5xdWF0ZXJuaW9uLncpO1xuXG4gICAgICAgICAgICB3b3JsZC5hZGRCb2R5KFRvcnVzQm9keVtpXSk7XG4gICAgICAgIH1cblxuXG5cbiAgICAgICAgLy8g5Zyw6Z2i5L2c5oiQXG4gICAgICAgIGNvbnN0IHBob25nTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFBob25nTWF0ZXJpYWwoeyBjb2xvcjogMHgwMDU1ZmYgfSk7XG4gICAgICAgIGNvbnN0IHBsYW5lR2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVHZW9tZXRyeSgyNSwgMjUpO1xuICAgICAgICBjb25zdCBwbGFuZU1lc2ggPSBuZXcgVEhSRUUuTWVzaChwbGFuZUdlb21ldHJ5LCBwaG9uZ01hdGVyaWFsKTtcbiAgICAgICAgcGxhbmVNZXNoLm1hdGVyaWFsLnNpZGUgPSBUSFJFRS5Eb3VibGVTaWRlOyAvLyDkuKHpnaJcbiAgICAgICAgcGxhbmVNZXNoLnJvdGF0ZVgoLU1hdGguUEkgLyAyKTtcblxuICAgICAgICB0aGlzLnNjZW5lLmFkZChwbGFuZU1lc2gpO1xuXG4gICAgICAgIGNvbnN0IHBsYW5lU2hhcGUgPSBuZXcgQ0FOTk9OLlBsYW5lKClcbiAgICAgICAgY29uc3QgcGxhbmVCb2R5ID0gbmV3IENBTk5PTi5Cb2R5KHsgbWFzczogMCB9KVxuICAgICAgICBwbGFuZUJvZHkuYWRkU2hhcGUocGxhbmVTaGFwZSlcbiAgICAgICAgcGxhbmVCb2R5LnBvc2l0aW9uLnNldChwbGFuZU1lc2gucG9zaXRpb24ueCwgcGxhbmVNZXNoLnBvc2l0aW9uLnksIHBsYW5lTWVzaC5wb3NpdGlvbi56KTtcbiAgICAgICAgcGxhbmVCb2R5LnF1YXRlcm5pb24uc2V0KHBsYW5lTWVzaC5xdWF0ZXJuaW9uLngsIHBsYW5lTWVzaC5xdWF0ZXJuaW9uLnksIHBsYW5lTWVzaC5xdWF0ZXJuaW9uLnosIHBsYW5lTWVzaC5xdWF0ZXJuaW9uLncpO1xuXG4gICAgICAgIHdvcmxkLmFkZEJvZHkocGxhbmVCb2R5KVxuXG5cblxuICAgICAgICAvLyDlpKrpmb3kvZzmiJBcbiAgICAgICAgbGV0IFN1blNpemU6IG51bWJlciA9IDI7ICAgICAvLyBTcGhlcmXjga7jgrXjgqTjgrrjgpLmsbrjgoHjgotcbiAgICAgICAgbGV0IFN1bkdlb21ldHJ5OiBUSFJFRS5CdWZmZXJHZW9tZXRyeSA9IG5ldyBUSFJFRS5TcGhlcmVHZW9tZXRyeShTdW5TaXplLCAzMiwgMTYsIDAsIE1hdGguUEkgKiAyLCAwKTtcbiAgICAgICAgbGV0IFN1bk1hdGVyaWFsOiBUSFJFRS5NYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtcbiAgICAgICAgICAgIHNpZGU6IFRIUkVFLkRvdWJsZVNpZGUsXG4gICAgICAgICAgICBjb2xvcjogMHhmZjk5MDAsXG4gICAgICAgIH0pO1xuICAgICAgICBsZXQgU3VuTWVzaDogVEhSRUUuTWVzaCA9IG5ldyBUSFJFRS5NZXNoKFN1bkdlb21ldHJ5LCBTdW5NYXRlcmlhbCk7XG4gICAgICAgIC8vIFNwaGVyZeOCquODluOCuOOCp+OCr+ODiOOCkuenu+WLleOBmeOCi1xuICAgICAgICBTdW5NZXNoLnBvc2l0aW9uLnNldCgtOCwgNiwgLTUpO1xuICAgICAgICB0aGlzLnNjZW5lLmFkZChTdW5NZXNoKTtcblxuICAgICAgICAvLyBUd2VlbuOBp+OCs+ODs+ODiOODreODvOODq+OBmeOCi+WkieaVsOOBruWumue+qVxuICAgICAgICBsZXQgdHdlZW5pbmZvID0geyBzY2FsZTogMSB9O1xuICAgICAgICAvLyAgVHdlZW7jgafjg5Hjg6njg6Hjg7zjgr/jga7mm7TmlrDjga7pmpvjgavlkbzjgbPlh7rjgZXjgozjgovplqLmlbBcbiAgICAgICAgbGV0IHVwZGF0ZVNjYWxlID0gKCkgPT4ge1xuICAgICAgICAgICAgU3VuTWVzaC5zY2FsZS54ID0gdHdlZW5pbmZvLnNjYWxlO1xuICAgICAgICB9XG4gICAgICAgIC8vIFR3ZWVu44Gu5L2c5oiQXG4gICAgICAgIGNvbnN0IHR3ZWVuID0gbmV3IFRXRUVOLlR3ZWVuKHR3ZWVuaW5mbykudG8oeyBzY2FsZTogMS4zIH0sIDcwMCkuZWFzaW5nKFRXRUVOLkVhc2luZy5Cb3VuY2UuT3V0KS5vblVwZGF0ZSh1cGRhdGVTY2FsZSk7XG4gICAgICAgIGNvbnN0IHR3ZWVuQmFjayA9IG5ldyBUV0VFTi5Ud2Vlbih0d2VlbmluZm8pLnRvKHsgc2NhbGU6IDEgfSwgMTAwMCkuZGVsYXkoMTAwMCkub25VcGRhdGUodXBkYXRlU2NhbGUpO1xuICAgICAgICB0d2Vlbi5jaGFpbih0d2VlbkJhY2spO1xuICAgICAgICB0d2VlbkJhY2suY2hhaW4odHdlZW4pO1xuICAgICAgICAvLyDjgqLjg4vjg6Hjg7zjgrfjg6fjg7Pjga7plovlp4tcbiAgICAgICAgdHdlZW4uc3RhcnQoKTtcblxuXG4gICAgICAgIC8vIOaXpeW3ruOBl+S9nOaIkFxuICAgICAgICBsZXQgU3VubGlnaHRHZW9tZXRyeTogVEhSRUUuQnVmZmVyR2VvbWV0cnkgPSBuZXcgVEhSRUUuQ3lsaW5kZXJHZW9tZXRyeSgwLjA1LCAwLjMsIDMsIDE2KTtcbiAgICAgICAgbGV0IFN1bmxpZ2h0TWF0ZXJpYWw6IFRIUkVFLk1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe1xuICAgICAgICAgICAgc2lkZTogVEhSRUUuRG91YmxlU2lkZSxcbiAgICAgICAgICAgIGNvbG9yOiAweGZmYWEwMCxcbiAgICAgICAgfSk7XG4gICAgICAgIGxldCBTdW5saWdodE1lc2g6IFRIUkVFLk1lc2hbXSA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgICAgICBTdW5saWdodE1lc2hbaV0gPSBuZXcgVEhSRUUuTWVzaChTdW5saWdodEdlb21ldHJ5LCBTdW5saWdodE1hdGVyaWFsKTtcblxuICAgICAgICAgICAgLy8g44Kq44OW44K444Kn44Kv44OI44KS56e75YuV44GZ44KLXG4gICAgICAgICAgICBTdW5saWdodE1lc2hbaV0ucm90YXRpb24uc2V0KDAsIDAsIE1hdGguUEkgLyA1ICogaSk7XG4gICAgICAgICAgICB0aGlzLnNjZW5lLmFkZChTdW5saWdodE1lc2hbaV0pO1xuICAgICAgICB9XG4gICAgICAgIFN1bmxpZ2h0TWVzaFswXS5wb3NpdGlvbi5zZXQoLTguNSwgMS44LCAtNSk7XG4gICAgICAgIFN1bmxpZ2h0TWVzaFsxXS5wb3NpdGlvbi5zZXQoLTYsIDIuNSwgLTUpO1xuICAgICAgICBTdW5saWdodE1lc2hbMl0ucG9zaXRpb24uc2V0KC00LCA0LjUsIC01KTtcbiAgICAgICAgU3VubGlnaHRNZXNoWzNdLnBvc2l0aW9uLnNldCgtMy41LCA3LCAtNSk7XG5cbiAgICAgICAgLy8gVHdlZW7jgafjgrPjg7Pjg4jjg63jg7zjg6vjgZnjgovlpInmlbDjga7lrprnvqlcbiAgICAgICAgbGV0IFN1bmxpZ2h0VHdlZW5pbmZvID0geyBzY2FsZVg6IDAsIHNjYWxlWTogMCB9O1xuICAgICAgICAvLyAgVHdlZW7jgafjg5Hjg6njg6Hjg7zjgr/jga7mm7TmlrDjga7pmpvjgavlkbzjgbPlh7rjgZXjgozjgovplqLmlbBcbiAgICAgICAgbGV0IHVwZGF0ZUhlaWdodCA9ICgpID0+IHtcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCA0OyBpKyspe1xuICAgICAgICAgICAgICAgIFN1bmxpZ2h0TWVzaFtpXS5zY2FsZS54ID0gU3VubGlnaHRUd2VlbmluZm8uc2NhbGVYO1xuICAgICAgICAgICAgICAgIFN1bmxpZ2h0TWVzaFtpXS5zY2FsZS55ID0gU3VubGlnaHRUd2VlbmluZm8uc2NhbGVZO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFR3ZWVu44Gu5L2c5oiQXG4gICAgICAgIGNvbnN0IFN1bmxpZ2h0VHdlZW4gPSBuZXcgVFdFRU4uVHdlZW4oU3VubGlnaHRUd2VlbmluZm8pLnRvKHsgc2NhbGVYOiAxLjEsIHNjYWxlWTogMS4xIH0sIDI1MCkuZGVsYXkoODAwKS5lYXNpbmcoVFdFRU4uRWFzaW5nLlF1YWRyYXRpYy5PdXQpLm9uVXBkYXRlKHVwZGF0ZUhlaWdodCk7XG4gICAgICAgIGNvbnN0IFN1bmxpZ2h0VHdlZW5CYWNrID0gbmV3IFRXRUVOLlR3ZWVuKFN1bmxpZ2h0VHdlZW5pbmZvKS50byh7IHNjYWxlWDogMCwgc2NhbGVZOiAwIH0sIDUwMCkuZGVsYXkoMTAwMCkub25VcGRhdGUodXBkYXRlSGVpZ2h0KTtcbiAgICAgICAgU3VubGlnaHRUd2Vlbi5jaGFpbihTdW5saWdodFR3ZWVuQmFjayk7XG4gICAgICAgIFN1bmxpZ2h0VHdlZW5CYWNrLmNoYWluKFN1bmxpZ2h0VHdlZW4pO1xuICAgICAgICAvLyDjgqLjg4vjg6Hjg7zjgrfjg6fjg7Pjga7plovlp4tcbiAgICAgICAgU3VubGlnaHRUd2Vlbi5zdGFydCgpO1xuXG5cblxuICAgICAgICAvLyAvLyDjgrDjg6rjg4Pjg4nooajnpLpcbiAgICAgICAgLy8gY29uc3QgZ3JpZEhlbHBlciA9IG5ldyBUSFJFRS5HcmlkSGVscGVyKDEwLCk7XG4gICAgICAgIC8vIHRoaXMuc2NlbmUuYWRkKGdyaWRIZWxwZXIpO1xuXG4gICAgICAgIC8vIC8vIOi7uOihqOekulxuICAgICAgICAvLyBjb25zdCBheGVzSGVscGVyID0gbmV3IFRIUkVFLkF4ZXNIZWxwZXIoNSk7XG4gICAgICAgIC8vIHRoaXMuc2NlbmUuYWRkKGF4ZXNIZWxwZXIpO1xuXG4gICAgICAgIC8v44Op44Kk44OI44Gu6Kit5a6aXG4gICAgICAgIHRoaXMubGlnaHQgPSBuZXcgVEhSRUUuRGlyZWN0aW9uYWxMaWdodCgweGZmZmZmZik7XG4gICAgICAgIGNvbnN0IGx2ZWMgPSBuZXcgVEhSRUUuVmVjdG9yMygxLCAxLCAxKS5ub3JtYWxpemUoKTtcbiAgICAgICAgdGhpcy5saWdodC5wb3NpdGlvbi5zZXQobHZlYy54LCBsdmVjLnksIGx2ZWMueik7XG4gICAgICAgIHRoaXMuc2NlbmUuYWRkKHRoaXMubGlnaHQpO1xuXG4gICAgICAgIHRoaXMubGlnaHQxID0gbmV3IFRIUkVFLkhlbWlzcGhlcmVMaWdodCgweDUwN2ZmZiwgMHhkMGUwNDAsIDAuMyk7XG4gICAgICAgIHRoaXMubGlnaHQxLnBvc2l0aW9uLnNldChsdmVjLngsIGx2ZWMueSwgbHZlYy56KTtcbiAgICAgICAgdGhpcy5zY2VuZS5hZGQodGhpcy5saWdodDEpO1xuXG5cbiAgICAgICAgbGV0IHVwZGF0ZTogRnJhbWVSZXF1ZXN0Q2FsbGJhY2sgPSAodGltZSkgPT4ge1xuXG4gICAgICAgICAgICB3b3JsZC5maXhlZFN0ZXAoKTtcblxuICAgICAgICAgICAgLy8g6aKo6Yi044Gu57SZXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8PSBjb2w7IGkrKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDw9IHJvdzsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vMkTjga7jg5Hjg7zjg4bjgqPjgq/jg6vphY3liJfjgYvjgokxROOBrlBsYW5lR2VvbWV0cnnjga7poILngrnjgbjjga7jg57jg4Pjg5Tjg7PjgrDjgYzlv4XopoFcbiAgICAgICAgICAgICAgICAgICAgLy/jgZ3jga7jgZ/jgoHjgasyROOBrmnjgahq44Gu5L2N572u44KSMUTjga7jgqTjg7Pjg4fjg4Pjgq/jgrnjgavlpInmj5tcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSBqICogKGNvbCArIDEpICsgaTtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgcG9zaXRpb25BdHRyaWJ1dGUgPSBjbG90aEdlb21ldHJ5LmF0dHJpYnV0ZXMucG9zaXRpb247XG4gICAgICAgICAgICAgICAgICAgIC8v44OR44O844OG44Kj44Kv44Or44Gu5L2N572u44Gu5L2N572u44KS5Y+W5b6XXG4gICAgICAgICAgICAgICAgICAgIC8v77yIcm93LWrvvInjgad56Lu45pa55ZCR44Gu6aCG5bqP44KS5Y+N6Lui44GV44Gb44Gm44CBUGxhbmVHZW9tZXRyeeOBrumggueCueOBruS9jee9ruOBq+OBguOCj+OBm+OCi1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHBhcnRpY2xlc1tpXVtyb3cgLSBqXS5wb3NpdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25BdHRyaWJ1dGUuc2V0WFlaKGluZGV4LCBwb3NpdGlvbi54LCBwb3NpdGlvbi55LCBwb3NpdGlvbi56KTtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25BdHRyaWJ1dGUubmVlZHNVcGRhdGUgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlc1tpXVtqXS5hcHBseUZvcmNlKHdpbmRGb3JjZSwgcGFydGljbGVzW2ldW2pdLnBvc2l0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIOa1ruOBjei8qlxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgICAgICBUb3J1c0JvZHlbaV0uYXBwbHlGb3JjZSh3aW5kRm9yY2UsIFRvcnVzQm9keVtpXS5wb3NpdGlvbik7XG4gICAgICAgICAgICAgICAgVG9ydXNCb2R5W2ldLnZlbG9jaXR5LnNldCgwLCAwLCBNYXRoLnJhbmRvbSgpICogLTEgLSAwLjEpO1xuICAgICAgICAgICAgICAgIGlmIChUb3J1c0JvZHlbaV0ucG9zaXRpb24ueiA8IC0xMCkge1xuICAgICAgICAgICAgICAgICAgICBUb3J1c0JvZHlbaV0ucG9zaXRpb24uc2V0KGkgKiAzIC0gMywgMCwgaSAqIDMgKyA1KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgVG9ydXNNZXNoW2ldLnBvc2l0aW9uLnNldChUb3J1c0JvZHlbaV0ucG9zaXRpb24ueCwgVG9ydXNCb2R5W2ldLnBvc2l0aW9uLnksIFRvcnVzQm9keVtpXS5wb3NpdGlvbi56KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8g6aKo44Gu44Kt44O844Oc44O844OJ5pON5L2cXG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChldmVudC5rZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dSaWdodCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WPs+aWueWQkVxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZEZvcmNlLnNldCg1LCAwLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0Fycm93TGVmdCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+W3puaWueWQkVxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZEZvcmNlLnNldCgtNSwgMCwgMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBjYXNlICdBcnJvd0Rvd24nOlxuICAgICAgICAgICAgICAgICAgICAgICAgLy/miYvliY1cbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRGb3JjZS5zZXQoMCwgMCwgNSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dVcCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WlpVxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZEZvcmNlLnNldCgwLCAwLCAtNSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5dXAnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleSkge1xuICAgICAgICAgICAgICAgICAgICBjYXNlICdBcnJvd1JpZ2h0JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5Y+z5pa55ZCRXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kRm9yY2Uuc2V0KDAsIDAsIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dMZWZ0JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5bem5pa55ZCRXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kRm9yY2Uuc2V0KDAsIDAsIDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dEb3duJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8v5omL5YmNXG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kRm9yY2Uuc2V0KDAsIDAsIDUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dVcCc6XG4gICAgICAgICAgICAgICAgICAgICAgICAvL+WlpVxuICAgICAgICAgICAgICAgICAgICAgICAgd2luZEZvcmNlLnNldCgwLCAwLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBUV0VFTi51cGRhdGUoKTtcblxuXG4gICAgICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUodXBkYXRlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh1cGRhdGUpO1xuICAgIH1cblxufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgaW5pdCk7XG5cbmZ1bmN0aW9uIGluaXQoKSB7XG4gICAgbGV0IGNvbnRhaW5lciA9IG5ldyBUaHJlZUpTQ29udGFpbmVyKCk7XG5cbiAgICBsZXQgdmlld3BvcnQgPSBjb250YWluZXIuY3JlYXRlUmVuZGVyZXJET00oNjQwLCA0ODAsIG5ldyBUSFJFRS5WZWN0b3IzKC0zLCAzLCA5KSk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh2aWV3cG9ydCk7XG59XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsInZhciBkZWZlcnJlZCA9IFtdO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5PID0gKHJlc3VsdCwgY2h1bmtJZHMsIGZuLCBwcmlvcml0eSkgPT4ge1xuXHRpZihjaHVua0lkcykge1xuXHRcdHByaW9yaXR5ID0gcHJpb3JpdHkgfHwgMDtcblx0XHRmb3IodmFyIGkgPSBkZWZlcnJlZC5sZW5ndGg7IGkgPiAwICYmIGRlZmVycmVkW2kgLSAxXVsyXSA+IHByaW9yaXR5OyBpLS0pIGRlZmVycmVkW2ldID0gZGVmZXJyZWRbaSAtIDFdO1xuXHRcdGRlZmVycmVkW2ldID0gW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgbm90RnVsZmlsbGVkID0gSW5maW5pdHk7XG5cdGZvciAodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWQubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgW2NodW5rSWRzLCBmbiwgcHJpb3JpdHldID0gZGVmZXJyZWRbaV07XG5cdFx0dmFyIGZ1bGZpbGxlZCA9IHRydWU7XG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCBjaHVua0lkcy5sZW5ndGg7IGorKykge1xuXHRcdFx0aWYgKChwcmlvcml0eSAmIDEgPT09IDAgfHwgbm90RnVsZmlsbGVkID49IHByaW9yaXR5KSAmJiBPYmplY3Qua2V5cyhfX3dlYnBhY2tfcmVxdWlyZV9fLk8pLmV2ZXJ5KChrZXkpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fLk9ba2V5XShjaHVua0lkc1tqXSkpKSkge1xuXHRcdFx0XHRjaHVua0lkcy5zcGxpY2Uoai0tLCAxKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZ1bGZpbGxlZCA9IGZhbHNlO1xuXHRcdFx0XHRpZihwcmlvcml0eSA8IG5vdEZ1bGZpbGxlZCkgbm90RnVsZmlsbGVkID0gcHJpb3JpdHk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmKGZ1bGZpbGxlZCkge1xuXHRcdFx0ZGVmZXJyZWQuc3BsaWNlKGktLSwgMSlcblx0XHRcdHZhciByID0gZm4oKTtcblx0XHRcdGlmIChyICE9PSB1bmRlZmluZWQpIHJlc3VsdCA9IHI7XG5cdFx0fVxuXHR9XG5cdHJldHVybiByZXN1bHQ7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBubyBiYXNlVVJJXG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbl9fd2VicGFja19yZXF1aXJlX18uTy5qID0gKGNodW5rSWQpID0+IChpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gPT09IDApO1xuXG4vLyBpbnN0YWxsIGEgSlNPTlAgY2FsbGJhY2sgZm9yIGNodW5rIGxvYWRpbmdcbnZhciB3ZWJwYWNrSnNvbnBDYWxsYmFjayA9IChwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiwgZGF0YSkgPT4ge1xuXHR2YXIgW2NodW5rSWRzLCBtb3JlTW9kdWxlcywgcnVudGltZV0gPSBkYXRhO1xuXHQvLyBhZGQgXCJtb3JlTW9kdWxlc1wiIHRvIHRoZSBtb2R1bGVzIG9iamVjdCxcblx0Ly8gdGhlbiBmbGFnIGFsbCBcImNodW5rSWRzXCIgYXMgbG9hZGVkIGFuZCBmaXJlIGNhbGxiYWNrXG5cdHZhciBtb2R1bGVJZCwgY2h1bmtJZCwgaSA9IDA7XG5cdGlmKGNodW5rSWRzLnNvbWUoKGlkKSA9PiAoaW5zdGFsbGVkQ2h1bmtzW2lkXSAhPT0gMCkpKSB7XG5cdFx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8obW9yZU1vZHVsZXMsIG1vZHVsZUlkKSkge1xuXHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLm1bbW9kdWxlSWRdID0gbW9yZU1vZHVsZXNbbW9kdWxlSWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRpZihydW50aW1lKSB2YXIgcmVzdWx0ID0gcnVudGltZShfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblx0fVxuXHRpZihwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbikgcGFyZW50Q2h1bmtMb2FkaW5nRnVuY3Rpb24oZGF0YSk7XG5cdGZvcig7aSA8IGNodW5rSWRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0Y2h1bmtJZCA9IGNodW5rSWRzW2ldO1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhpbnN0YWxsZWRDaHVua3MsIGNodW5rSWQpICYmIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSkge1xuXHRcdFx0aW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdWzBdKCk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG5cdH1cblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18uTyhyZXN1bHQpO1xufVxuXG52YXIgY2h1bmtMb2FkaW5nR2xvYmFsID0gc2VsZltcIndlYnBhY2tDaHVua2NncHJlbmRlcmluZ1wiXSA9IHNlbGZbXCJ3ZWJwYWNrQ2h1bmtjZ3ByZW5kZXJpbmdcIl0gfHwgW107XG5jaHVua0xvYWRpbmdHbG9iYWwuZm9yRWFjaCh3ZWJwYWNrSnNvbnBDYWxsYmFjay5iaW5kKG51bGwsIDApKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2suYmluZChudWxsLCBjaHVua0xvYWRpbmdHbG9iYWwucHVzaC5iaW5kKGNodW5rTG9hZGluZ0dsb2JhbCkpOyIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgZGVwZW5kcyBvbiBvdGhlciBsb2FkZWQgY2h1bmtzIGFuZCBleGVjdXRpb24gbmVlZCB0byBiZSBkZWxheWVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18uTyh1bmRlZmluZWQsIFtcInZlbmRvcnMtbm9kZV9tb2R1bGVzX3R3ZWVuanNfdHdlZW5fanNfZGlzdF90d2Vlbl9lc21fanMtbm9kZV9tb2R1bGVzX2Nhbm5vbi1lc19kaXN0X2Nhbm5vbi1lcy0xODAxNjNcIl0sICgpID0+IChfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvYXBwLnRzXCIpKSlcbl9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fLk8oX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=