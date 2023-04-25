const express = require('express');
const cors = require('cors');
const app = express();
// 跨域处理
app.use(cors());
// 处理 POST 请求
app.post('/api/login', (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk.toString();
  });
  
  req.on('end', () => {
    try {
      const data = JSON.parse(body);
      // 输出请求数据
      console.log('请求数据：', data);
      // 返回相同响应
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(400).send('请求格式错误');
    }
  });
});

// 启动服务器
app.listen(3001, () => {
  console.log('服务器已启动，监听端口 3001');
});
