const express = require('express');
const fs = require('fs');
const app = express();

//middleware
app.use(express.json());

// app.get('/', (req, res) => {
//   res.status(200).json({ Message: 'Hello from server', App: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can send data here');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);

app.get('/api/v1/tours', (req, res) => {
  //send json data to requester
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
  // id is string so multiplying by number it converts to a int. req.param gets id typed in url
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  if (id > tours.length) {
    res.status(404).json({
      status: 'failure',
      message: 'invalid ID',
    });
  }
  //send json data to requester
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

app.post('/api/v1/tours', (req, res) => {
  //gets new id by adding 1 to last array item.
  const newId = tours[tours.length - 1].id + 1;
  //body made combined with new id
  const newTour = Object.assign({ id: newId }, req.body);

  //tours is array of objects.
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      //201 means made something. send the requester back the new tour added only.
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

const port = 3000;
app.listen(port, () => {
  console.log(`the server is running on ${port}`);
});
