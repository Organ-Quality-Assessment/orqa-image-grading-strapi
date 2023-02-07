module.exports = {
  routes: [
    {
     method: 'GET',
     path: '/gradingimages',
     handler: 'gradingimages.gradingImages',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
