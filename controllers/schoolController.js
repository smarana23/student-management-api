const db = require("../config/db");

// create school API
const createschool = (req, res) => {

  const { name, address, latitude, longitude } = req.body;

  // checking empty fields
  if (
    !name ||
    !address ||
    latitude === undefined ||
    longitude === undefined
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  // checking duplicate school
  const checkSchoolQuery =
    "SELECT * FROM schools WHERE name = ?";

  db.query(checkSchoolQuery, [name], (err, data) => {

    if (err) {
      return res.status(500).json({
        message: "Database error",
      });
    }

    // school already exists
    if (data.length > 0) {
      return res.status(400).json({
        message: "School already exists",
      });
    }

    // insert query
    const insertQuery =
      "INSERT INTO schools(name,address,latitude,longitude) VALUES(?,?,?,?)";

    db.query(
      insertQuery,
      [name, address, latitude, longitude],
      (err, result) => {

        if (err) {
          return res.status(500).json({
            message: "Internal server error",
          });
        }

        res.status(201).json({
          success: true,
          message: "New School added",
        });

      }
    );

  });

};

// get schools API
const getschools = (req, res) => {

  const studentLatitude = parseFloat(req.query.latitude);
  const studentLongitude = parseFloat(req.query.longitude);

  // validating coordinates
  if (
    isNaN(studentLatitude) ||
    isNaN(studentLongitude)
  ) {
    return res.status(400).json({
      message: "Invalid coordinates",
    });
  }

  const sql = "SELECT * FROM schools";

  db.query(sql, (err, results) => {

    if (err) {
      return res.status(500).json({
        message: "Internal server error",
      });
    }

    // calculating nearest schools
    const nearestSchools = results.map((school) => {

      const distance = Math.sqrt(
        Math.pow(school.latitude - studentLatitude, 2) +
        Math.pow(school.longitude - studentLongitude, 2)
      );

      return {
        ...school,
        distance,
      };

    });

    // sorting nearest schools
    nearestSchools.sort(
      (a, b) => a.distance - b.distance
    );

    res.status(200).json({
      success: true,
      totalSchools: nearestSchools.length,
      data: nearestSchools,
    });

  });

};

module.exports = {
  createschool,
  getschools,
};