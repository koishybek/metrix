
import axios from 'axios';

const token = 'fc186709d0cf8bfa4bf5d8567c2456c3178abb51';
const baseUrl = 'https://sm.iot-exp.kz/api/v1/meter/';
const serial = '10743471';

async function checkApi() {
  try {
    console.log(`Checking API for serial: ${serial}`);
    const url = `${baseUrl}${serial}`;
    console.log(`URL: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Success!');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Data:', error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

checkApi();
