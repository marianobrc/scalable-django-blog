const { Stack } = require('aws-cdk-lib');
const cdk = require('aws-cdk-lib');
const s3 = require('aws-cdk-lib/aws-s3')
const s3Deploy = require('aws-cdk-lib/aws-s3-deployment')
const cloudfront = require('aws-cdk-lib/aws-cloudfront')
const certManager = require('aws-cdk-lib/aws-certificatemanager');


class PersonalWebsiteStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props)
    const { certificateArn, domainNames } = props
    const certificate = certManager.Certificate.fromCertificateArn(this, `SSLCertificate`, certificateArn);
    // S3 bucket to store teh static website
    const bucketID = `PersonalWebsiteBucket`
    this.bucket = new s3.Bucket(this, bucketID, {
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
    })

    // Create an Origin Access Identity to allow CloudFront access this bucket
    this.oia = new cloudfront.OriginAccessIdentity(this, `${bucketID}OIA`, {
      comment: 'OIA created by CDK',
    })
    this.bucket.grantRead(this.oia)

    // Deployment
    // eslint-disable-next-line no-new
    new s3Deploy.BucketDeployment(this, `DeployPersonalWebsite`, {
      sources: [s3Deploy.Source.asset('../', {
        exclude: [
          'node_modules',
          '.git',
          'cdk.out'
        ]
      })],
      destinationBucket: this.bucket,
    })

    // Cloudfront
    this.cloudfrontDistro = new cloudfront.CloudFrontWebDistribution(
      this,
      `PersonalWebsiteCloudfrontDistribution`,
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: this.bucket,
              originAccessIdentity: this.oia,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
        errorConfigurations: [
          {
            errorCode: 403,
            responseCode: 200,
            responsePagePath: '/index.html',
          },
          {
            errorCode: 404,
            responseCode: 200,
            responsePagePath: '/index.html',
          },
        ],
        viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(
          certificate,{
            aliases: domainNames
          })
      },
    )
  }
}

module.exports = { PersonalWebsiteStack }

