INSERT INTO imt (value, display, displayorder) VALUES
  ('PGA',    'Peak Ground Acceleration',           1),
  ('PGV',    'Peak Ground Velocity',               2),
  ('SA0P1',  '0.10 Second Spectral Acceleration',  3),
  ('SA0P2',  '0.20 Second Spectral Acceleration',  4),
  ('SA0P3',  '0.30 Second Spectral Acceleration',  5),
  ('SA0P5',  '0.50 Second Spectral Acceleration',  6),
  ('SA0P75', '0.75 Second Spectral Acceleration',  7),
  ('SA1P0',  '1.00 Second Spectral Acceleration',  8),
  ('SA2P0',  '2.00 Second Spectral Acceleration',  9),
  ('SA3P0',  '3.00 Second Spectral Acceleration', 10),
  ('SA4P0',  '4.00 Second Spectral Acceleration', 11),
  ('SA5P0',  '5.00 Second Spectral Acceleration', 12)
);

INSERT INTO vs30 (value, display, displayorder) VALUES
  ('2000', '2000 m/s - Site Class A', 1),
  ('1150', '1150 m/s - Site Class B', 2),
  ('760',  '760 m/s - B/C Boundary',  3),
  ('537',  '537 m/s - Site Class C',  4),
  ('360',  '360 m/s - C/D Boundary',  5),
  ('259',  '259 m/s - Site Class D',  6),
  ('180',  '180 m/s - D/E Boundary',  7)
);

INSERT INTO vs30 (value, display, displayOrder) VALUES
  ('E2014R1', 'USGS NSHM 2014 Rev. 1', 10),
  ('E2008R3', 'USGS NSHM 2008 Rev. 3', 108),
  ('E2008R2', 'USGS NSHM 2008 Rev. 2', 109),
  ('E2008R1', 'USGS NSHM 2008 Rev. 1', 110)
);

INSERT INTO region (value, display, displayorder, minlatitude, maxlatitude,
    minlongitude, maxlongitude, gridspacing) VALUES
  ('COUS0P05', 'Conterminous U.S. w/ 0.05 Grid', 1, 24.6, 50.0, -125.0,
      -65.0, 0.05),
  ('WUS0P05', 'Western U.S. w/ 0.05 Grid', 2, 24.6, 50.0, -125.0,
      -100.0, 0.05),
  ('CEUS0P10', 'Central and Eastern U.S. w/ 0.10 Grid', 3, 24.6, 50.0, -115.0,
      -65.0, 0.10)
);
