import { pool } from './db.js';
import { io } from '../backend/server.js'; // adjust path as needed

export const CompareMoistureData = async (topic, message, plantID) => {
  try {
    const SensorValue = parseFloat(message.toString());

    // Fetch calibration and threshold values for the plant
    const [rows] = await pool.execute(
      `SELECT min_percentage, max_percentage, min_sensor_output, max_sensor_output
       FROM plants
       WHERE id = ?`,
      [plantID]
    );

    if (rows.length === 0) {
      console.error(`No data found for plant ${plantID}`);
      return;
    }

    const { min_percentage, max_percentage, min_sensor_output, max_sensor_output } = rows[0];

    // Calculate moisture percentage
    let MoisturePercent = 100 * (max_sensor_output - SensorValue) / (max_sensor_output - min_sensor_output);
    MoisturePercent = Math.max(0, Math.min(100, Math.round(MoisturePercent)));

    console.log(`Moisture Percentage: ${MoisturePercent}% (Sensor Value: ${SensorValue})`);

    // Emit notifications based on thresholds
    if (MoisturePercent < min_percentage) {
      const message = `Moisture too low for plant ${plantID}! (${MoisturePercent}%)`;
      console.warn(message);
      io.emit('notification', { type: 'warning', message });
    } 
    else if (MoisturePercent > max_percentage) {
      const message = `Moisture too high for plant ${plantID}! (${MoisturePercent}%)`;
      console.warn(message);
      io.emit('notification', { type: 'warning', message });
    } 
    else {
      const message = `Moisture is normal for plant ${plantID}. (${MoisturePercent}%)`;
      console.log(message);
      io.emit('notification', { type: 'success', message });
    }

  } catch (error) {
    console.error('Error processing moisture data:', error);
    io.emit('notification', { type: 'error', message: 'Error processing moisture data.' });
  }
};
