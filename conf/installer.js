var ftproot;

ftproot = '/web/earthquake-hazard-tool';

module.exports = {
  configFile: __dirname + '/config.json',
  downloader: {
    ftp: {
      host: 'hazards.cr.usgs.gov',
      port: 21
    }
  },
  metadataFile: __dirname + '/../etc/metadata.sql',
  nonInteractive: process.env.NON_INTERACTIVE === 'true',
  parser: {
    numHeaderRows: 3
  },
  schemaFile: __dirname + '/../etc/schema.sql',
  dataFiles: [
    {
      edition: 'E2014R1',
      imt: 'SA0P2',
      path: `${ftproot}/E2014R1_COUS0P05_SA0P2_760_Curves.tar.gz`,
      region: 'COUS0P05',
      vs30: '760'
    },
    {
      edition: 'E2014R1',
      imt: 'SA1P0',
      path: `${ftproot}/E2014R1_COUS0P05_SA1P0_760_Curves.tar.gz`,
      region: 'COUS0P05',
      vs30: '760'
    },
    {
      edition: 'E2014R1',
      imt: 'PGA',
      path: `${ftproot}/E2014R1_COUS0P05_PGA_760_Curves.tar.gz`,
      region: 'COUS0P05',
      vs30: '760'
    }
  ]
};
