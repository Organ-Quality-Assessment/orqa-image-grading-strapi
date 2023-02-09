'use strict';

var _ = require('lodash');


/**
 * image controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::image.image', ({strapi}) => ({
    imagesToGrade: async (ctx, next) => {
        const totalImages = 2
        // get images user wants to grade
        let {organs} = ctx.request.query
        organs = organs.split(',')
        
        // split images into the selected organs - currently fairly crude way of allocating
        const numberOrgans = organs.length
        const numberImagesPerOrgan = []
 

if (totalImages % numberOrgans == 0) {
   // images split evenly across organs
    const imagesPerOrgan = totalImages/numberOrgans
    // populate list
    for (var i=0; i < (numberOrgans); i++) {
        numberImagesPerOrgan.push(imagesPerOrgan)
    }
    
} else {
    // images are not going to split evenly
    var remainder = totalImages%numberOrgans;
    var wholes = Math.floor(totalImages / numberOrgans);
    
    for (var i = 0; i < (numberOrgans); i++) {
        numberImagesPerOrgan.push(wholes)
    }
    
    numberImagesPerOrgan[numberImagesPerOrgan.length-1]= numberImagesPerOrgan[numberImagesPerOrgan.length-1]+remainder
}

// todo ideally shuffle the array

// get number of real images that have the least scores
const images = await strapi.entityService.findMany('api::image.image', {
    filters: {
        real: true
    },
    fields: ['id', 'real', 'filename'],
    populate: { 
        scores: { count: true},
        organ: true
    }
})

// group by organ
const imagesPerOrgan = images.reduce((imagesPerOrgan, item) => {
    const  organ = (imagesPerOrgan[item.organ.organ_type] || []);
  organ.push(item);
  imagesPerOrgan[item.organ.organ_type] = organ;
  return imagesPerOrgan;
}, {})

// within each organ order by number of scores and get number needed
var toReturn = []

for (var i=0; i < organs.length; i++) {
    const numberRequired = numberImagesPerOrgan[i]
    const organ_name = organs[i]

    var imagesForThatOrgan = imagesPerOrgan[organ_name]
    imagesForThatOrgan = _.sortBy(imagesForThatOrgan, [function(o) { return o.scores}])

    const imagesToGrade = imagesForThatOrgan.slice(0, numberRequired)
    console.log(organ_name)
    console.log(numberRequired)
    console.log(imagesToGrade)    

    toReturn.push({
        organ_type: organ_name,
        images: imagesToGrade
    })
}



        return toReturn
    }
}

));
