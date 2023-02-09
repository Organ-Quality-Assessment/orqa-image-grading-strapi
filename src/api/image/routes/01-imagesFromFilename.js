module.exports = {
    routes: [
      {
        method: "GET",
        path: "/images/imageFromFilename/:filename",
        handler: "image.imageFromFilename"
      }
    ]
  }