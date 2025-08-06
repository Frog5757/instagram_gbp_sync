// auth-server.js
const http = require("http");
const url = require("url");

const server = http.createServer((req, res) => {
  const queryObject = url.parse(req.url, true).query;

  if (queryObject.code) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(`
      <html>
      <body style="font-family: Arial; padding: 40px; background: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h1 style="color: #4CAF50;">✅ 認証成功！</h1>
          <p>認証コードを取得しました。</p>
          <div style="background: #f0f0f0; padding: 20px; border-radius: 5px; margin: 20px 0; word-break: break-all;">
            <strong>Code:</strong><br>
            <code style="font-size: 14px; color: #d73502;">
              ${queryObject.code}
            </code>
          </div>
          <p style="color: #666;">このコードは下のターミナルにも表示されています。</p>
        </div>
      </body>
      </html>
    `);
    console.log("\n========================================");
    console.log("✅ 認証コード取得成功！");
    console.log("========================================");
    console.log("Code:", queryObject.code);
    console.log("========================================\n");
  } else {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("認証待機中...");
  }
});

server.listen(8080, () => {
  console.log("🚀 認証サーバーが起動しました\n");
  console.log("ポート: http://localhost:8080\n");
});
