---

# 📊 Flood Analysis Results: Godavari Basin (Sept 2024)

This document summarizes the quantitative findings of the Sentinel-1 SAR change detection analysis for the Godavari River Basin during the September 2024 monsoon surge.

## 📈 Executive Summary: Basin Statistics

The analysis covers a massive hydrological window of the middle and lower Godavari reaches. The primary finding is a **74.6% increase** in total surface water area during the peak flood window compared to the June baseline.

| Feature | Area (sq. km) | % of Study Area |
| --- | --- | --- |
| **Total Study Area** |$88,002.70$|$100\%$|
| **Permanent Waterbodies** |$1,833.19$|$2.08\%$|
| **Inundated Area (Flood)** | $1,368.68$|$1.56\%$ |
| **Total Liquid Surface** |$3,201.87$|$3.64\%$|

---
## Basin Characteristics
The Godavari is India's second-longest river. The study area focuses on the transition zone between the **Pranhita-Godavari confluence**. This region is hydraulically complex due to:
* Backwater effects from downstream barrages.
* Flat topography leading to extensive lateral spreading.

## September 2024 Event Analysis
* **Trigger**: Late monsoon surge (Retreating Monsoon phase).
* **SAR Observation**: Sentinel-1 VH polarization.
* **Threshold Selection**: A cutoff of `-20 dB` was selected based on the bimodal distribution of the histogram.
    * **Dry Land**: > -15 dB
    * **Open Water**: < -22 dB
    * **Flooded Vegetation**: -18 to -20 dB (The "danger zone" for classification).

## Impact Areas
Visual inspection confirms inundation in:
1.  **Agricultural Belts**: Cotton and Chilli fields adjacent to the river banks.
2.  **Oxbow Lakes**: Reactivation of paleochannels near the meanders.
## 🌊 Hydraulic Interpretation

### 1. Inundation Magnitude

While  of the total basin area being "flooded" might seem small on paper, in the context of the Godavari, **** represents an area nearly **the size of Delhi** completely submerged.

### 2. The "Surge Ratio"

We define the **Surge Ratio ()** as:

$$R_s = \frac{\text{Area}_{flood}}{\text{Area}_{permanent}}$$

For this event, . This indicates that the flood event nearly doubled the visible water surface of the region, putting immense pressure on embankment infrastructure and riverside agricultural zones.

### 3. Spatial Distribution Trends

* **Confluence Zones:** Heavy inundation was detected at the junctions of the Godavari and its major tributaries (e.g., Pranhita), where backwater effects are most prominent.
* **Low-Lying Floodplains:** The optimized SAR thresholding successfully captured lateral spreading in the  slope zones.

---

## 🛠️ Data Reliability & Validation

### Backscatter Distribution

The results were derived using a **VH-polarized threshold of **.

* **Success:** This threshold effectively separated calm floodwaters from rough, dry soil.
* **Noise Handling:** By using a `coarseScale` of  for the reduction, we filtered out "speckle noise" (false positives) that often plagues 10m-resolution SAR raw data.

### Known Uncertainties

> [!IMPORTANT]
> **Hydraulic Roughness:** In areas of "Flooded Vegetation" (e.g., tall crops like sugarcane or paddy), the SAR signal may undergo double-bounce scattering, leading to a higher backscatter return that can mask the water underneath. The actual flooded area might be **5-8% higher** than the detected .

---

## 📅 Comparison: Godavari vs. Mahad

If we compare this to the Mahad (Savitri Basin) analysis, the Godavari event is characterized by **lateral spreading** (large area, shallow depth) whereas the Mahad event was characterized by **flash flooding** (localized, high velocity).

---
