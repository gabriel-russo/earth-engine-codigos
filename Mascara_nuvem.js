var image = ee.Image('COPERNICUS/S2/20190703T050701_20190703T052312_T43PGP')
var rgbVis = {
  min: 0.0,
  max: 3000,
  bands: ['B4', 'B3', 'B2'],
};

Map.centerObject(image)
Map.addLayer(image, rgbVis, 'Full Image', false)

// Write a function for Cloud masking
function maskS2clouds(image) {
  var qa = image.select('QA60')
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0).and(
             qa.bitwiseAnd(cirrusBitMask).eq(0))
  return image.updateMask(mask)
      .select("B.*")
      .copyProperties(image, ["system:time_start"])
}

var maskedImage = ee.Image(maskS2clouds(image))
Map.addLayer(maskedImage, rgbVis, 'Masked Image')
