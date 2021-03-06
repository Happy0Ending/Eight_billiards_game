/// <reference path = "4.2/babylon.d.ts"/>
/// <reference path = "4.2/babylon.gui.d.ts"/>
/// <reference path = "4.2/babylon.gui.module.d.ts"/>
/// <reference path = "4.2/babylon.inspector.d.ts"/>
/// <reference path = "4.2/babylon.module.d.ts"/>
/// <reference path = "4.2/babylonjs.materials.d.ts"/>
/// <reference path = "4.2/babylonjs.materials.module.d.ts"/>


function createWorld() {
  let hitPointX = 0;
  let hitPointY = 0;
  let hitNumber = 0;
  //===================================js效果===============================================
  const canvas = document.getElementById("myCanvas");
  const engine = new BABYLON.Engine(canvas, true);
  //创建工程
  //创建场景
  const createScene = () => {
    const scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.UniversalCamera(
      "camera",
      new BABYLON.Vector3(0, 10, 0),
      scene
    );
    //=================================================相机和灯光=======================================
    camera.attachControl(true);
    camera.target = new BABYLON.Vector3(0, -0.1, +0.1);
    camera.speed = 0.16;
    var light = new BABYLON.HemisphericLight(
      "dir01",
      new BABYLON.Vector3(0, 20, 0),
      scene
    );
    light.position = new BABYLON.Vector3(0, 40, 0);
    light.intensity = 0.8;
    //=================================================天空盒子=================================================
    {
      var skybox = BABYLON.MeshBuilder.CreateBox(
        "skyBox",
        { size: 400.0 },
        scene
      );
      var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
      skyboxMaterial.backFaceCulling = false;
      skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(
        "../Img/skybox",
        scene
      );
      skyboxMaterial.reflectionTexture.coordinatesMode =
        BABYLON.Texture.SKYBOX_MODE;
      skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
      skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
      skybox.material = skyboxMaterial;
    }
    // =================================================设置重力和碰撞检测================================================
    //引入物理引擎
    scene.enablePhysics(
      new BABYLON.Vector3(0, -9.81, 0),
      new BABYLON.CannonJSPlugin()
    );
    // scene.getPhysicsEngine().setSubTimeStep(5);
    let result = scene.pick(scene.pointerX, scene.pointerY);
    let tableEdgeShorter1 = BABYLON.MeshBuilder.CreateBox('tableEdgeShorter1', { width: 5.3, height: .6, depth: .2 }, scene);
    tableEdgeShorter1.position.y = .2;
    tableEdgeShorter1.position.z = 5;
    // tableEdgeShorter1.isPickable = false;
    let tableEdgeShorter2 = tableEdgeShorter1.clone('tableEdgeShorter2');
    tableEdgeShorter2.position.z = -5;
    // 落袋检测 圆柱体
    let holeChecks = [];
    let holeCheckImposters = [];

    let holeCheck1 = BABYLON.MeshBuilder.CreateCylinder('', { height: 1, diameter: .5 }, scene);
    holeCheck1.position = new BABYLON.Vector3(-3, 0, 5);
    holeChecks.push(holeCheck1);

    holeCheck1.physicsImpostor = new BABYLON.PhysicsImpostor(
      holeCheck1, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 0, friction: 0, restitution: 0 }, scene);

    let holeCheck2 = holeCheck1.clone('');
    holeCheck2.position = new BABYLON.Vector3(-3, 0, -5);
    holeChecks.push(holeCheck2);
    let holeCheck3 = holeCheck1.clone('');
    holeCheck3.position = new BABYLON.Vector3(3, 0, -5);
    holeChecks.push(holeCheck3);
    let holeCheck4 = holeCheck1.clone('');
    holeCheck4.position = new BABYLON.Vector3(3, 0, 5);
    holeChecks.push(holeCheck4);

    let holeCheck5 = BABYLON.MeshBuilder.CreateCylinder('', { height: 1, diameter: .3 }, scene);
    holeCheck5.position = new BABYLON.Vector3(3, 0, 0);
    holeChecks.push(holeCheck5);

    let a = BABYLON.MeshBuilder.CreateBox('', { width: .3, height: 1, depth: 1 }, scene);
    a.position = new BABYLON.Vector3(3, 0, 0);
    a.physicsImpostor = new BABYLON.PhysicsImpostor(
      a, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0, restitution: 0 }, scene);
    let b = a.clone('');
    b.position = new BABYLON.Vector3(-3, 0, 0);


    holeCheck5.physicsImpostor = new BABYLON.PhysicsImpostor(
      holeCheck5, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 0, friction: 0, restitution: 0 }, scene);

    let holeCheck6 = holeCheck5.clone('');
    holeCheck6.position = new BABYLON.Vector3(-3, 0, 0);
    holeChecks.push(holeCheck6);

    // 台球桌边缘  长边
    let tableRight = BABYLON.MeshBuilder.CreateBox('tableRight', { width: .2, height: .6, depth: 9.3 }, scene);
    tableRight.position.y = .2;
    tableRight.position.x = 3;
    // tableRight.isPickable = false;
    let tableLeft = tableRight.clone('tableLeft');
    tableLeft.position.x = -3;

    let table = createTableFace(.45);
    table.position.y = -.5;
    // console.log(table.position);
    let tableMat = new BABYLON.StandardMaterial('tableMat', scene);
    tableMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
    tableMat.alpha = .35;
    table.material = tableMat;
    table.physicsImpostor = new BABYLON.PhysicsImpostor(
      table, BABYLON.PhysicsImpostor.MeshImpostor, { mass: 0, friction: 0, restitution: 0 }, scene);
    tableEdgeShorter1.physicsImpostor = new BABYLON.PhysicsImpostor(
      tableEdgeShorter1, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0, restitution: 1 }, scene);

    tableEdgeShorter2.physicsImpostor = new BABYLON.PhysicsImpostor(
      tableEdgeShorter2, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0, restitution: 1 }, scene);

    tableRight.physicsImpostor = new BABYLON.PhysicsImpostor(
      tableRight, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0, restitution: 1 }, scene);

    tableLeft.physicsImpostor = new BABYLON.PhysicsImpostor(
      tableLeft, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0, restitution: 1 }, scene);


    //-----------------------------------------------模型--------------------------------------------------------------------------
    sphereDiameter = 0.3;
    const ground = new BABYLON.MeshBuilder.CreateBox(
      "ground",
      { width: 4, depth: 8, height: sphereDiameter },
      scene
    );
    let groundMat = new BABYLON.StandardMaterial("");
    groundMat.diffuseColor = new BABYLON.Vector3(0, 1, 0);
    groundMat.alpha = 0.5;
    ground.material = groundMat;
    ground.position.y = -2;

    const sphere = new BABYLON.MeshBuilder.CreateSphere(
      "sphere",
      { diameter: sphereDiameter },
      scene
    );
    //const sphere = new BABYLON.MeshBuilder.CreateBox("white", { width:0.3,depth:0.3,height:0.3}, scene);
    sphere.isPickable = false;
    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(
      sphere,
      BABYLON.PhysicsImpostor.SphereImpostor,
      { mass: 0.145, friction: 0, restitution: 1 },
      scene
    );
    let spheres = [];
    let ballsImpostors = []
    sphere.diameter = 0.3;
    sphere.physicsImpostor.registerOnPhysicsCollide([a.physicsImpostor, b.physicsImpostor], (a, b) => {
      sphere.physicsImpostor.setLinearVelocity(new BABYLON.Vector3.Zero());
    })

    let ballImpostor = createBalls(sphere, ballsImpostors, spheres, scene);

    for (let i = 0; i < 15; i++) {
      ballImpostor[i].registerOnPhysicsCollide([a.physicsImpostor, b.physicsImpostor], (a, b) => {
        ballImpostor[i].setLinearVelocity(new BABYLON.Vector3.Zero());
      })
    }
    /*  b.physicsImpostor.registerOnPhysicsCollide(ballImpostor, (sIm, bIm) => {
     }) */
    sphere.physicsImpostor.segments = 512;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(
      ground,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, restitution: 0, friction: 0 },
      scene
    );
    let boxMat = new BABYLON.StandardMaterial("");
    boxMat.alpha = 0.5;
    boxMat.diffuseColor = new BABYLON.Vector3(255 / 255, 228 / 255, 181 / 255);

    let box2 = new BABYLON.MeshBuilder.CreateBox(
      "boxLeft",
      { width: 6, depth: 10, height: 0.4 },
      scene
    );
    box2.position.y = -2.8;
    box2.physicsImpostor = new BABYLON.PhysicsImpostor(
      box2,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0, restitution: 0 },
      scene
    );
    box2.material = boxMat;
    let box3 = new BABYLON.MeshBuilder.CreateBox(
      "boxLeft",
      { width: 1, depth: 12, height: 1 },
      scene
    );
    box3.position.x = -3.5;
    box3.position.y = -2;
    box3.physicsImpostor = new BABYLON.PhysicsImpostor(
      box3,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0, restitution: 0 },
      scene
    );
    box3.material = boxMat;
    let box4 = new BABYLON.MeshBuilder.CreateBox(
      "boxLeft",
      { width: 1, depth: 12, height: 1 },
      scene
    );
    box4.position.x = 3.5;
    box4.position.y = -2;
    box4.physicsImpostor = new BABYLON.PhysicsImpostor(
      box4,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0, restitution: 0 },
      scene
    );
    box4.material = boxMat;
    let box5 = new BABYLON.MeshBuilder.CreateBox(
      "boxLeft",
      { width: 6, depth: 1, height: 1 },
      scene
    );
    box5.position.z = 5.5;
    box5.position.y = -2;
    box5.physicsImpostor = new BABYLON.PhysicsImpostor(
      box5,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0, restitution: 0 },
      scene
    );
    box5.material = boxMat;
    let box6 = new BABYLON.MeshBuilder.CreateBox(
      "boxLeft",
      { width: 6, depth: 1, height: 1 },
      scene
    );
    box6.position.z = -5.5;
    box6.position.y = -2;
    box6.physicsImpostor = new BABYLON.PhysicsImpostor(
      box6,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0, restitution: 0 },
      scene
    );
    box6.material = boxMat;
    const box1 = new BABYLON.MeshBuilder.CreateBox("box1", scene);
    box1.position.x = 13;
    const sphere2 = new BABYLON.MeshBuilder.CreateSphere("box1213", scene);
    sphere2.position.z = 5;
    const cone = new BABYLON.MeshBuilder.CreateCylinder(
      "cone",
      { diameter: 0.1 },
      scene
    );


    let coneSecondMat = new BABYLON.StandardMaterial();
    coneSecondMat.alpha = 0.6;

    const boxLeft = new BABYLON.MeshBuilder.CreateBox(
      "boxLeft",
      { width: 1, depth: 3, height: 0.4 },
      scene
    );
    const boxLeft1 = new BABYLON.MeshBuilder.CreateBox(
      "boxLeft1",
      { width: 1, depth: 3, height: 0.4 },
      scene
    );
    const boxRight = new BABYLON.MeshBuilder.CreateBox(
      "boxRighrt",
      { width: 1, depth: 3, height: 0.4 },
      scene
    );
    const boxRight1 = new BABYLON.MeshBuilder.CreateBox(
      "boxRighrt1",
      { width: 1, depth: 3, height: 0.4 },
      scene
    );
    const boxTop = new BABYLON.MeshBuilder.CreateBox(
      "boxTop",
      { width: 3.5, depth: 1, height: 0.4 },
      scene
    );
    const boxBottom = new BABYLON.MeshBuilder.CreateBox(
      "boxBottom",
      { width: 3.5, depth: 1, height: 0.4 },
      scene
    );
    // /-------------------------------------------------------------------------------------------------------------------------------
    posBox(boxRight, boxRight1, boxLeft1, boxLeft, boxTop, boxBottom);
    boxLeft.physicsImpostor = new BABYLON.PhysicsImpostor(
      boxLeft,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0, restitution: 1 },
      scene
    );
    boxLeft1.physicsImpostor = new BABYLON.PhysicsImpostor(
      boxLeft1,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0, restitution: 1 },
      scene
    );
    boxRight.physicsImpostor = new BABYLON.PhysicsImpostor(
      boxRight,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0, restitution: 1 },
      scene
    );
    boxRight1.physicsImpostor = new BABYLON.PhysicsImpostor(
      boxRight1,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0, restitution: 1 },
      scene
    );
    boxBottom.physicsImpostor = new BABYLON.PhysicsImpostor(
      boxBottom,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0, restitution: 1 },
      scene
    );
    boxTop.physicsImpostor = new BABYLON.PhysicsImpostor(
      boxTop,
      BABYLON.PhysicsImpostor.BoxImpostor,
      { mass: 0, friction: 0, restitution: 1 },
      scene
    );
    cone.rotation.x = Math.PI / 2;
    //----------------------------------------------------------------------render内部的变量声明-----------------------------------------
    let winner;
    let directionF = null;
    let score = 0;
    let iscoll = 0;
    let isWin = 0;
    let isScale = 0;
    let lineGo = null;
    let lineC = null;
    let lines = null;
    let timeDown = 0;
    let timeUp = 0;
    let timeAll = 0;
    let Fdirection;
    let FV3;
    let myPoint11 = [
      new BABYLON.Vector3(0, 0, -0),
      new BABYLON.Vector3(0, 0, 0.01)
    ];
    let myPoint22 = [
      new BABYLON.Vector3(0, 0, -0),
      new BABYLON.Vector3(0, 0, 0.01)
    ];
    let myPoint33 = [
      new BABYLON.Vector3(0, 0, -0),
      new BABYLON.Vector3(0, 0, 0.01)
    ];
    let pathline1 = new BABYLON.MeshBuilder.CreateLines("path1", { points: myPoint11, updatable: true, scene });
    pathline1.isVisible = false;
    let pathline2 = new BABYLON.MeshBuilder.CreateLines("path1", { points: myPoint22, updatable: true, scene });
    pathline2.isVisible = false;
    let pathline3 = new BABYLON.MeshBuilder.CreateLines("path1", { points: myPoint33, updatable: true, scene });
    let spheresNumber = 0;
    let myPoints = [];

    //-----------------------------------------------------------------
    window.onload = function () {
      const rotateDiv = document.getElementById("rotateDiv");
      let buttons = document.getElementById("click");
      let pos = document.getElementById("pos");
      buttons.onclick = function () {
        rotateDiv.style.display =
          rotateDiv.style.display == "none" ? "block" : "none";
      };
      rotateDiv.onclick = function (evt) {
        hitPointX = evt.offsetX - 100;
        hitPointY = 100 - evt.offsetY;
        pos.style.top = evt.offsetY + "px";
        pos.style.left = evt.offsetX + "px";
      };
      let returnPosition = document.getElementById("return");
      returnPosition.addEventListener("click", function () {
        sphere.position.x = 0;
        sphere.position.z = -3;
        sphere.position.y = 1;
        sphere.physicsImpostor.setLinearVelocity(new BABYLON.Vector3.Zero());
        sphere.physicsImpostor.setAngularVelocity(
          new BABYLON.Quaternion(0, 0, 0, 0)
        );
      });
      scoreNumber = document.getElementById("scoreNumber");
      let returnHit = document.getElementById("returnHit");

      returnHit.onclick = () => {
        hitPointX = 0;
        hitPointY = 0;
        pos.style.top = 100 + "px";
        pos.style.left = 100 + "px"
      }
    };
    let temp = score;
    let spheresImpostor = [];
    let forceDirection = 0;
    let kDirection = 1;
    //------------------------------------------------------------------------------------------------------------------------------------------------
    document.onkeyup = function (evt) {
      var result = scene.pick(scene.pointerX, scene.pointerY);
      switch (evt.key) {
        case " ":
          //console.log(spheres)
          if (spheresNumber < 30) {
            spheres[spheresNumber] = new BABYLON.MeshBuilder.CreateSphere(
              "sphere",
              { diameter: sphereDiameter },
              scene
            );
            spheres[spheresNumber].position.x = result.pickedPoint.x;
            spheres[spheresNumber].position.z = result.pickedPoint.z;
            spheresMat = new BABYLON.StandardMaterial("");
            spheresMat.diffuseColor = new BABYLON.Color3(
              Math.random(0, 1),
              Math.random(0, 1),
              Math.random(0, 1)
            );
            spheres[spheresNumber].material = spheresMat;
            spheres[spheresNumber].physicsImpostor = new BABYLON.PhysicsImpostor(
              spheres[spheresNumber],
              BABYLON.PhysicsImpostor.SphereImpostor,
              { mass: 0.145, restitution: 1, friction: 0.0 },
              scene
            );
            spheresImpostor.push(spheres[spheresNumber].physicsImpostor);
            spheresNumber++;
          }
      }
    };
    let whiteSp = new BABYLON.MeshBuilder.CreateSphere(
      "sw",
      { diameter: sphereDiameter },
      scene
    );
    let whiteMat = new BABYLON.StandardMaterial();
    whiteMat.alpha = 0.8;
    whiteSp.material = whiteMat;
    scene.onPointerDown = function () {
      //========================重置区================================================================
      {
        iscoll = 0;
        isWin = 0;
        isScale = 0;
      }
      //===================================================================================================== 
      lDirection1 = new BABYLON.Vector3.Normalize(lineGo.direction);
      lDirection2 = new BABYLON.Vector3.Normalize(lineC.direction);
      timeDown = Date.now();
      //单独反射线
      scene.onPointerUp = function () {
        let result = scene.pick(scene.pointerX, scene.pointerY);
        hitNumber += 1;
        console.log(hitNumber);
        FV3 = BABYLON.Vector3.Normalize(result.pickedPoint.subtract(cone.position))
        Fdirection = cone.rotation.y;
        directionF = -Fdirection;


        setTimeout(() => {

        }, 5000);
        // sphere.physicsImpostor.mass = 0.145;
        setTimeout(() => {
          cone.isVisible = false;
        }, 200);
        setTimeout(() => {
          cone.isVisible = true;
        }, 10000);
        timeUp = Date.now();
        timeAll =
          timeUp - timeDown < 3000 && timeUp - timeDown > 1000
            ? timeUp - timeDown
            : timeUp - timeDown > 3000
              ? 4500
              : 1500;
        if (hitPointX != 0 || hitPointY) {
          timeAll = 2500;
        }
        forceDirection = new BABYLON.Vector3(
          timeAll * 0.004 * Math.sin(Fdirection),
          0,
          timeAll * 0.004 * Math.cos(Fdirection)
        );
        kDirection = (timeAll * 0.004 * Math.sin(Fdirection) ** 2 + timeAll * 0.004 * Math.cos(Fdirection) ** 2) ** 0.5;
        sphere.physicsImpostor.setLinearVelocity(forceDirection);

        scene.onAfterRenderObservable.add(function () {
          //console.log(sphere.position.z / sphere.position.x);
          sphere.physicsImpostor.physicsBody.linearDamping = 0.35;
          for (let i = 0; i < spheres.length; i++) {
            spheres[i].physicsImpostor.physicsBody.linearDamping = 0.35;
          }
          if (hitPointX != 0 || hitPointY != 0) {
            sphere.physicsImpostor.friction = 0.1;
          }

          //sphere.physicsImpostor.physicsBody.linearDamping = 0.8;
        });
      };
    };
    let wV4 = new BABYLON.Vector3(0, 0, 0, 0);
    for (let balla of ballImpostor) {
      balla.sleep();
    }
    sphere.physicsImpostor.registerOnPhysicsCollide(ballImpostor, (white, target) => {
      let collV = white.getLinearVelocity();
      kDirection = (collV.x ** 2 + collV.z ** 2) ** 0.5;
      //let lv = white.getLinearVelocity();
      if (iscoll == 0) {
        iscoll = 1;
        if (hitPointX == 0 && hitPointY == 0) {
          let wv = white.getLinearVelocity();
          let tha = (wv.x * lDirection1.x + wv.z * lDirection1.z) / ((wv.x ** 2 + wv.z ** 2) * (lDirection1.x ** 2 + lDirection1.z ** 2)) ** .5;
          let thb = Math.acos(tha);
          // console.log(kDirection)
          target.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
          //target.setLinearVelocity(lDirection1.scale(20));
          target.setLinearVelocity(lDirection1.scale(kDirection));
          //white.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
          white.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
          white.setLinearVelocity(lDirection2.scale(kDirection * Math.tan(thb)));
        }
        if (hitPointX != 0 || hitPointY != 0) {
          wV4 = new BABYLON.Vector3(FV3.x, FV3.y, FV3.z).scale(kDirection *
            hitPointY / 100).add(lDirection2.scale(kDirection * -hitPointX / 100));
          target.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
          target.setLinearVelocity(lDirection1.scale(kDirection));
          white.setLinearVelocity(new BABYLON.Vector3(0, 0, 0));
          white.setLinearVelocity(wV4);
        }
      }

    });


    let sBox = new BABYLON.MeshBuilder.CreateBox(
      "sbox",
      { width: 0.5, depth: 0.5, height: 0.5 },
      scene
    );
    sBox.isPickable = false;
    sBox.isVisible = false;
    scene.onBeforeRenderObservable.add(() => {
      // ==============================场景跟随属性=====================================
      {
        sBox.position.x = sphere.position.x;
        sBox.position.y = sphere.position.y;
        sBox.position.z = sphere.position.z;
        var result = scene.pick(scene.pointerX, scene.pointerY);
        diffX = result.pickedPoint.x - sphere.position.x;
        diffZ = result.pickedPoint.z - sphere.position.z;
        var angle = Math.atan2(diffX, diffZ);
        cone.position.x = sphere.position.x - 1.5 * Math.sin(angle);
        cone.position.z = sphere.position.z - 1.5 * Math.cos(angle);
        cone.position.y = sphere.position.y;
        cone.rotation.y = angle;
        sBox.rotation.y = angle;
        (myPoints[0] = new BABYLON.Vector3(
          sphere.position.x,
          sphere.position.y,
          sphere.position.z
        )),
          (myPoints[1] = new BABYLON.Vector3(
            result.pickedPoint.x,
            sphere.position.y,
            result.pickedPoint.z
          )),
          (lines = BABYLON.MeshBuilder.CreateDashedLines("lines", {
            points: myPoints,
            dashSize: 10,
            updatable: true,
            instance: lines,
          }));
      }
      //-----------------------------------相切圆----------------------------------------------------------------
      let sWhitePos = castRay(sBox);
      if (sWhitePos != null) {
        let result = scene.pick(scene.pointerX, scene.pointerY);
        let k =
          (result.pickedPoint.z - sphere.position.z) /
          (result.pickedPoint.x - sphere.position.x);
        let b = result.pickedPoint.z - k * result.pickedPoint.x;
        let d =
          (k * sWhitePos.position.x - sWhitePos.position.z + b) /
          Math.sqrt(k * k + 1);
        if (Math.abs(d) <= sphereDiameter) {
          whiteSp.isVisible = true;
          pathline1.isVisible = true;
          pathline2.isVisible = true;
          whiteSp.isPickable = false;
          if (
            result.pickedPoint.x > sphere.position.x &&
            result.pickedPoint.z > sphere.position.z
          ) {
            if (d < 0) {
              let kLimit =
                (sWhitePos.position.z - sphereDiameter - sphere.position.z) /
                (sWhitePos.position.x - sphere.position.x);

              if (k < kLimit) {
                let tha = Math.PI / 2 + Math.atan(-1 / k);
                let thb = Math.acos(Math.abs(d) / sphereDiameter);
                let thc = tha - thb;
                whiteSp.position.z =
                  sWhitePos.position.z - sphereDiameter * Math.cos(thc);
                whiteSp.position.x =
                  sWhitePos.position.x + sphereDiameter * Math.sin(thc);
                whiteSp.position.y = sphere.position.y;
              } else {
                let tha = Math.PI / 2 + Math.atan(-1 / k);
                let thb = Math.acos(Math.abs(d) / sphereDiameter);
                let thc = thb - tha;
                whiteSp.position.z =
                  sWhitePos.position.z - sphereDiameter * Math.cos(thc);
                whiteSp.position.x =
                  sWhitePos.position.x - sphereDiameter * Math.sin(thc);
                whiteSp.position.y = sphere.position.y;
              }
            }
            if (d > 0) {
              let kLimit =
                (sWhitePos.position.z - sphere.position.z) /
                (sWhitePos.position.x - sphereDiameter - sphere.position.x);
              if (k > kLimit) {
                let tha = -Math.atan(-1 / k);
                let thb = Math.acos(Math.abs(d) / sphereDiameter);
                let thc = tha - thb;

                whiteSp.position.z =
                  sWhitePos.position.z + sphereDiameter * Math.sin(thc);
                whiteSp.position.x =
                  sWhitePos.position.x - sphereDiameter * Math.cos(thc);
                whiteSp.position.y = sphere.position.y;
              } else {
                let tha = Math.asin(Math.abs(d) / sphereDiameter);
                let thb = Math.atan(k);
                let thc = thb - tha;
                whiteSp.position.z =
                  sWhitePos.position.z - sphereDiameter * Math.sin(thc);
                whiteSp.position.x =
                  sWhitePos.position.x - sphereDiameter * Math.cos(thc);
                whiteSp.position.y = sphere.position.y;
              }
            }
          }
          if (
            result.pickedPoint.x < sphere.position.x &&
            result.pickedPoint.z > sphere.position.z
          ) {
            if (d <= 0) {
              let kLimit =
                (sWhitePos.position.z - sphereDiameter - sphere.position.z) /
                (sWhitePos.position.x - sphere.position.x);
              if (k < kLimit) {
                let tha = Math.PI / 2 - Math.atan(-1 / k);
                let thb = Math.acos(-d / sphereDiameter);
                let thc = thb - tha;
                whiteSp.position.z =
                  sWhitePos.position.z - sphereDiameter * Math.cos(thc);
                whiteSp.position.x =
                  sWhitePos.position.x + sphereDiameter * Math.sin(thc);
                whiteSp.position.y = sphere.position.y;
              } else {
                let tha = Math.PI / 2 - Math.atan(-1 / k);
                let thb = Math.acos(-d / sphereDiameter);
                let thc = tha - thb;
                whiteSp.position.z =
                  sWhitePos.position.z - sphereDiameter * Math.cos(thc);
                whiteSp.position.x =
                  sWhitePos.position.x - sphereDiameter * Math.sin(thc);
                whiteSp.position.y = sphere.position.y;
              }
            }
            if (d > 0) {
              let kLimit =
                (sWhitePos.position.z - sphere.position.z) /
                (sWhitePos.position.x - sphereDiameter - sphere.position.x);
              if (k > kLimit) {
                let tha = Math.atan(-1 / k);
                let thb = Math.acos(d / sphereDiameter);
                let thc = thb - tha;
                whiteSp.position.z =
                  sWhitePos.position.z - sphereDiameter * Math.sin(thc);
                whiteSp.position.x =
                  sWhitePos.position.x + sphereDiameter * Math.cos(thc);
                whiteSp.position.y = sphere.position.y;
              } else {
                let tha = Math.atan(-1 / k);
                let thb = Math.acos(Math.abs(d) / sphereDiameter);
                let thc = tha - thb;
                whiteSp.position.z =
                  sWhitePos.position.z + sphereDiameter * Math.sin(thc);
                whiteSp.position.x =
                  sWhitePos.position.x + sphereDiameter * Math.cos(thc);
                whiteSp.position.y = sphere.position.y;
              }
            }
          }
          if (
            result.pickedPoint.x < sphere.position.x &&
            result.pickedPoint.z < sphere.position.z
          ) {
            if (d >= 0) {
              let tha = Math.PI / 2 - Math.atan(k);
              let thb = tha - Math.asin(d / sphereDiameter);
              whiteSp.position.z =
                sWhitePos.position.z + sphereDiameter * Math.cos(thb);
              whiteSp.position.x =
                sWhitePos.position.x + sphereDiameter * Math.sin(thb);
              whiteSp.position.y = sphere.position.y;
            }
            if (d < 0) {
              let tha = Math.PI - Math.atan(-1 / k);
              let thb = Math.acos(d / sphereDiameter);
              let thc = tha + thb;
              whiteSp.position.z =
                sWhitePos.position.z - sphereDiameter * Math.sin(thc);
              whiteSp.position.x =
                sWhitePos.position.x + sphereDiameter * Math.cos(thc);
              whiteSp.position.y = sphere.position.y;
            }
          }
          if (
            result.pickedPoint.x > sphere.position.x &&
            result.pickedPoint.z < sphere.position.z
          ) {
            if (d < 0) {
              let jx = sWhitePos.position.z - b / k;
              let kLimit =
                (sWhitePos.position.z - sphere.position.z) /
                (jx - sphere.position.x);
              if (k >= kLimit) {
                let tha = Math.PI / 2 - Math.atan(-1 / k);
                let thb = Math.acos(-d / sphereDiameter);
                let thc = tha - thb;
                whiteSp.position.z =
                  sWhitePos.position.z + sphereDiameter * Math.sin(thc);
                whiteSp.position.x =
                  sWhitePos.position.x - sphereDiameter * Math.cos(thc);
                whiteSp.position.y = sphere.position.y;
              }
              if (k < kLimit) {
                let tha = Math.atan(-1 / k);
                let thb = Math.acos(-d / sphereDiameter);
                let thc = thb - tha;
                whiteSp.position.z =
                  sWhitePos.position.z + sphereDiameter * Math.sin(thc);
                whiteSp.position.x =
                  sWhitePos.position.x - sphereDiameter * Math.cos(thc);
                whiteSp.position.y = sphere.position.y;
              }
            }
            if (d > 0) {
              let kLimit =
                (sWhitePos.position.z + sphereDiameter - sphere.position.z) /
                (sWhitePos.position.x - sphere.position.x);
              if (k < kLimit) {
                let tha = Math.PI - Math.atan(-1 / k);
                let thb = Math.acos(Math.abs(d) / sphereDiameter);
                let thc = tha - thb;
                whiteSp.position.z =
                  sWhitePos.position.z + sphereDiameter * Math.sin(thc);
                whiteSp.position.x =
                  sWhitePos.position.x - sphereDiameter * Math.cos(thc);
                whiteSp.position.y = sphere.position.y;
              } else {
                let tha = Math.PI / 2 - Math.atan(-1 / k);
                let thb = Math.acos(Math.abs(d) / sphereDiameter);
                let thc = tha - thb;
                whiteSp.position.z =
                  sWhitePos.position.z + sphereDiameter * Math.cos(thc);
                whiteSp.position.x =
                  sWhitePos.position.x + sphereDiameter * Math.sin(thc);
                whiteSp.position.y = sphere.position.y;
              }
            }
          }
        }
        //---------------------------------------------------------lineGo--------------------------------
        lineGo = lineGoto(whiteSp, sWhitePos, scene, tableLeft, myPoint11);
        pathline1 = BABYLON.MeshBuilder.CreateLines('line1', { points: myPoint11, updatable: true, instance: pathline1 }, scene);
        if (scene.multiPickWithRay(lineGo)) {
          let hit = scene.multiPickWithRay(lineGo);
          for (let i = 0; i < hit.length; i++) {
            if (hit[i].pickedMesh == tableLeft || hit[i].pickedMesh == tableRight) {
              if (hit.length < 3) {
                linet = linetwice(whiteSp, sWhitePos, hit[i].pickedPoint);
                lineGoDispose(linet, scene, whiteSp);
              } 
            }
            if (hit[i].pickedMesh == tableEdgeShorter1 || hit[i].pickedMesh == tableEdgeShorter2) {
              if (hit.length < 3) {
                linet = lineTop(whiteSp, sWhitePos, hit[i].pickedPoint);
                lineGoDispose(linet, scene, whiteSp);
              }
            }
          }
        }
        //lineGoDispose(lineGo, scene, whiteSp);
        //lineC = lineCome(whiteSp, sWhitePos);
        lineC = lineComes(whiteSp, sWhitePos, sphere, pathline2, myPoint22);
        //lineGoDispose(lineC, scene, whiteSp);
      } else {
        whiteSp.isVisible = false;
        myPoint11 = [
          new BABYLON.Vector3(0, 0, 0),
          new BABYLON.Vector3(0, 0, 0)
        ]
        myPoint22 = [
          new BABYLON.Vector3(0, 0, 0),
          new BABYLON.Vector3(0, 0, 0)
        ]
        pathline1.isVisible = false;
        pathline2.isVisible = false;
      }
      //--------------------------------------------------得分-----------------------------------------------------------------
      if (spheres.length == 15) {
        if (spheres[7].position.y < -2 && isWin == 0) {
          let win7 = Win7(spheres);
          let win14 = Win14(spheres);
          isWin = 1;
          if (win7 == 7) {
            if (sphere.position.y < -2) {
              console.log(11)
              winner = "Player2";

              window.location.reload();
            } else {
              console.log(22)
              winner = "Player1";
              window.location.reload();
            }
          }
          if (win14 == 7) {
            if (sphere.position.y < -2) {
              console.log(33)
              winner = "Player1";
              window.location.reload();
            } else {
              console.log(44)
              winner = "Player2";
              window.location.reload();
            }
          }
          if (hitNumber % 2 > 0) {
            if (win7 < 7) {
              console.log(55)
              winner = "Player2";
              window.location.reload();
            }
          } else {
            if (win14 < 7) {
              console.log(66)
              winner = "Player1";
              window.location.reload();
            }
          }
          alert(winner + " is win!!!");
        }
      }
      if (spheres.length > 0) {
        for (let i = 0; i < spheres.length; i++) {
          sphere.num = Math.abs(spheres[i].physicsImpostor.getLinearVelocity().x) < 0.01 &&
            spheres[i].physicsImpostor.getLinearVelocity().z < 0.01 ?
            1 : 0;
        }
      }
      if (sphere.num == 1) {
        score = calculationScore(sphere, spheres, temp);
        sphere.num = 2;
        scoreNumber.innerHTML = "得分：" + score;
      }
      //------------------------------------------------------------------------------------------------------------------------
    });
    //-------------------------------------------------返回----------------------------------------------------------------------
    return scene;
  };
  function createBalls(proBall, ballsImpostors, balls, scene) {
    console.log("zhixing")
    for (let number = 0; number < 15; number++) {
      let clonedBall = proBall.clone('sphere');
      clonedBall.isPickable = true;
      //console.log(balls)
      let clonedBallMat = new BABYLON.StandardMaterial('clonedBallMat', scene);
      clonedBallMat.diffuseColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
      clonedBall.material = clonedBallMat;
      // clonedBall.material.alpha=.1;
      clonedBall.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0, 0, 0))
      clonedBall.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(0, 0, 0))
      ballsImpostors.push(clonedBall.physicsImpostor);
      balls.push(clonedBall);
    }

    let p = -proBall.diameter - proBall.diameter * 2;
    let p1 = -proBall.diameter - proBall.diameter / 2 * 3;
    let p2 = -proBall.diameter - proBall.diameter;
    let p3 = -proBall.diameter - proBall.diameter / 2;
    let p4 = -proBall.diameter;

    for (let i = 0; i < 15; i++) {
      if (i < 5) {
        balls[i].position = new BABYLON.Vector3(p += proBall.diameter, .3, 3);
      } else if (i < 9) {
        balls[i].position = new BABYLON.Vector3(p1 += proBall.diameter, .3, 3 - proBall.diameter * .9);
      } else if (i < 12) {
        balls[i].position = new BABYLON.Vector3(p2 += proBall.diameter, .3, 3 - proBall.diameter * 1.8);
      } else if (i < 14) {
        balls[i].position = new BABYLON.Vector3(p3 += proBall.diameter, .3, 3 - proBall.diameter * 2.7);
      } else {
        balls[i].position = new BABYLON.Vector3(p4 += proBall.diameter, .3, 3 - proBall.diameter * 3.6);
      }
    }
    return ballsImpostors;
  }
  function createTableFace(radius, scene) {
    let edgeTop = [];
    let edgeBottom = [];
    let capLeft = [];
    let capRight = [];
    let r = Math.sin(Math.PI / 4) * radius * 2;

    edgeTop.push(new BABYLON.Vector3(0, 0, 5));

    let hole1 = createHoleXZ(270, 360, new BABYLON.Vector3(-3, 0, 5), r);
    edgeTop = edgeTop.concat(hole1);
    capLeft = capLeft.concat(hole1);

    let hole5 = createHoleXZ(0, 90, new BABYLON.Vector3(-3, 0, 0), radius);
    edgeTop = edgeTop.concat(hole5);
    capLeft = capLeft.concat(hole5);
    let hole51 = createHoleXZ(270, 360, new BABYLON.Vector3(-3, 0, 0), radius);
    edgeTop = edgeTop.concat(hole51);
    capLeft = capLeft.concat(hole51);

    let hole2 = createHoleXZ(0, 90, new BABYLON.Vector3(-3, 0, -5), r);
    edgeTop = edgeTop.concat(hole2);
    capLeft = capLeft.concat(hole2);

    let hole3 = createHoleXZ(90, 180, new BABYLON.Vector3(3, 0, -5), r);
    edgeTop = edgeTop.concat(hole3);
    capRight = capRight.concat(hole3);

    let hole6 = createHoleXZ(180, 270, new BABYLON.Vector3(3, 0, 0), radius);
    edgeTop = edgeTop.concat(hole6);
    capRight = capRight.concat(hole6);
    let hole61 = createHoleXZ(90, 180, new BABYLON.Vector3(3, 0, 0), radius);
    edgeTop = edgeTop.concat(hole61);
    capRight = capRight.concat(hole61);

    let hole4 = createHoleXZ(180, 270, new BABYLON.Vector3(3, 0, 5), r);
    edgeTop = edgeTop.concat(hole4);
    capRight = capRight.concat(hole4);

    for (const path of edgeTop) {
      edgeBottom.push(new BABYLON.Vector3(path.x, path.y + .5, path.z));
    }

    let edge = BABYLON.MeshBuilder.CreateRibbon('edge', {
      pathArray: [edgeTop, edgeBottom],
      closeArray: false,
      closePath: true,
      sideOrientation: 2
    }, scene);

    let cap = BABYLON.MeshBuilder.CreateRibbon('cap', {
      pathArray: [capLeft, capRight.reverse()],
      closeArray: false,
      closePath: false,
      sideOrientation: 2
    }, scene);

    let cap2 = cap.clone('cap2');
    cap2.position.y = .5;

    return BABYLON.Mesh.MergeMeshes([edge, cap, cap2], true, true);
  }
  function createHoleXZ(start, end, center, radius) {
    let holeXZ = [];

    for (let angle = start; angle <= end; angle += 22.5) {
      let x = Math.cos(Math.PI / 180 * angle) * radius + center.x;
      let z = Math.sin(Math.PI / 180 * angle) * radius + center.z;

      let xz = new BABYLON.Vector3(x, 0, z);
      holeXZ.push(xz);
    }

    holeXZ.reverse();

    return holeXZ;
  }
  function Win7(spheres) {
    let win7 = 0;
    for (let i = 0; i < 7; i++) {
      if (spheres[i].position.y < -2) {
        win7 += 1;
      }
    }
    return win7;
  }
  function Win14(spheres) {
    let win14 = 0;
    for (let i = 8; i < 15; i++) {
      if (spheres[i].position.y < -2) {
        win14 += 1;
      }
    }
    return win14;
  }
  function calculationScore(sphere, spheres, score) {
    if (sphere.position.y < -2) {
      score -= 5;
    }
    if (spheres.length > 0) {
      for (let i = 0; i < spheres.length; i++) {
        if (spheres[i].position.y < -2) {
          score += i + 1;
        }
      }
    }
    return score;
  }
  function RayCast(box) {
    box.isPickable = false;
    //let aimboxPosition;
    let ray = new BABYLON.Ray(box.absolutePosition, box.forward, 1500);
    var hit = scene.pickWithRay(ray);
    return hit;
  }
  function castRay(box) {

    box.isPickable = false;
    //let aimboxPosition;
    let result = scene.pick(scene.pointerX, scene.pointerY);
    let angle = Math.atan(
      (result.pickedPoint.z - box.position.z) /
      (result.pickedPoint.x - box.position.x)
    );
    let leftPosition = new BABYLON.Vector3(
      box.absolutePosition.x - 0.15 * Math.sin(angle),
      box.absolutePosition.y,
      box.absolutePosition.z + 0.15 * Math.cos(angle)
    );
    let rightPosition = new BABYLON.Vector3(
      box.absolutePosition.x + 0.15 * Math.sin(angle),
      box.absolutePosition.y,
      box.absolutePosition.z - 0.15 * Math.cos(angle)
    );
    let ray = new BABYLON.Ray(box.absolutePosition, box.forward, 1500);
    let rayLeft = new BABYLON.Ray(leftPosition, box.forward, 1500);
    let rayRight = new BABYLON.Ray(rightPosition, box.forward, 1500);
    var hit = scene.pickWithRay(ray);
    var hit1 = scene.pickWithRay(rayLeft);
    var hit2 = scene.pickWithRay(rayRight);
    let mesh = null;

    if (hit.pickedMesh && hit1.pickedMesh && hit2.pickedMesh) {
      let dC = hit.distance;
      let dL = hit1.distance;
      let dR = hit2.distance;

      // 判断最短距离并返回距离最短的射线信息
      let minD = Math.min(dC, dL, dR);
      // 若距离相等 则默认返回中心射线
      let aimRayInfo = dC == minD ? hit : dL == minD ? hit1 : hit2;
      if (aimRayInfo.pickedMesh.name == "sphere") {
        mesh = aimRayInfo.pickedMesh;
      }
      //console.log(mesh)
    }
    return mesh;
  }
  let lineGoto = (sphere, box, scene, tableLeft, myPoint11) => {
    let direction = box.position.subtract(sphere.position);
    let ray = new BABYLON.Ray(box.absolutePosition, direction, 20);
    let hit = scene.multiPickWithRay(ray);
    for (let i = 0; i < hit.length; i++) {
      if (hit[i].pickedMesh != sphere && hit[i].pickedMesh != box) {
        myPoint11[1] = hit[i].pickedPoint;
      }
    }
    myPoint11[0] = sphere.position;
    return ray;
  };
  let linetwice = (sphere, box, rayPoint) => {
    let direction = box.position.subtract(sphere.position);
    let newDirection = new BABYLON.Vector3(
      -direction.x,
      0,
      direction.z
    );
    let ray2 = new BABYLON.Ray(rayPoint, newDirection, 20);
    return ray2;
  }
  let lineTop = (sphere, box, rayPoint) => {
    let direction = box.position.subtract(sphere.position);
    let newDirection = new BABYLON.Vector3(
      direction.x,
      0,
      -direction.z
    );
    let ray2 = new BABYLON.Ray(rayPoint, newDirection, 20);
    return ray2;
  }

  let lineComes = (sphereXu, sphereTarget, sphere, linepath2, myPoint22) => {
    let newDirection = new BABYLON.Vector3(0, 0, 10);
    let direction = BABYLON.Vector3.Normalize(
      sphereTarget.position.subtract(sphereXu.position)
    );
    let directionT = BABYLON.Vector3.Normalize(
      sphereTarget.position.subtract(sphere.position)
    );
    let mouseDirection = BABYLON.Vector3.Normalize(
      sphereXu.position.subtract(sphere.position)
    );
    let k = directionT.z / directionT.x;
    let d = (k * mouseDirection.x - mouseDirection.z) / (k ** 2 + 1) ** 0.5;

    if (directionT.x > 0 && directionT.z > 0) {
      let m = d > 0 ? 1 : -1;
      newDirection = new BABYLON.Vector3(direction.z, 0, -direction.x).scale(m);
    }
    if (directionT.x < 0 && directionT.z > 0) {
      let m = d > 0 ? 1 : -1;
      newDirection = new BABYLON.Vector3(direction.z, 0, -direction.x).scale(
        -m
      );
    }
    if (directionT.x < 0 && directionT.z < 0) {
      let m = d > 0 ? 1 : -1;
      newDirection = new BABYLON.Vector3(direction.z, 0, -direction.x).scale(
        -m
      );
    }
    if (directionT.x > 0 && directionT.z < 0) {
      let m = d > 0 ? 1 : -1;
      newDirection = new BABYLON.Vector3(direction.z, 0, -direction.x).scale(m);
    }
    let ray = new BABYLON.Ray(sphereXu.absolutePosition, newDirection, 5);
    myPoint22[0] = sphereXu.position;
    myPoint22[1] = sphereXu.position.add(newDirection);
    linepath2 = BABYLON.MeshBuilder.CreateLines('line22', { points: myPoint22, updatable: true, instance: linepath2 })
    return ray;

  };
  let lineCome = (sphere, box) => {
    let result = scene.pick(scene.pointerX, scene.pointerY);
    let newDirection = new BABYLON.Vector3(0, 0, 10);
    let direction = box.position.subtract(sphere.position);
    let mouseDirection = result.pickedPoint.subtract(sphere.position);
    let m =
      (mouseDirection.x ** 2 + mouseDirection.y ** 2 + mouseDirection.z ** 2) **
      0.5;
    let n = (direction.x ** 2 + direction.y ** 2 + direction.z ** 2) ** 0.5;
    if (mouseDirection.x / m > 0 && mouseDirection.z / m > 0) {
      let k = mouseDirection.x / m > direction.x / n ? 1 : -1;
      newDirection = new BABYLON.Vector3(
        direction.z,
        direction.y,
        -direction.x
      ).scale(k);
    }
    if (mouseDirection.x / m < 0 && mouseDirection.z / m > 0) {
      let k = mouseDirection.x / m > direction.x / n ? 1 : -1;
      newDirection = new BABYLON.Vector3(
        direction.z,
        direction.y,
        -direction.x
      ).scale(k);
    }
    if (mouseDirection.x / m < 0 && mouseDirection.z / m < 0) {
      let k = mouseDirection.x / m > direction.x / n ? 1 : -1;
      newDirection = new BABYLON.Vector3(
        direction.z,
        direction.y,
        -direction.x
      ).scale(-k);
    }
    if (mouseDirection.x / m > 0 && mouseDirection.z / m < 0) {
      let k = mouseDirection.x / m > direction.x / n ? 1 : -1;
      newDirection = new BABYLON.Vector3(
        direction.z,
        direction.y,
        -direction.x
      ).scale(-k);
    }
    let ray = new BABYLON.Ray(sphere.absolutePosition, newDirection, 10);
    return ray;
  };
  let lineGoDispose = (ray, scene, sphere) => {
    if (sphere.isVisible == true) {
      let RayHelper = new BABYLON.RayHelper(ray);

      RayHelper.show(scene);
      setTimeout(() => {
        RayHelper.hide();
      }, 10);
    }

  };
  const buildGround = (width, height, a, b, c) => {
    const groundMat = new BABYLON.StandardMaterial("groundMat");
    groundMat.diffuseColor = new BABYLON.Color3(a, b, c);
    groundMat.alpha = 0.5;
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {
      width: width,
      height: height,
    });
    ground.material = groundMat;
    ground.checkCollisions = true;
    return ground;
  };
  const CreateMusic = (scene, path) => {
    const music = new BABYLON.Sound("cello", path, scene, null, {
      loop: true,
      autoplay: true,
    });
    return music;
  };
  const posBox = (
    boxRight,
    boxRight1,
    boxLeft1,
    boxLeft,
    boxTop,
    boxBottom
  ) => {
    boxRight.position.x = -2.5;
    boxRight.position.z = 1.7;
    boxRight1.position.x = -2.5;
    boxRight1.position.z = -1.9;
    boxLeft.position.x = 2.5;
    boxLeft.position.z = 1.7;
    boxLeft1.position.x = 2.5;
    boxLeft1.position.z = -1.9;
    boxTop.position.z = 4.5;
    boxTop.position.y = -1.9;
    boxBottom.position.y = -1.9;
    boxRight.position.y = -1.9;
    boxRight1.position.y = -1.9;
    boxLeft.position.y = -1.9;
    boxLeft1.position.y = -1.9;
    boxBottom.position.z = -4.5;
  };
  //反复渲染
  const scene = createScene();
  engine.runRenderLoop(() => {
    scene.render();
  });
  window.addEventListener("resize", () => {
    engine.resize();
  });
}
