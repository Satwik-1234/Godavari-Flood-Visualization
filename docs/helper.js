// =========================================
// 📸 ASSET GENERATION HELPER
// =========================================

// 1. Create a "Thumbnail" view for the README
// Use the 'Inspector' to find a nice meander in the river
Map.setOptions('SATELLITE');

// 2. Export High-Quality Tiff (Optional)
Export.image.toDrive({
  image: floodMaskBool.selfMask().visualize({palette:['yellow']}),
  description: 'Godavari_Flood_Map_HQ',
  region: studyArea,
  scale: 30,
  maxPixels: 1e13
});
