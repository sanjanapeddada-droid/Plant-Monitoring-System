import { pool } from './db.js';


export const CompareMoistureData = async (topic, message, selectedID) => {
    try {
      const SensorValue = parseFloat(message.toString());
  
      // Fetch calibration and threshold values for selected plant
      const [rows] = await pool.execute(
        `SELECT min_percentage, max_percentage, min_sensor_output, max_sensor_output
         FROM plants
         WHERE id = ?`,
        [selectedID]
      );
  
      if (rows.length === 0) {
        console.error(`No data found for plant ${selectedID}`);
        return;
      }
  
        const {
            min_percentage,
            max_percentage,
            min_sensor_output,
            max_sensor_output,
            } = rows[0];
  

      // Convert sensor value to calibrated percentage
        let MoisturePercent = 100 * (max_sensor_output - SensorValue) / (max_sensor_output - min_sensor_output);
        MoisturePercent = Math.max(0, Math.min(100, Math.round(MoisturePercent))); // Clamps between 0–100%
        console.log(` Moisture Percentage: ${MoisturePercent}% (Sensor Value: ${SensorValue})`);

      // Compares with thresholds
        if (MoisturePercent < min_percentage) {
        console.log(`Moisture levels are too low for plant ${selectedID}! Current moisture percentage - ${MoisturePercent}%.
                    Minimum moisture percentage is ${min_percentage}.`);
        } 

        else if (MoisturePercent > max_percentage) {
        console.log(` Moisture levels are too high for plant ${selectedID}! Current moisture percentage - ${MoisturePercent}%.
                    Maximum moisture percentage is ${max_percentage}.`);
        }
                    
        else{
            console.log("Moisture levels are within the ideal range!")
        }
    } 
    catch (error) {
        console.error('Error in recieving data.', error);
    }
  };