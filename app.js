const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
const port = 3030;


// 设置静态资源目录
app.use(express.static('public'));

// 读取 public/images 文件夹中的所有图片
app.get('/images', (req, res) => {
    const imagesDir = path.join(__dirname, 'public/images');
    
    fs.readdir(imagesDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to load images' });
        }
        
        // 过滤出图片文件，通常的图片扩展名可以是 jpg, png, gif 等
        const imageFiles = files.filter(file => file.match(/\.(jpg|jpeg|png|gif)$/i));
        res.json(imageFiles);
    });
});

// 主页
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// 定义你想打开的 URL
const url = `http://localhost:${port}/`;

// 根据操作系统选择命令
const startBrowserOnLinux = `xdg-open ${url}`;
const startBrowserOnWindows = `start ${url}`;
const startBrowserOnMac = `open ${url}`;

let command;

// 检测平台
switch (process.platform) {
    case 'darwin': // macOS
        command = startBrowserOnMac;
        break;
    case 'win32': // Windows
        command = startBrowserOnWindows;
        break;
    case 'linux': // Linux
        command = startBrowserOnLinux;
        break;
    default:
        console.log('Unsupported platform:', process.platform);
        process.exit(1);
}


exec(command, (err) => {
    if (err) {
        console.error('Error opening browser:', err);
    } else {
        console.log('Browser opened successfully.');
    }
});
