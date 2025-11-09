const express = require('express');
const axios = require('axios');
const app = express();
require('dotenv').config();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = process.env.HUBSPOT_API_KEY;
const CITY_OBJECT_ID = '2-194431662'; // ✅ الـ ID بتاع City object

// 🏠 ROUTE 1 - عرض كل المدن
app.get('/', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${CITY_OBJECT_ID}?properties=name&properties=state&properties=zipcode`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  try {
    const response = await axios.get(url, { headers });
    const data = response.data.results.map(obj => ({
      id: obj.id,
      name: obj.properties.name,
      state: obj.properties.state,
      zipcode: obj.properties.zipcode
    }));

    res.render('homepage', { title: 'City Records | HubSpot Practicum', data });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('Error fetching cities');
  }
});

// 📝 ROUTE 2 - صفحة إضافة/تحديث مدينة
app.get('/update-city', (req, res) => {
  res.render('updates', { title: 'Add or Update City | HubSpot Practicum' });
});

// 🚀 ROUTE 3 - POST لإضافة مدينة جديدة
app.post('/update-city', async (req, res) => {
  const url = `https://api.hubapi.com/crm/v3/objects/${CITY_OBJECT_ID}`;
  const headers = {
    Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    'Content-Type': 'application/json'
  };

  const newCity = {
    properties: {
      name: req.body.name,
      state: req.body.state,
      zipcode: req.body.zipcode
    }
  };

  try {
    await axios.post(url, newCity, { headers });
    res.redirect('/');
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).send('Error adding new city');
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
