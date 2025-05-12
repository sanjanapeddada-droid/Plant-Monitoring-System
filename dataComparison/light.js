import { pool } from './db.js';

export const CompareLightData = async (topic, message, selectedID) => {
  try {
    const lightValue = parseFloat(message.toString());

    // Fetch light requirement category for the plant
    const [rows] = await pool.execute(
      `SELECT light_requirement FROM plants WHERE id = ?`,
      [selectedID]
    );

    if (rows.length === 0) {
      console.error(`No data found for plant ${selectedID}`);
      return;
    }

    const { light_requirement } = rows[0];

    // Define lux ranges for light categories (based on horticultural standards)
    const lightRanges = {
      'Full sun exposure': [10000, 20000],     // e.g., direct sunlight
      'Partial sun exposure': [3000, 10000],   // e.g., indirect or filtered light
      'Low sun exposure': [300, 3000],         // e.g., shade-tolerant conditions
    };

    const [minLux, maxLux] = lightRanges[light_requirement] || [];

    if (!minLux || !maxLux) {
      console.error(`Unknown light requirement: ${light_requirement}`);
      return;
    }

    console.log(`Light Intensity: ${lightValue} lux (Requirement: ${light_requirement})`);

    // Compare current reading to range
    if (lightValue < minLux) {
      console.log(` Light too low for plant ${selectedID}! Current: ${lightValue} lux. Needs at least ${minLux} lux.`);
    } else if (lightValue > maxLux) {
      console.log(` Light too high for plant ${selectedID}! Current: ${lightValue} lux. Should be below ${maxLux} lux.`);
    } else {
      console.log(" Light levels are within the ideal range!");
    }

  } catch (error) {
    console.error('Error receiving light data.', error);
  }
};
