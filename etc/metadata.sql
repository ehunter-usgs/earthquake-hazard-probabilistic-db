INSERT INTO imt (value, display, displayorder) VALUES
  ('PGA',    'Peak Ground Acceleration',           1);
INSERT INTO imt (value, display, displayorder) VALUES
  ('PGV',    'Peak Ground Velocity',               2);
INSERT INTO imt (value, display, displayorder) VALUES
  ('SA0P1',  '0.10 Second Spectral Acceleration',  3);
INSERT INTO imt (value, display, displayorder) VALUES
  ('SA0P2',  '0.20 Second Spectral Acceleration',  4);
INSERT INTO imt (value, display, displayorder) VALUES
  ('SA0P3',  '0.30 Second Spectral Acceleration',  5);
INSERT INTO imt (value, display, displayorder) VALUES
  ('SA0P5',  '0.50 Second Spectral Acceleration',  6);
INSERT INTO imt (value, display, displayorder) VALUES
  ('SA0P75', '0.75 Second Spectral Acceleration',  7);
INSERT INTO imt (value, display, displayorder) VALUES
  ('SA1P0',  '1.00 Second Spectral Acceleration',  8);
INSERT INTO imt (value, display, displayorder) VALUES
  ('SA2P0',  '2.00 Second Spectral Acceleration',  9);
INSERT INTO imt (value, display, displayorder) VALUES
  ('SA3P0',  '3.00 Second Spectral Acceleration', 10);
INSERT INTO imt (value, display, displayorder) VALUES
  ('SA4P0',  '4.00 Second Spectral Acceleration', 11);
INSERT INTO imt (value, display, displayorder) VALUES
  ('SA5P0',  '5.00 Second Spectral Acceleration', 12);


INSERT INTO vs30 (value, display, displayorder) VALUES
  ('2000', '2000 m/s - Site Class A', 1);
INSERT INTO vs30 (value, display, displayorder) VALUES
  ('1150', '1150 m/s - Site Class B', 2);
INSERT INTO vs30 (value, display, displayorder) VALUES
  ('760',  '760 m/s - B/C Boundary',  3);
INSERT INTO vs30 (value, display, displayorder) VALUES
  ('537',  '537 m/s - Site Class C',  4);
INSERT INTO vs30 (value, display, displayorder) VALUES
  ('360',  '360 m/s - C/D Boundary',  5);
INSERT INTO vs30 (value, display, displayorder) VALUES
  ('259',  '259 m/s - Site Class D',  6);
INSERT INTO vs30 (value, display, displayorder) VALUES
  ('180',  '180 m/s - D/E Boundary',  7);


INSERT INTO edition (value, display, displayOrder) VALUES
  ('E2014R1', 'USGS NSHM 2014 Rev. 1', 10);
INSERT INTO edition (value, display, displayOrder) VALUES
  ('E2008R3', 'USGS NSHM 2008 Rev. 3', 108);
INSERT INTO edition (value, display, displayOrder) VALUES
  ('E2008R2', 'USGS NSHM 2008 Rev. 2', 109);
INSERT INTO edition (value, display, displayOrder) VALUES
  ('E2008R1', 'USGS NSHM 2008 Rev. 1', 110);


INSERT INTO region (value, display, displayorder, minlatitude, maxlatitude,
    minlongitude, maxlongitude, gridspacing) VALUES
  ('COUS0P05', 'Conterminous U.S. w/ 0.05 Grid', 1, 24.6, 50.0, -125.0,
      -65.0, 0.05);
INSERT INTO region (value, display, displayorder, minlatitude, maxlatitude,
    minlongitude, maxlongitude, gridspacing) VALUES
  ('WUS0P05', 'Western U.S. w/ 0.05 Grid', 2, 24.6, 50.0, -125.0,
      -100.0, 0.05);
INSERT INTO region (value, display, displayorder, minlatitude, maxlatitude,
    minlongitude, maxlongitude, gridspacing) VALUES
  ('CEUS0P10', 'Central and Eastern U.S. w/ 0.10 Grid', 3, 24.6, 50.0, -115.0,
      -65.0, 0.10);
