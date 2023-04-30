# Syntactic Parsing Playground

## 关于本项目

语法分析是编译器将高级语言翻译成 CPU 指令过程中的重要一环，自顶向下的分析法 `LL(1)`，自底向上的分析方法 `LR(0)`，`LR(1)`，`SLR` 和 `LALR`，则是语法分析的常用方法。

本项目允许您在线地输入符合要求的文法，一键生成并可视化文法对应的 `LR` 自动机、`LL` 分析器及其分析表，同时允许您输入文本、利用自动机进行语法分析、展示此过程中每一步的分析格局。

本项目仍处于开发阶段，您可以通过下表查看各分析器的开发状态。

| 文法类型 |  状态  |
| :------: | :----: |
|  `LR0`   |  可用  |
|  `SLR`   | 计划中 |
|  `LR1`   | 计划中 |
|  `LALR`  | 计划中 |
|   `LL`   | 计划中 |

## 使用方法

+ 在线访问：
  
  本项目已部署，您可以通过 [Github Page](https://blog.vonbrank.com/syntactic-parsing-playground/) 和 Gitee Page 访问。

+ 本地运行：

  您也可以直接 `clone` 源码然后在本地编译运行，具体步骤为：

  + 安装 Node.js

  + 在项目文件夹安装依赖项（只需要装一次）：

    ```bash
    npm install
    # 或者（如果你装了 yarn）
    yarn install
    ```

  + 运行项目：

    ```bash
    npm run dev
    # 或者
    yarn dev
    ```

  + 根据终端提示访问对应 URL 。
