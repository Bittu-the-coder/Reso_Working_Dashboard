const debugMiddleware = (req, res, next) => {
  console.log("=== Debug Middleware ===");
  console.log("Request method:", req.method);
  console.log("Request URL:", req.url);
  console.log("Content-Type:", req.headers['content-type']);
  console.log("Request body:", req.body);
  console.log("Request file:", req.file);
  console.log("Request files:", req.files);

  // Check if body parsing is working
  if (req.body) {
    console.log("Body keys:", Object.keys(req.body));
    Object.keys(req.body).forEach(key => {
      console.log(`Body[${key}]:`, typeof req.body[key], req.body[key]);
    });
  }

  next();
};

module.exports = debugMiddleware;