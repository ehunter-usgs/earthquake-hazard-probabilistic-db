var ftproot;

ftproot = 'ftp://hazards.cr.usgs.gov/web/earthquake-hazard-tool';

module.exports = {
  configFile: __dirname + '/../conf/config.json',
  nonInteractive: process.env.NON_INTERACTIVE === 'true',
  schemaFile: __dirname + '/../database/schema.sql',
  dataFiles: [
    {
      edition: '2014R1',
      imt: 'SA0P2',
      region: 'COUS0P05',
      url: `${ftproot}/E2014R1_COUS0P05_SA0P2_760_Curves.tar.gz`,
      vs30: '760'
    },
    {
      edition: '2014R1',
      imt: 'SA1P0',
      region: 'COUS0P05',
      url: `${ftproot}/E2014R1_COUS0P05_SA1P0_760_Curves.tar.gz`,
      vs30: '760'
    },
    {
      edition: '2014R1',
      imt: 'PGA',
      region: 'COUS0P05',
      url: `${ftproot}/E2014R1_COUS0P05_PGA_760_Curves.tar.gz`,
      vs30: '760'
    }
  ]
};
