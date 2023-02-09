'use strict';

var _ = require('lodash');
var axios = require('axios')



/**
 * image controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::image.image', ({strapi}) => ({
    realAndArtificalImages: async (ctx, next) => {
        const totalImages = 2

        //divide into mix of real and artifical
        const numberReal = Math.floor(Math.random() * (totalImages - 2 + 1)) + 1;
        const numberArtificial = totalImages - numberReal

     // get all real and artifical images  
var allReal = await strapi.entityService.findMany('api::image.image', {
    filters: {
        real: true
    },
    fields: ['id', 'real', 'filename'],
    populate: { 
        comparisons: { count: true}
    }
})

var allArtificial = await strapi.entityService.findMany('api::image.image', {
    filters: {
        real: false
    },
    fields: ['id', 'real', 'filename'],
    populate: { 
        comparisons: { count: true}
    }
})

// order by number of comparisons
allReal = _.sortBy(allReal, [function(o) { return o.comparisons.count}])
allArtificial = _.sortBy(allArtificial, [function(o) { return o.comparisons.count}])

// get correct number of least scored images
const realToGrade = allReal.slice(0, numberReal)
const artificialToGrade = allArtificial.slice(0, numberArtificial)

// shuffle images together
const images = _.shuffle(realToGrade.concat(artificialToGrade))

        return images

    },

    imageFromFilename: async (ctx, next) => { 
         let {filename} = ctx.request.params
        
        const url = process.env.BUCKET_URL + filename
        
        const response = await axios.get(url,  { responseType: 'arraybuffer' })
        const buffer = Buffer.from(response.data, "binary").toString('base64')
        return buffer    },

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
    imagesForThatOrgan = _.sortBy(imagesForThatOrgan, [function(o) { return o.scores.count}])

    const imagesToGrade = imagesForThatOrgan.slice(0, numberRequired)
 

    toReturn.push({
        organ_type: organ_name,
        images: imagesToGrade
    })
}



        return toReturn
    }
}

));
