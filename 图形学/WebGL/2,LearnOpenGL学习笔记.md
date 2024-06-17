---
title: LearnOpenGL学习笔记
categories:
  - 学习笔记
tags:
  - LearnOpenGL学习笔记
---

# LearnOpenGL学习笔记

## 图元

- GL_POINTS
- GL_TRIANGLES
- GL_LINE_STRIP

## 顶点着色器
- 顶点着色器主要的目的是把3D坐标转为另一种3D坐标，同时顶点着色器允许我们对顶点属性进行一些基本处理。

## 片段着色器
- 片段着色器的主要目的是计算一个像素的最终颜色
- 通常，片段着色器包含3D场景的数据（比如光照、阴影、光的颜色等等），这些数据可以被用来计算最终像素的颜色

## 图元装配
图元装配将顶点着色器（或几何着色器）输出的顶点作为输入，将所有的点装配成指定图元的形状

## 变量
- uniform：全局变量，所有顶点着色器都可以访问，且值在渲染过程中保持不变。

## 纹理
- GL_REPEAT 对纹理的默认行为。重复纹理图像。
- GL_MIRRORED_REPEAT 和GL_REPEAT一样，但每次重复图片是镜像放置的。
- GL_CLAMP_TO_EDGE 纹理坐标会被约束在0到1之间，超出的部分会重复纹理坐标的边缘，产生一种边缘被拉伸的效果。
- GL_CLAMP_TO_BORDER 超出的坐标为用户指定的边缘颜色

## 纹理过滤
- GL_NEAREST 采用最近邻插值法，即最近的像素颜色值，是OpenGL默认的纹理过滤方式
- GL_LINEAR 采用双线性插值法，即根据相邻的4个像素颜色值计算出中间值，可以使得图像更加平滑。

## 多级渐远纹理(Mipmap)
- GL_NEAREST_MIPMAP_NEAREST 使用最邻近的多级渐远纹理来匹配像素大小，并使用邻近插值进行纹理采样
- GL_LINEAR_MIPMAP_NEAREST 使用最邻近的多级渐远纹理级别，并使用线性插值进行采样
- GL_NEAREST_MIPMAP_LINEAR 在两个最匹配像素大小的多级渐远纹理之间进行线性插值，使用邻近插值进行采样
- GL_LINEAR_MIPMAP_LINEAR 在两个邻近的多级渐远纹理之间使用线性插值，并使用线性插值进行采样 

多级渐远纹理主要是使用在纹理被缩小的情况下的

## 坐标系统
- 局部空间
- 世界空间
- 观察空间
- 裁剪空间
- 屏幕空间

## 光照

### 冯氏光照模型
- 环境光照
- 漫反射光照
- 镜面光照


### 光的属性
- 光强度
- 颜色

### 投光物
- 平行光
- 点光源： 
  - 点光源的衰减：常数项，线性项，二次项
- 聚光灯：点光源加个罩子，手电筒
  - 平滑处理：我们需要模拟聚光有一个内圆锥(Inner Cone)和一个外圆锥(Outer Cone)。我们可以将内圆锥设置为上一部分中的那个圆锥，但我们也需要一个外圆锥，来让光从内圆锥逐渐减暗，直到外圆锥的边界。

### 材质
- 环境光颜色
- 漫反射颜色
- 镜面颜色
- 反射率
```glsl
void main()
{    
    // 环境光
    vec3 ambient = lightColor * material.ambient;

    // 漫反射 
    vec3 norm = normalize(Normal);
    vec3 lightDir = normalize(lightPos - FragPos);
    float diff = max(dot(norm, lightDir), 0.0);
    vec3 diffuse = lightColor * (diff * material.diffuse);

    // 镜面光
    vec3 viewDir = normalize(viewPos - FragPos);
    vec3 reflectDir = reflect(-lightDir, norm);  
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), material.shininess);
    vec3 specular = lightColor * (spec * material.specular);  

    vec3 result = ambient + diffuse + specular;
    FragColor = vec4(result, 1.0);
}
```

### 光照贴图
在着色器中使用漫反射贴图的方法和纹理教程中是完全一样的

- 漫反射贴图（Diffuse Map）
- 镜面光贴图（Specular Map）

## 深度测试
用于确定像素在场景中的可见性

深度测试函数
- GL_LESS 像素的深度值小于深度缓冲区的深度值时，通过测试
- GL_LEQUAL 像素的深度值小于或等于深度缓冲区的深度值时，通过测试
- GL_GREATER 像素的深度值大于深度缓冲区的深度值时，通过测试
- GL_GEQUAL 像素的深度值大于或等于深度缓冲区的深度值时，通过测试
- GL_EQUAL 像素的深度值等于深度缓冲区的深度值时，通过测试
- GL_NOTEQUAL 像素的深度值不等于深度缓冲区的深度值时，通过测试
- GL_ALWAYS 总是通过测试
- GL_NEVER 总是不通过测试

## 模板测试
模板测试用于判断像素是否在模板缓冲区中

轮廓






