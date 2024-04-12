const headers = {
    "Access-Control-Allow-Headers":
    "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };

  function errorNotFound(res) {
    res.writeHead(404, headers)
    res.write(JSON.stringify({
        state: "false",
        message: "Not Found"
    }))
    res.end()
  }

  function errorFormat(res) {
    res.writeHead(400, headers)
    res.write(JSON.stringify({
        state: "false",
        message: "JSON 欄位、格式錯誤"
    }))
    res.end()
  }
  function errorId(res) {
    res.writeHead(400, headers)
    res.write(JSON.stringify({
        state: "false",
        message: "ID 錯誤"
    }))
    res.end()
  }
  module.exports = {
    errorNotFound,
    errorFormat,
    errorId
  }