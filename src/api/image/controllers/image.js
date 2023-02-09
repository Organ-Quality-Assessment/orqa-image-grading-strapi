'use strict';

/**
 * image controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::image.image', ({strapi}) => ({
    imagesToGrade: async (ctx, next) => {
        const totalImages = 6
        // get images user wants to grade
        let {organs} = ctx.request.query
        organs = organs.split(',')
        
        // split images into the selected organs
        const numberOrgans = organs.length
        const numberImagesPerOrgan = []
console.log(numberOrgans)
        var number1 = 10,
    number2 = 3;

if (totalImages % numberOrgans == 0) {
    console.log('even')
   // images split evenyly across organs
    const imagesPerOrgan = totalImages/numberOrgans
    // populate list
    for (var i=0; i < (numberOrgans.length-1); i++) {
        console.log('here')
        console.log(imagesPerOrgan)
        numberImagesPerOrgan.push(imagesPerOrgan)
    }
    console.log(numberImagesPerOrgan)
} else {
    // images are not going to split evenly
    var remainder = totalImages%numberOrgans;
    var wholes = Math.floor(totalImages / numberOrgans);

    var output = '';

    for (var i = 0; i < (wholes - 1); i++) {
        numberImagesPerOrgan.push(output)
     output+= numberOrgans + ', ';
    }
    
    output += (numberOrgans + remainder);
    
    
}
console.log(numberImagesPerOrgan)
        return 'test'
    }
}

));
