console.log('Loading function');

const aws = require('aws-sdk');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

exports.handler = async (event, context) => {
	//console.log('Received event:', JSON.stringify(event, null, 2));

	// Get the object from the event and show its content type
	let images;

	const bucket = event.Records[0].s3.bucket.name;
	const key = decodeURIComponent(
		event.Records[0].s3.object.key.replace(/\+/g, ' ')
	);
	const params = {
		Bucket: bucket,
		Key: 'images.json',
	};
	try {
		images = await s3.getObject(params).promise();
		images = JSON.parse(images.Body.toString('utf-8'));
		console.log(images);
		return images;
	} catch (err) {
		if (err.message !== 'The specified key does not exist.') {
			console.log(err);
		} else {
			images = [];
		}
	}

	let object = event['Records'][0]['s3']['object'];

	let metaData = {
		Name: object.key,
		size: object.size,
		type: object.key.slice(-4),
	};

	images.push(metaData);

	console.log(images);
	let params2 = {
		Body: JSON.stringify(images),
		Bucket: bucket,
		Key: 'images.json',
		ContentType: 'application/json',
	};

	s3.putObject(params2, (err, results) => {
		if (err) {
			console.log(err);
		} else {
			console.log(results);
		}
	});
}; // Closed handler
