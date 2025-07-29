# Threejs 学习

## 基础概念

### 图元

其实就是geometry，threejs里内置了多种图元，包括BoxGeometry、CircleGeometry。

### 材质
材质是应用于 3D 对象表面的属性集合，决定了该对象如何与光线交互，最终影响对象在渲染时的外观和表现。

材质可以实例化的时候传参数，也可以实例化后，通过属性赋值的方式传参数。

### 纹理

同过TextureLoader加载纹理，创建材质，传入纹理，然后通过材质和图元生成mesh。

#### 纹理加载
```js
const loader = new THREE.TextureLoader();
loader.load('resources/images/wall.jpg', (texture) => {
  const material = new THREE.MeshBasicMaterial({
    map: texture,
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  cubes.push(cube);  // 添加到我们要旋转的立方体数组中
});
```

- 等待多个纹理加载完毕

创建LoadingManager传入TextureLoader。使用其onLoad属性。

```js

const loadManager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(loadManager);
const materials = [
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-1.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-2.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-3.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-4.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-5.jpg')}),
  new THREE.MeshBasicMaterial({map: loader.load('resources/images/flower-6.jpg')}),
];
loadManager.onLoad = () => {
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);
    cubes.push(cube);  // 添加到我们要旋转的立方体数组中
};

```

LoadingManager 还有个onProgress用来指示进度。

纹理文件大小小=下载速度快。尺寸小（分辨率）=占用的内存少。

### 纹理过滤

#### mipmap（多级过滤）
Mipmap 是一种纹理的渐进式降采样技术。

Mipmap 层级的结构：
- L0（L0：Level 0）：原始纹理。
- L1（L1：Level 1）：原始纹理的一半尺寸（例如，512x512）。
- L2（L2：Level 2）：原始纹理的四分之一尺寸（例如，256x256）。
- L3（L3：Level 3）：继续递减……

![img.png](img.png)

### 重复，偏移，旋转

#### 重复

默认情况下，three.js中的纹理是不重复的。要设置纹理是否重复，有2个属性，wrapS 用于水平包裹，wrapT 用于垂直包裹
- ClampToEdgeWrapping： 每条边上的最后一个像素无限重复
- RepeatWrapping： 纹理重复
- MirroredRepeatWrapping： 在每次重复时将进行镜像

重复是用[repeat]重复属性设置的
```js
const timesToRepeatHorizontally = 4;
const timesToRepeatVertically = 2;
someTexture.repeat.set(timesToRepeatHorizontally, timesToRepeatVertically);
```

#### 偏移

设置纹理的offset属性，单位是一个纹理大小。

#### 旋转

旋转通过设置rotaion属性，单位是弧度。

## 光照

- 环境光：new THREE.AmbientLight(color, intensity);
  - 参数：光的颜色，光的强度
  - 没有方向，无法产生阴影，场景内所有地方受到的强度是相同的。
- 半球光（HemisphereLight）： 颜色是从天空到地面两个颜色之间的渐变，与物体材质的颜色作叠加后得到最终的颜色效果
  - 参数： 光的颜色，天空颜色，地面颜色。
- 方向光，平行光（DirectionalLight）
  - 构造参数：光颜色，光强度
  - 可以设置position和target
- 点光源
  - 构造参数：光颜色，光强度， distance
  - 设置position属性， distance属性、
  - distance：可以用构造函数设置，也可以属性赋值，默认值是0，表示可以照射无限远。设置为1，表示光只能照到离光源一个单位的地方
  - decay ：表示光线随距离的衰减量。默认值是2，表示是2次方衰减
- 聚光灯
  - `SpotLight( color : Color, intensity : Float, distance : Float, angle : Radians, penumbra : Float, decay : Float )`
  - color： 光颜色
  - intensity：光强
  - distance： 光源照射的最大距离，默认0，表示无限远
  - angle：光线照射范围的角度，默认值π/3
  - penumbra: 控制光束的边缘过渡区域， 1表示光照强度从中轴线就开始往外递减，为 0 时，内圆锥大小与外圆锥大小一致
    - 表示的是阴影模糊区域所占的百分比，0表示没有阴影区域，1，表示充中轴线开始就是阴影区域，就开始衰减。
  - decay： 光线随距离的衰减量，默认2。
- 矩形区域光（RectAreaLight）
  - 只能影响 MeshStandardMaterial 和 MeshPhysicalMaterial

## 摄像机
- 透视摄像机 PerspectiveCamera
  - 参数： fov（摄像机视锥体垂直视野角度），aspect(摄像机视锥体长宽比)，near(摄像机视锥体近端面)，far（摄像机视锥体远端面）
- 正交摄像机 OrthographicCamera
  - 参数left, right, top, bottom, near, far

## 阴影

使用阴影贴图

## 雾
```js

const scene = new THREE.Scene();
{
  const color = 0xFFFFFF;  // white
  const near = 10;
  const far = 100;
  scene.fog = new THREE.Fog(color, near, far);
}

// FogExp2
const scene = new THREE.Scene();
{
  const color = 0xFFFFFF;
  const density = 0.1;
  scene.fog = new THREE.FogExp2(color, density);
}

```










