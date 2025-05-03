import { pool } from './db.js';

export const CompareTemperatureData = async (topic, message, selectedID) => {
    try {
      const SensorValue = parseFloat(message.toString());
  
      // Fetch calibration and threshold values for selected plant
      const [rows] = await pool.execute(
        `SELECT min_temp, max_temp
         FROM plants
         WHERE id = ?`,
        [selectedID]
      );
  
      if (rows.length === 0) {
        console.error(`No data found for plant ${selectedID}`);
        return;
      }
  
        const {
            min_temp,
            max_temp,
            } = rows[0];
  

      // Compares with thresholds
        if (SensorValue < min_temp) {
        console.log(`The current temperature is too low for plant ${selectedID}! Current temperature - ${SensorValue}.
                    Minimum temperature is ${min_temp}.`);
        } 

        else if (SensorValue > max_temp) {
        console.log(` The current temperature is too high for plant ${selectedID}! Current temperature - ${SensorValue}.
                    Maximum temperature is ${max_temp}.`);
        }
                    
        else{
            console.log("Temperature levels are within the ideal range!")
        }
    } 
    catch (error) {
        console.error('Error in recieving data.', error);
    }
  };