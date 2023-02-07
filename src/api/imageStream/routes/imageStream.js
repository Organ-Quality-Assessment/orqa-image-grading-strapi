module.exports = {
  routes: [
    {
     method: 'GET',
     path: '/imageStream',
     handler: 'imageStream.getImage',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
