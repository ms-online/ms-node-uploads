// 引入模块
const express = require('express');
const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

// 初始化app
const app = express();

// 设置磁盘存储引擎
const storage = multer.diskStorage({
    destination:function(req, file, cb){
        cb(null, './public/uploads/');
    },
    filename:function(req,file,cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})

// 初始化upload
const upload = multer({
    storage:storage,
    fileFilter:function(req, file, cb){
        checkFileType(file, cb);
    },
    limits:{fileSize:1000000}
}).single('myImage');


// 验证文件类型
function checkFileType(file, cb){
    // 允许的文件扩展名格式
    const filetypes = /jpeg|jpg|png|gif/;
    // 验证扩展名
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // 验证MIME
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    }else{
        cb('错误：只支持图片格式！')
    }
}
// EJS
app.set('view engine', 'ejs');

// 创建public文件夹
app.use(express.static('./public'));

// 渲染index页面
app.get('/',(req,res) => res.render('index'));

// 捕获post
app.post('/upload', (req,res) => {
    // res.send('test');
    upload(req, res, (err) => {
        if(err){
            res.render('index', {
                msg:err
            });
        }else{
            // console.log(req.file)
            // res.send('test');
            if(req.file === undefined){
                res.render('index',{
                    msg:'错误：请选择上传文件！'
                })
            }else{
                res.render('index',{
                    msg:'文件已上传成功！',
                    file:`uploads/${req.file.filename}`
                })
            }
        }
    })
})

// 定义端口
const port = 4000;
app.listen(port, ()=> console.log(`服务器运行端口为${port}`));