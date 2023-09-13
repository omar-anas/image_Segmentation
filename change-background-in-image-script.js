const img = document.getElementById('image');
const canvas = document.getElementById('canvas');

function loadImage(imageURL) {
    img.onload = removeBackground;  
    img.src = imageURL;
}

async function removeBackground() {
    //Load the body-pix model with default configurations
    const net = await bodyPix.load();

    //Perform body segmentation
    const segmentation = await net.segmentPerson(img, {
      segmentationThreshold: 0.7,
      internalResolution: 'full'
    });
    
    //Set the canvas dimensions same as the image
    canvas.width = img.width;
    canvas.height = img.height;

    //Draw the image on to the canvas
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);

    //Get the imgData to get the pixels of the image displayed in the canvas
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    //Loop through the pixels in the image
    for(let i = 0; i < imgData.data.length; i+=4) {
      let pixelIndex = i/4;
      //Make the pixel transparent if it does not belong to a person using the body-pix model's output data array.
      //This removes all pixels corresponding to the background.
      if(segmentation.data[pixelIndex] == 0) {
        imgData.data[i + 3] = 0;
      }
    }

    //Draw the updated image on the canvas
    ctx.putImageData(imgData, 0, 0);
}
