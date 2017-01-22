# App Framework

希望提供一个简单的方式来构建可视化的程序。
启动流程由 v-framework 控制，只需要编写窗口的 layout 文件和对应的 packages 就可以构建出自己的 App。

## 使用

### 安装 
```javascript
npm install v-framework
```

### 查看测试以及简单的示例
进入 v-framework 目录
```javascript
cd ./node_modules/v-framework
```
启动测试
```javascript
npm test
```

## 搭建自己的应用程序
```javascript
const App = require('v-framework');
App.start({
    packages: [Path.join(__dirname, 'packages')],
    window: {
        layout: Path.join(__dirname, './layout/default.json'),
        width: 800,
        height: 600
    }
});
App.on('ready', function () {
    console.log('App is ready.');
});
```