'use strict';

// Development specific configuration
// ==================================
module.exports = {

  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/temp-dev'
  },

  // Server port
  port: process.env.PORT || 9000,

  // Seed database on startup
  seedDB: true

};
