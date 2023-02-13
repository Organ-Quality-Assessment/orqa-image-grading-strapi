module.exports = {
    routes: [
      {
        method: "GET",
        path: "/images/imageFromFilename/:dir/:filename",
        handler: "image.imageFromFilename"
      }
    ]
  }