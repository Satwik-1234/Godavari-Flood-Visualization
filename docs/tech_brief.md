# ⚙️ Technical Brief: Optimization Strategy

## The Challenge
The Godavari study area covers thousands of square kilometers. Running a standard `reduceRegion` on 10m Sentinel-1 pixels frequently triggers **Computation Timed Out** or **Memory Exceeded** errors in GEE.

## The Solution: `reduceResolution`
Instead of counting every single 10m pixel on the fly, we employ a statistical resampling technique:

### Code Logic
```javascript
function fractionalArea(maskBool, coarseScale) {
  var frac = maskBool
    .unmask(0)
    .reduceResolution({
      reducer: ee.Reducer.mean(),
      bestEffort: true,
      maxPixels: 1024
    })
    .reproject({
      crs: maskBool.projection(),
      scale: coarseScale
    });
  return frac.multiply(ee.Image.pixelArea());
}
