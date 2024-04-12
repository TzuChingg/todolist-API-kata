var http = require("http");
var { v4: uuidv4 } = require("uuid");
var { errorNotFound, errorFormat, errorId } = require("./errorHandle.js");
var port = process.env.port || 8080

const todos = [];
const todolistRequest = (req, res) => {
  const headers = {
    "Access-Control-Allow-Headers":
    "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  if (req.url == "/todos" && req.method == "GET") {
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        state: "success",
        data: todos,
      })
    );
    res.end();
  } else if (req.url == "/todos" && req.method == "POST") {
    req.on("end", () => {
      try {
        const title = JSON.parse(body).title;
        if (title !== undefined) {
          const todo = {
            title,
            id: uuidv4(),
          };
          todos.push(todo);
          res.writeHead(201, headers);
          res.write(
            JSON.stringify({
              state: "success",
              data: todos,
            })
          );
          res.end();
        } else {
          errorFormat(res);
        }
      } catch (error) {
        errorFormat(res);
      }
    });
  } else if (req.url == "/todos" && req.method == "DELETE") {
    todos.length = 0;
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        state: "success",
        data: todos,
      })
    );
    res.end();
  } else if (req.url.startsWith("/todos/") && req.method == "DELETE") {
    const id = req.url.split("/").pop();
    const index = todos.findIndex((el) => el.id == id);
    if (index !== -1) {
      todos.splice(index, 1);
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          state: "success",
          data: todos,
        })
      );
      res.end();
    } else {
      errorId(res);
    }
  } else if (req.url.startsWith("/todos/") && req.method == "PATCH") {
    req.on("end", () => {
      try {
        const title = JSON.parse(body).title;
        const id = req.url.split("/").pop();
        const index = todos.findIndex((el) => el.id == id);
        if (title !== undefined && index !== -1) {
          todos[index].title = title;
          res.writeHead(200, headers);
          res.write(
            JSON.stringify({
              state: "success",
              data: todos,
            })
          );
          res.end();
        } else if (title == undefined) {
          errorFormat(res);
        } else {
          errorId(res);
        }
      } catch (error) {
        errorFormat(res);
      }
    });
  } else if (req.method == "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  } else {
    errorNotFound(res);
  }
};

const server = http.createServer(todolistRequest);
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
