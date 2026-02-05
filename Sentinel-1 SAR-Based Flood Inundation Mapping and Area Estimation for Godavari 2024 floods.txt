var studyArea = 
    /* color: #0b4a8b */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[78.7616536556378, 21.642636326108114],
          [78.7616536556378, 18.20379866913346],
          [80.9699056087628, 18.20379866913346],
          [80.9699056087628, 21.642636326108114]]], null, false);

// ======= Inputs =======
Map.addLayer(studyArea, {color: 'red'}, 'Study Area');
Map.centerObject(studyArea);

// Sentinel-1 collection (VH)
var collection = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .filterBounds(studyArea);

// ======= Date filters (fixed date format) =======
var beforeFlood = collection.filter(ee.Filter.date('2024-06-01', '2024-06-30'));
var afterFlood  = collection.filter(ee.Filter.date('2024-09-09', '2024-09-15'));

// quick check (prints collection size to console; safe for small areas)
print('Before size:', beforeFlood.size());
print('After size :', afterFlood.size());

// ======= Build composites (median is safer than mosaic) =======
var beforeImage = beforeFlood.select('VH').median().clip(studyArea);
var afterImage  = afterFlood.select('VH').median().clip(studyArea);

// Optional: small smoothing. Reduce kernel if it's slow.
var beforeFiltered = beforeImage.focal_median(10, 'circle', 'meters');
var afterFiltered  = afterImage.focal_median(10, 'circle', 'meters');

Map.addLayer(beforeFiltered, {min: -25, max: 0}, 'Before (filtered)');
Map.addLayer(afterFiltered,  {min: -25, max: 0}, 'After (filtered)');

// ======= Flood / water masks (boolean) =======
var floodMaskBool = beforeFiltered.gt(-20).and(afterFiltered.lt(-20)); // newly inundated
var waterMaskBool = beforeFiltered.lt(-20).and(afterFiltered.lt(-20)); // persistent water

// Show masks (masked to visualize)
Map.addLayer(floodMaskBool.selfMask(), {palette:['yellow']}, 'Flood Inundation');
Map.addLayer(waterMaskBool.selfMask(), {palette:['blue']}, 'Water Bodies');

// ======= Efficient area calculation =======
// 1) Total study area from vector geometry (fast & exact)
var totalAreaKm2 = ee.Number(studyArea.geometry().area()).divide(1e6);
print('Total study area (sq.km):', totalAreaKm2);

// 2) Compute fractional coverage at coarse resolution to avoid huge reduceRegion
//    - unmask(0) -> turns booleans into 0/1 numeric values
//    - reduceResolution( mean ) => computes fraction of fine pixels that are 1 inside each coarse pixel
//    - reproject to a coarse scale (here 100 m) so we sum far fewer pixels
function fractionalArea(maskBool, coarseScale) {
  var frac = maskBool
    .unmask(0)                                     // 0/1 image
    .reduceResolution({                            // aggregate to fractions
      reducer: ee.Reducer.mean(),
      bestEffort: true,
      maxPixels: 1024
    })
    .reproject({
      crs: maskBool.projection(),                  // keep same CRS
      scale: coarseScale
    });
  // multiply fraction * area of each coarse pixel
  var areaImg = frac.multiply(ee.Image.pixelArea());
  return areaImg;
}

var coarseScale = 100; // meters — change to 50 or 200 if you want finer/coarser (tradeoff: accuracy vs memory)
var floodAreaImg = fractionalArea(floodMaskBool, coarseScale);
var waterAreaImg = fractionalArea(waterMaskBool, coarseScale);

// reduceRegion: use a coarser scale and a tileScale to reduce server memory usage
var opts = {
  reducer: ee.Reducer.sum(),
  geometry: studyArea.geometry(),
  scale: coarseScale,
  maxPixels: 1e13,
  tileScale: 8   // increase if you still hit capacity errors (try 4,8,16)
};

var floodAreaSqM = floodAreaImg.reduceRegion(opts).get('area');
var waterAreaSqM = waterAreaImg.reduceRegion(opts).get('area');

var floodAreaKm2 = ee.Number(floodAreaSqM).divide(1e6);
var waterAreaKm2 = ee.Number(waterAreaSqM).divide(1e6);

print('Flooded area (sq.km):', floodAreaKm2);
print('Waterbody area (sq.km):', waterAreaKm2);

// ======= Legend (unchanged) =======
var legend = ui.Panel({style: {position: 'bottom-left', padding: '8px 15px'}});

var legendTitle = ui.Label({
  value: 'Legend',
  style: {fontWeight: 'bold', fontSize: '20px', margin: '0 0 4px 0'}
});
legend.add(legendTitle);

var makeRow = function(color, name) {
  return ui.Panel({
    widgets: [
      ui.Label({style: {backgroundColor: color, padding: '14px', margin: '0 0 4px 0'}}),
      ui.Label({value: name, style: {margin: '0 0 4px 6px'}})
    ],
    layout: ui.Panel.Layout.Flow('horizontal')
  });
};

legend.add(makeRow('yellow', 'Flood Inundation'));
legend.add(makeRow('blue', 'Water Bodies'));
Map.add(legend);
