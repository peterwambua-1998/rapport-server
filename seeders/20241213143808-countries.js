'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const countries = [
      { id: 1, iso: 'AF', name: 'AFGHANISTAN', nicename: 'Afghanistan', iso3: 'AFG', numcode: 4, phonecode: 93 },
      { id: 2, iso: 'AL', name: 'ALBANIA', nicename: 'Albania', iso3: 'ALB', numcode: 8, phonecode: 355 },
      { id: 3, iso: 'DZ', name: 'ALGERIA', nicename: 'Algeria', iso3: 'DZA', numcode: 12, phonecode: 213 },
      { id: 4, iso: 'AS', name: 'AMERICAN SAMOA', nicename: 'American Samoa', iso3: 'ASM', numcode: 16, phonecode: 1684 },
      { id: 5, iso: 'AD', name: 'ANDORRA', nicename: 'Andorra', iso3: 'AND', numcode: 20, phonecode: 376 },
      { id: 6, iso: 'AO', name: 'ANGOLA', nicename: 'Angola', iso3: 'AGO', numcode: 24, phonecode: 244 },
      { id: 7, iso: 'AI', name: 'ANGUILLA', nicename: 'Anguilla', iso3: 'AIA', numcode: 660, phonecode: 1264 },
      { id: 8, iso: 'AQ', name: 'ANTARCTICA', nicename: 'Antarctica', iso3: null, numcode: null, phonecode: 0 },
      { id: 9, iso: 'AG', name: 'ANTIGUA AND BARBUDA', nicename: 'Antigua and Barbuda', iso3: 'ATG', numcode: 28, phonecode: 1268 },
      { id: 10, iso: 'AR', name: 'ARGENTINA', nicename: 'Argentina', iso3: 'ARG', numcode: 32, phonecode: 54 },
      { id: 11, iso: 'AM', name: 'ARMENIA', nicename: 'Armenia', iso3: 'ARM', numcode: 51, phonecode: 374 },
      { id: 12, iso: 'AW', name: 'ARUBA', nicename: 'Aruba', iso3: 'ABW', numcode: 533, phonecode: 297 },
      { id: 13, iso: 'AU', name: 'AUSTRALIA', nicename: 'Australia', iso3: 'AUS', numcode: 36, phonecode: 61 },
      { id: 14, iso: 'AT', name: 'AUSTRIA', nicename: 'Austria', iso3: 'AUT', numcode: 40, phonecode: 43 },
      { id: 15, iso: 'AZ', name: 'AZERBAIJAN', nicename: 'Azerbaijan', iso3: 'AZE', numcode: 31, phonecode: 994 },
      { id: 16, iso: 'BS', name: 'BAHAMAS', nicename: 'Bahamas', iso3: 'BHS', numcode: 44, phonecode: 1242 },
      { id: 17, iso: 'BH', name: 'BAHRAIN', nicename: 'Bahrain', iso3: 'BHR', numcode: 48, phonecode: 973 },
      { id: 18, iso: 'BD', name: 'BANGLADESH', nicename: 'Bangladesh', iso3: 'BGD', numcode: 50, phonecode: 880 },
      { id: 19, iso: 'BB', name: 'BARBADOS', nicename: 'Barbados', iso3: 'BRB', numcode: 52, phonecode: 1246 },
      { id: 20, iso: 'BY', name: 'BELARUS', nicename: 'Belarus', iso3: 'BLR', numcode: 112, phonecode: 375 },
      { id: 21, iso: 'BE', name: 'BELGIUM', nicename: 'Belgium', iso3: 'BEL', numcode: 56, phonecode: 32 },
      { id: 22, iso: 'BZ', name: 'BELIZE', nicename: 'Belize', iso3: 'BLZ', numcode: 84, phonecode: 501 },
      { id: 23, iso: 'BJ', name: 'BENIN', nicename: 'Benin', iso3: 'BEN', numcode: 204, phonecode: 229 },
      { id: 24, iso: 'BM', name: 'BERMUDA', nicename: 'Bermuda', iso3: 'BMU', numcode: 60, phonecode: 1441 },
      { id: 25, iso: 'BT', name: 'BHUTAN', nicename: 'Bhutan', iso3: 'BTN', numcode: 64, phonecode: 975 },
      { id: 26, iso: 'BO', name: 'BOLIVIA', nicename: 'Bolivia', iso3: 'BOL', numcode: 68, phonecode: 591 },
      { id: 27, iso: 'BA', name: 'BOSNIA AND HERZEGOVINA', nicename: 'Bosnia and Herzegovina', iso3: 'BIH', numcode: 70, phonecode: 387 },
      { id: 28, iso: 'BW', name: 'BOTSWANA', nicename: 'Botswana', iso3: 'BWA', numcode: 72, phonecode: 267 },
      { id: 29, iso: 'BV', name: 'BOUVET ISLAND', nicename: 'Bouvet Island', iso3: null, numcode: null, phonecode: 0 },
      { id: 30, iso: 'BR', name: 'BRAZIL', nicename: 'Brazil', iso3: 'BRA', numcode: 76, phonecode: 55 },
      { id: 31, iso: 'IO', name: 'BRITISH INDIAN OCEAN TERRITORY', nicename: 'British Indian Ocean Territory', iso3: null, numcode: null, phonecode: 246 },
      { id: 32, iso: 'BN', name: 'BRUNEI DARUSSALAM', nicename: 'Brunei Darussalam', iso3: 'BRN', numcode: 96, phonecode: 673 },
      { id: 33, iso: 'BG', name: 'BULGARIA', nicename: 'Bulgaria', iso3: 'BGR', numcode: 100, phonecode: 359 },
      { id: 34, iso: 'BF', name: 'BURKINA FASO', nicename: 'Burkina Faso', iso3: 'BFA', numcode: 854, phonecode: 226 },
      { id: 35, iso: 'BI', name: 'BURUNDI', nicename: 'Burundi', iso3: 'BDI', numcode: 108, phonecode: 257 },
      { id: 36, iso: 'KH', name: 'CAMBODIA', nicename: 'Cambodia', iso3: 'KHM', numcode: 116, phonecode: 855 },
      { id: 37, iso: 'CM', name: 'CAMEROON', nicename: 'Cameroon', iso3: 'CMR', numcode: 120, phonecode: 237 },
      { id: 38, iso: 'CA', name: 'CANADA', nicename: 'Canada', iso3: 'CAN', numcode: 124, phonecode: 1 },
      { id: 39, iso: 'CV', name: 'CAPE VERDE', nicename: 'Cape Verde', iso3: 'CPV', numcode: 132, phonecode: 238 },
      { id: 40, iso: 'KY', name: 'CAYMAN ISLANDS', nicename: 'Cayman Islands', iso3: 'CYM', numcode: 136, phonecode: 1345 },
      { id: 41, iso: 'CF', name: 'CENTRAL AFRICAN REPUBLIC', nicename: 'Central African Republic', iso3: 'CAF', numcode: 140, phonecode: 236 },
    ];
    await queryInterface.bulkInsert('Countries', countries, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Countries', null, {});
  }
}; 
